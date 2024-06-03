document.addEventListener("DOMContentLoaded", function() {
    
    const calculateButton = document.getElementById('btn3');

    calculateButton.addEventListener('click', function() {
        const result = document.getElementById('result');
        const height = document.getElementById('height').value;
        const weight = document.getElementById('weight').value;
        const set = document.querySelector('input[name="set"]:checked').value;
        result.value = calculateBodyMassIndex(height, weight, set).toFixed(2);
    });

    const checkButton = document.getElementById('btn1');

    checkButton.addEventListener('click', function() {
        const div = document.getElementById('food-item');
        if(div)div.parentNode.removeChild(div);
        const ate = document.getElementById('ate').value;
        check(ate);
    });

    const addButton = document.getElementById('btn2');

    addButton.addEventListener('click', () => { addToList() });

});

function calculateBodyMassIndex(height,weight, set) {
    if(set == "metric") return weight / (height/100 * height/100);
    else return 703*weight / (height * height);
}

function check(ate) {
    const url = new URL("/calories", location.href);
    let params = new URLSearchParams(url.search);
    params.set("ate", ate);
    url.search = params.toString();

    fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error('Error');
        }
        console.log(response);
        return response.json();
    })
    .then(ate => {
        handleApiResponse(ate);
    })
    .catch(error => {
        alert(error.message);
    });
}

function addTextToArticle(item) {
    const articleElement = document.getElementById('calorie');

    const container = document.createElement('div');
    container.id = 'food-item';

    const name = document.createElement('h2');
    name.id = 'name';
    name.textContent = item.name;
    container.appendChild(name);

    const details = document.createElement('p');
    details.id = 'nutritions';
    details.innerHTML = `
        <strong>Serving Size:</strong> ${item.serving_size_g} g<br>
        <strong>Calories:</strong> ${item.calories}<br>
        <strong>Sugar:</strong> ${item.sugar_g} g<br>
        <strong>Fiber:</strong> ${item.fiber_g} g<br>
        <strong>Sodium:</strong> ${item.sodium_mg} mg<br>
        <strong>Potassium:</strong> ${item.potassium_mg} mg<br>
        <strong>Saturated Fat:</strong> ${item.fat_saturated_g} g<br>
        <strong>Total Fat:</strong> ${item.fat_total_g} g<br>
        <strong>Cholesterol:</strong> ${item.cholesterol_mg} mg<br>
        <strong>Protein:</strong> ${item.protein_g} g<br>
        <strong>Total Carbohydrates:</strong> ${item.carbohydrates_total_g} g
    `;
    container.appendChild(details);

    articleElement.appendChild(container);
}

function handleApiResponse(response) {
    if (response.items) addTextToArticle(response.items[0]);
}

function addToList() {
    const name = document.createElement('p');
    name.textContent = document.getElementById('name').textContent;
    const nutritionText = document.getElementById('nutritions').textContent;
    const list = document.getElementById('list1');
    
    const caloriesRegex = /Calories:\s*([\d.]+)/;
    const caloriesMatch = nutritionText.match(caloriesRegex);
    const calories = document.createElement('p');
    calories.textContent = parseFloat(caloriesMatch[1])+" kcal";
    
    const item = document.createElement('li');
    item.appendChild(name);
    item.appendChild(calories);
    list.insertBefore(item,document.getElementById('total'));

    const total = document.getElementById('amount');
    total.textContent = (parseFloat(total.textContent))+(parseFloat(calories.textContent))+" kcal";
}
