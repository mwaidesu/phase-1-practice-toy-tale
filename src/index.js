let addToy = false;
const toyCardContainer = document.getElementById('toy-collection')

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});



function fetchToyData() {
  fetch('http://localhost:3000/toys')
  .then((resp) => resp.json())
  .then(rawtoyData => rawtoyData.forEach(eachToy => renderToys(eachToy)))
}

function renderToys(eachToy){
  console.log(eachToy)
  const tcard = document.createElement('div')
  tcard.className = "card"
  tcard.id = eachToy.id
  //   Associated ID transfer works: console.log(tcard.id)

  const toyCardName = document.createElement('h3')
  const toyCardImg = document.createElement('img')
  const toyCardLikes = document.createElement('p')
  const toyCardLikesNum = document.createElement('h5')
  const cardLikesButton = document.createElement('button')
  const cardDeleteButton = document.createElement('button')

  toyCardName.textContent = eachToy.name
  toyCardImg.src = eachToy.image
  toyCardImg.className = "toy-avatar"
  toyCardLikes.textContent = "Likes: "
  toyCardLikesNum.textContent = eachToy.likes
  cardLikesButton.textContent = "Likes"
  cardDeleteButton.textContent = "Delete"

  cardLikesButton.addEventListener('click', () => {
    increaseCardLikes(eachToy, toyCardLikesNum)
  })

  cardDeleteButton.addEventListener('click', () => {
    deleteFromDatabase(eachToy, tcard)
  })

  tcard.appendChild(toyCardName)
  tcard.appendChild(toyCardImg)
  toyCardLikes.append(toyCardLikesNum)
  tcard.appendChild(toyCardLikes)
  tcard.appendChild(cardLikesButton)
  tcard.appendChild(cardDeleteButton)


  toyCardContainer.appendChild(tcard)

}


function increaseCardLikes(eachToy, likesValue) {
  ++eachToy.likes
  likesValue.textContent = eachToy.likes
  
  fetch(`http://localhost:3000/toys/${eachToy.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({likes: eachToy.likes})
  })
}


function deleteFromDatabase(eachToy, tcard){
  fetch(`http://localhost:3000/toys/${eachToy.id}`, {
    method: 'DELETE'
  })
  .then(resp => resp.json())
  .then(tcard.remove())
  

}


function addToyFormFunctionality(){
  const toyFormFull = document.querySelector("body > div.container > form")
  const enterToyNameField = document.querySelector("body > div.container > form > input:nth-child(2)")
  const enterToyImage = document.querySelector("body > div.container > form > input:nth-child(4)")

  toyFormFull.addEventListener('submit', (e) => {
    e.preventDefault()
    let nameInput = enterToyNameField.value
    let imageInput = enterToyImage.value

    const newToyObj = {
      image: imageInput,
      likes: 0,
      name: nameInput,

    }

    fetch('http://localhost:3000/toys', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newToyObj)
    })
    .then(resp => resp.json())
    .then(newCardData => renderToys(newCardData))
    

    //renderToys()
  })

}


//toyCardImg, toyCardLikes, toyCardLikesNum)

document.addEventListener("DOMContentLoaded", () => {
  fetchToyData();
  addToyFormFunctionality();
})
