document.querySelector('form').addEventListener('submit', handleSubmit)

function handleSubmit(e) {
  e.preventDefault()
  buildDrinkInstructions(e.target.search.value)
  e.target.search.value = ''
}

function buildDrinkInstructions(name) {
  fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${name}`)
    .then(res => res.json())
    .then(drinks => buildDrinkList(drinks))
    .catch(error => alert('Drink Not Found'))
}

function buildDrinkList(drinks) {
  let drinkList = document.querySelector('ul')
  drinkList.innerHTML = ''
  drinkList.style.cursor = 'pointer'
  drinks.drinks.forEach(drink => {
    let newListItem = document.createElement('li')
    newListItem.innerText = drink.strDrink
    newListItem.id = drink.idDrink
    newListItem.addEventListener('click', (e) => handleClick(e, drink))
    drinkList.appendChild(newListItem)
  })
  
}

function handleClick(e, drink) {
  let drinkName = document.querySelector('.drink-name')
  let drinkImg = document.querySelector('.drink-image')
  let instructions = document.querySelector('.instructions')
  drinkName.textContent = drink.strDrink
  drinkImg.src = drink.strDrinkThumb
  instructions.innerText = drink.strInstructions
  const ingreList = document.querySelector('#ingredient-list')
  ingreList.innerHTML = '';
  let ingre = Object.values(drink).slice(17, 32).filter(x=> x!== null)
  ingre.forEach(x=> {
    let li = document.createElement('li');
    li.textContent = x;
    ingreList.appendChild(li);
  })


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
});