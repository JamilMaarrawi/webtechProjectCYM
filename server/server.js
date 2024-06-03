const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const exerciseModel = require('./exercises.js');
const session = require('express-session');

const app = express();

// Parse urlencoded bodies
app.use(bodyParser.json());

// Serve static content in directory 'files'
app.use(express.static(path.join(__dirname, 'files')));

app.get('/calories', async function (req,res) {
    const ate = req.query.ate;

    const url = `https://api.calorieninjas.com/v1/nutrition?query=${encodeURIComponent(ate)}`;
    console.log(url);
    const options = {
        method: 'GET',
        headers: {
            'X-Api-Key': '/w3QFHzOGHyWmlT0YSU94g==Lf4KOlYoBwkFvqyY'
        }
    };
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error('Failed to fetch nutrition data');
        }
        const result = await response.json();
        res.send(result);
    } catch (error) {
        console.error(error);
        alert(error.message);
    }
})

app.get('/exercises', function (req, res) {
    let exercises = Object.values(exerciseModel)
    const filters = ['Chest','Back','Biceps','Triceps','Shoulders','Legs']
  
    const muscle = req.query.muscle;
    if (muscle) {
        if (muscle == 'Others') {
            exercises = exercises.filter(exercise => filters.every(filter => exercise.Muscle != filter))
        } else {
            exercises = exercises.filter(exercise => exercise.Muscle == muscle);
        }
    }
  
    res.send(exercises);
  })

app.listen(3000, () => {
    console.log("Server now listening on http://localhost:3000/")
});