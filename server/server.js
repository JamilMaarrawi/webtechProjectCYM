const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const exerciseModel = require('./exercises.js');
const session = require('express-session');
const mongoose = require('mongoose');
const mongoStore = require('connect-mongo');

const app = express();

// Parse urlencoded bodies
app.use(bodyParser.json());

// Serve static content in directory 'files'
app.use(express.static(path.join(__dirname, 'files')));

mongoose.connect('mongodb+srv://jamil:Jamilmsymsy7@cluster.yyqktx3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster');

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    store: mongoStore.create({
        mongoUrl: 'mongodb+srv://jamil:Jamilmsymsy7@cluster.yyqktx3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster',
        collectionName: 'sessions',
    }),
    cookie: { secure: true, httpOnly: true }
}));

const User = mongoose.model('User', {
    username: String,
    password: String,
    data: []
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const newUser = new User({ username, password });
    try {
      await newUser.save();
      res.send('User created successfully');
    } catch (err) {
      console.error(err);
      res.status(500).send('Registration failed');
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
      const user = await User.findOne({ username });
      if (!user || user.password !== password) {
        return res.status(401).send('Invalid username or password');
      }
      req.session.user = user._id;
      res.send('Login successful');
    } catch (err) {
      console.error(err);
      res.status(500).send('Login failed');
    }
});

app.get('/data', async (req, res) => {
    const userId = req.session.user;
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).send('User not found');
      }
      res.send(user.data);
    } catch (err) {
      console.error(err);
      res.status(500).send('Failed to retrieve data');
    }
  });

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