window.onload = function () {
    const meal = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snack'];
    const ul = document.getElementById('ul');
    
    meal.forEach(foods => {
      const li = document.createElement('li');
      const button = document.createElement('button');
      button.textContent = foods;
      button.onclick = function() { loadRecipes(foods); };
      li.appendChild(button);
      ul.appendChild(li);
    });
    const firstButton = document.querySelector("nav button");
    if (firstButton) {
      firstButton.click();
    }
};

function loadRecipes(Recipes) {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      const mainElement = document.querySelector("main");
  
      while (mainElement.childElementCount > 0) {
        mainElement.firstChild.remove()
      }
  
      if (xhr.status === 200) {
        const recipes = JSON.parse(xhr.responseText)
        for (const food of recipes) {
          createRecipeArticle(food);
        }
      } else {
        mainElement.append(`Daten konnten nicht geladen werden, Status ${xhr.status} - ${xhr.statusText}`);
      }
    }
  
    const url = new URL("/recipes", location.href);

    if(Recipes!='All') {
        let params = new URLSearchParams(url.search);
        params.set("recipe", Recipes);
        url.search = params.toString();
    }
    console.log(url.toString());
    
    xhr.open("GET", url)
    xhr.send()
}

function createRecipeArticle(food){
    const main = document.querySelector("main");
    var article = document.createElement('article');
    var div = document.createElement('div');
      
          
    var h1 = document.createElement('h1');
    h1.textContent = food.Name;
    div.appendChild(h1);
      
          
    var p = document.createElement('p');
    p.textContent = "Ingredients: " + food.Ingredients;
    div.appendChild(p);

    var p2 = document.createElement('p');
    p2.textContent = "Time: " + food.Time;
    div.appendChild(p2);
      
    var p3 = document.createElement('p');
    p3.innerHTML = "Instructions: <br>" + addBreaksAfterDottedLetters(food.Instruction);
    div.appendChild(p3);
      
    article.appendChild(div);
      
    var img = document.createElement('img');
    img.src = food.Image;
    article.appendChild(img);
      
    main.appendChild(article);
}

function addBreaksAfterDottedLetters(str) {
    const regex = /([a-zA-Z\(\)])\./g;
    return str.replace(regex, "$1.<br>");
}