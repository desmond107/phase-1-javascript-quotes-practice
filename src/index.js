document.addEventListener('DOMContentLoaded', () => {
    getAllQuotes()
    submitForm()
  })
  
  let quoteArr = []
  let likeId = 2
  let quoteList = document.querySelector('ul#quote-list')
  const newQuote = document.querySelector('form#new-quote-form')
  
  let getAllQuotes = () => {
    fetch('http://localhost:3000/quotes?_embed=likes')
      .then(res => res.json())
      .then(quotes => quoteArr = [...quotes])
      .then(quotes => quotes.forEach(quote => renderEachQuote(quote)))
    // .then(quotes => console.log(quotes))
  }
  
  
  /************* HELPER FUNCTIONS *************/
  let makeEl = el => document.createElement(el)
  let setClass = (el, name) => el.className = name
  let setContent = (el, content) => el.textContent = content
  
  let renderEachQuote = (input) => {
    // console.log(input)
    createCard(input) 
  }
  
  function createCard(input) {
    /*********** CREATE ELEMENTS FOR EACH CARD *******/
    const card = makeEl('li')
    const blockquote = makeEl('blockquote')
    const p = makeEl('p')
    const br = makeEl('br')
    const footer = makeEl('footer')
    const btnSuc = makeEl('button')
    const btnDan = makeEl('button')
  
    card.id = input.id
  
    //---------- SET CLASS TO EACH ELEMENT /-----------//
    setClass(card, 'quote-card')
    setClass(blockquote, 'blockquote')
    setClass(p, 'mb-0')
    setClass(footer, 'blockquote-footer')
    setClass(btnSuc, 'btn-success')
    setClass(btnDan, 'btn-danger')
  
    //------- SET TEXTCONTENT TO EACH ELEMENT --------//
    setContent(p, input.quote)
    setContent(footer, input.author)
    setContent(btnDan, 'Delete')
  
    btnSuc.innerHTML = `Likes: <span>${input.likes.length}</span>`  
  
    //----------- HANDLE SUCCESS BUTTON --------------// 
    btnSuc.addEventListener('click', (e) => {
      let times = e.target.textContent.split(' ')
      // const currentQuoteId = e.target.parentNod.id
      // console.log('e.target.parentNode:', e.target.parentNode)
      times[1] = Number(times[1]) + 1
      btnSuc.innerHTML = `Likes: <span>${times[1]}</span>`
  
      let currentTime = Math.round((new Date()).getTime() / 1000);
      let incrementLikeId = () => likeId += 1
      
      let likeObj = {
        id: incrementLikeId(),
        quotedId: input.id,
        createdAt: currentTime
      }
  
      // console.log('typeof likeObj.id:', typeof(likeObj.quotedId));
      console.log('likeObj:', likeObj);
      input.likes.push(likeObj)
      updateBackEnd(likeObj)
      console.log('input.likes:', input.likes)
    })
  
    //------------ HANDLE DELETE BUTTON ---------------//
    btnDan.addEventListener('click', (e) => { 
      e.target.parentNode.remove() 
      const targetId = e.target.parentNode.id     
      quoteArr = quoteArr.filter(quote => {
        quote.id != targetId    
      })   
      updateRemoveList(targetId)  
    }) 
    card.append(blockquote, p, footer, br, btnSuc, btnDan)
    quoteList.appendChild(card)
  }
  
  function updateRemoveList(id) {
    fetch(`http://localhost:3000/quotes/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(data => console.log(data))
  }
  
  function updateBackEnd(obj) {
    fetch(`http://localhost:3000/likes`, {
      method:'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(obj)
    })
    .then(res => res.json())
    .then(data => console.log(data))
  }
  
  function submitForm() {
    // const lastQuoteId = quoteArr[length-1].id
    console.log("quoteArr", quoteArr)
    // debugger
    newQuote.addEventListener('submit', (e) => {
      e.preventDefault()
      const quoteObject = {
        quote: e.target.quote.value,
        author: e.target.author.value, 
        likes:[]
      }
      console.log(quoteObject)
      addNewQuoteToBackEnd(quoteObject)
      // debugger
      quoteList = ''
      console.log('quoteList:', quoteList);
      getAllQuotes()
    })
  }
  
  function addNewQuoteToBackEnd(quoteObj) {
    fetch('http://localhost:3000/quotes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(quoteObj)
    })
    .then(res => res.json())
    .then(data => console.log('Quotes from BE:', data))
  }