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
    let drinkImg = document.createElement('img')
    let instr = document.createElement('h3')
    let instruction = document.createElement('p')
    let ingredients = document.createElement('h3')
    drinkName.textContent = drink.strDrink
    drinkImg.src = drink.strDrinkThumb
    instruction.innerText = drink.strInstructions
    instr.appendChild(instruction);
    const ingreList = document.createElement('ul')
    let ingre = Object.values(drink).slice(17, 32).filter(x => x !== null)
    ingre.forEach(x => {
      let li = document.createElement('li');
      li.textContent = x;
      ingreList.appendChild(li);
      ingredients.appendChild(ingreList)
    })
    let favoriteButton = document.createElement('button')
    favoriteButton.textContent = '♥'
    favoriteButton.style.color = 'red'
    document.querySelector('.drink-container').append(drinkName, drinkImg, favoriteButton, ingredients, instruction)
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
    let drinkName = document.createElement('h4')
    let drinkImg = document.createElement('img')
    drinkName.textContent = drink.name
    drinkImg.src = drink.img
    drinkDiv.append(drinkName, drinkImg)
    favorites.appendChild(drinkDiv)
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