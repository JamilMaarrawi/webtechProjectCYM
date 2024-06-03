window.onload = function () {
  const muscles = ['All', 'Chest', 'Back', 'Biceps', 'Triceps', 'Shoulders', 'Legs', 'Others'];
  const ul = document.getElementById('ul');
  
  muscles.forEach(muscle => {
    const li = document.createElement('li');
    const button = document.createElement('button');
    button.textContent = muscle;
    button.onclick = function() { loadExercises(muscle); };
    li.appendChild(button);
    ul.appendChild(li);
  });
  const firstButton = document.querySelector("nav button");
  if (firstButton) {
    firstButton.click();
  }
};

function loadExercises(Muscle) {
  const xhr = new XMLHttpRequest();
  xhr.onload = function () {
    const mainElement = document.querySelector("main");

    while (mainElement.childElementCount > 0) {
      mainElement.firstChild.remove()
    }

    if (xhr.status === 200) {
      const exercises = JSON.parse(xhr.responseText)
      for (const exercise of exercises) {
        createExerciseArticle(exercise);
      }
    } else {
      mainElement.append(`Daten konnten nicht geladen werden, Status ${xhr.status} - ${xhr.statusText}`);
    }
  }

  const url = new URL("/exercises", location.href);

  if(Muscle!='All') {
    let params = new URLSearchParams(url.search);
    params.set("muscle", Muscle);
    url.search = params.toString();
  }
  console.log(url.toString());

  xhr.open("GET", url)
  xhr.send()
}

function createExerciseArticle(exercise){
  const main = document.querySelector("main");
  var article = document.createElement('article');
  var div = document.createElement('div');

    
  var h1 = document.createElement('h1');
  h1.textContent = exercise.Name;
  div.appendChild(h1);

    
  var p = document.createElement('p');
  p.textContent = "Muscle: " + exercise.Muscle
  div.appendChild(p);

    
  var p2 = document.createElement('p');
  p2.textContent = "Target: " + exercise.Target
  div.appendChild(p2);

    
  var p3 = document.createElement('p');
  p3.innerHTML = "Instructions: <br>" + addBreaksAfterDottedLetters(exercise.Instruction);
  div.appendChild(p3);

  article.appendChild(div);

  var img = document.createElement('img');
  img.src = exercise.Image;
  article.appendChild(img);

  main.appendChild(article);
}

function addBreaksAfterDottedLetters(str) {
  const regex = /([a-zA-Z\(\)])\./g;
  return str.replace(regex, "$1.<br>");
}
  