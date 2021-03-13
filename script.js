document.querySelector('form').addEventListener('submit', handleSubmit)

function handleSubmit(e) {
  e.preventDefault()
  buildDrinkInstructions(e.target.search.value)
  e.target.search.value = ''
}

fetch('http://localhost:3000/drinks')
  .then(res => res.json())
  .then(data => data.forEach(drink => appendFavoriteDrink(drink)))
  .catch(error => console.log(error))

function buildDrinkInstructions(name) {
  fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${name}`)
    .then(res => res.json())
    .then(drinks => buildDrinkList(drinks))
    .catch(error => alert('Drink Not Found'))
}

function buildDrinkList(drinks) {
  let drinkList = document.querySelector('ul');
  drinkList.innerHTML = '';
  drinkList.style.cursor = 'pointer';
  drinks.drinks.forEach(drink => {
    let newListItem = document.createElement('li')
    newListItem.innerText = drink.strDrink
    newListItem.id = drink.idDrink
    drinkList.appendChild(newListItem)
    newListItem.addEventListener('click', () => {
      document.querySelector('.drink-container').innerHTML = ''
      buildDrink(drink)
    })
  })
}

function buildDrink(drink) {
  let drinkName = document.createElement('h2')
  drinkName.textContent = drink.strDrink

  let drinkImg = document.createElement('img')
  drinkImg.src = drink.strDrinkThumb
  drinkImg.width = 500;
  drinkImg.heigth = 700;

  let instrDiv = document.createElement('div')
  let instr = document.createElement('h3')
  instr.textContent = 'Instruction:'
  let instruction = document.createElement('p')
  instruction.innerText = drink.strInstructions
  instrDiv.append(instr, instruction);


  let ingredientDiv = document.createElement('div')
  let ingredients = document.createElement('h3')
  ingredients.textContent = 'Ingredients:'

  const ingreList = document.createElement('ul')
  let ingre = Object.values(drink).slice(17, 32).filter(x => x !== null)
  ingre.forEach(x => {
    let li = document.createElement('li');
    li.textContent = x;
    ingreList.appendChild(li);
    ingredientDiv.append(ingredients, ingreList)
  })
  let buttonDiv = document.createElement('div')
  let favoriteButton = document.createElement('button')
  favoriteButton.textContent = 'Add To favorite'
  favoriteButton.style.color = 'red'
  buttonDiv.appendChild(favoriteButton)
  document.querySelector('.drink-container').append(drinkName, drinkImg, buttonDiv, ingredientDiv, instrDiv)
  favoriteButton.addEventListener('click', () => handleFavorite(ingre, drink))
}

function handleFavorite(ingre, drink) {
  let favoriteDrink = {
    name: drink.strDrink,
    img: drink.strDrinkThumb,
    ingredients: ingre,
    instructions: drink.strInstructions
  }
  postFavoriteDrink(favoriteDrink);
}

function postFavoriteDrink(favoriteDrink) {
  fetch('http://localhost:3000/drinks', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(favoriteDrink)
    })
    .then(res => res.json())
    .then(drinks => appendFavoriteDrink(drinks))
}

function appendFavoriteDrink(drink) {
  const favorites = document.querySelector('.favorite-drink-container')
  let drinkDiv = document.createElement('div')
  drinkDiv.id = drink.id
  let drinkName = document.createElement('h4')
  let drinkImg = document.createElement('img')
  let buttonDiv = document.createElement('div')
  let removeButton = document.createElement('button')
  buttonDiv.appendChild(removeButton)
  removeButton.innerText = 'Remove Drink'
  removeButton.addEventListener('click', (e) => removeFromFavorites(e))
  drinkName.textContent = drink.name
  drinkImg.src = drink.img
  drinkImg.width = 200
  drinkImg.height = 200
  drinkDiv.append(drinkName, drinkImg, buttonDiv)
  drinkDiv.style.textAlign = 'center'
  favorites.appendChild(drinkDiv)
}

function removeFromFavorites(e) {
  let drinkID = e.target.parentElement.parentElement.id
  fetch(`http://localhost:3000/drinks/${drinkID}`, {
      method: 'DELETE'
    })
    .then(res => res.json())
    .then(data => document.getElementById(drinkID).remove())
    .catch(error => console.log(error))
}

const addBtn = document.querySelector("#choose-drink");
const buttons = document.querySelector("#main");
let addDrink = false;
addBtn.addEventListener("click", () => {
  addDrink = !addDrink;
  if (addDrink) {
    buttons.style.display = "block";
  } else {
    buttons.style.display = "none";
  }
})