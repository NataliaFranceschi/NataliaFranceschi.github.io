const input = document.querySelector('.input')
const button = document.querySelector('.button')

function deleteDrinks() {
    const drink = document.getElementsByClassName('drink')
    const recipe = document.getElementsByClassName('recipe')
    while (drink[0] !== undefined) {
        drink[0].remove();
    }
    while (recipe[0] !== undefined) {
      recipe[0].remove();
  }
}

const fetchDrinks = async (ingredient) => {
    try {
      if (ingredient === undefined) {
        throw new Error('You must provide an url');
      }
      const url = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${ingredient}`;
      const request = await fetch(url);
      const json = await request.json();
      return json;
    } catch (error) {
      return error;
    }
  };

const fetchRecipe = async (drink) => {
      const url = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${drink}`;
      const request = await fetch(url);
      const json = await request.json();
      return json;
  };

  function recipeList(item) {
    const arr1 = Object.entries(item)
    .filter((element) => element[0].includes('strIngredient') === true && element[1] !== null)
    const arrIngredient = arr1.map((element) => element[1])

    const arr2 = Object.entries(item)
    .filter((element) => element[0].includes('strMeasure') === true && element[1] !== null)
    const arrMeasure = arr2.map((element) => element[1])

    const ol = document.createElement('ol')
    const f = arrIngredient.forEach((element, index) =>  {
      ol.appendChild(createCustomElement('li', 'ingredient', `${element} : ${arrMeasure[index]}`))
    })
    return ol
  }
  
  function getDrink(target){
    const text = target.parentElement.querySelector('span.drink__title').innerText;
    return text.replace(' ','+')
  }

  async function recipe({target}) {
    const data = await fetchRecipe(getDrink(target));
    deleteDrinks()
    data.drinks.forEach((item) => {
      const { strDrink, strDrinkThumb, strInstructions } = item;
      const section = document.createElement('section');
      section.className = 'recipe';
      section.appendChild(createCustomElement('span', 'recipe__title', strDrink));
      section.appendChild(createProductImageElement(strDrinkThumb));
      section.appendChild(recipeList(item))
      section.appendChild(createCustomElement('span', 'recipe__instructions', strInstructions));
      document.querySelector('.drinks').appendChild(section);
  })
    
  }

  const createCustomElement = (element, className, innerText) => {
    const e = document.createElement(element);
    e.className = className;
    e.innerText = innerText;
    return e;
  };
  
  const createProductImageElement = (imageSource) => {
    const img = document.createElement('img');
    img.className = 'drink__image';
    img.src = imageSource;
    return img;
  };
   
  async function drinkList() {
    deleteDrinks();
    const data = await fetchDrinks(input.value.replace(' ','+'));
    data.drinks.forEach(({ strDrink, strDrinkThumb }) => {
        const section = document.createElement('section');
        section.className = 'drink';
        section.addEventListener('click', recipe)
        section.appendChild(createCustomElement('span', 'drink__title', strDrink));
        section.appendChild(createProductImageElement(strDrinkThumb));
        document.querySelector('.drinks').appendChild(section);
    });
  }


button.addEventListener('click', drinkList)
