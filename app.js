const express = require('express');
const app = express();
const axios = require('axios');
const Superhero = require('./Superhero');
const path = require('path'); //---heroku---

const port = process.env.PORT || 5000;

const accesstoken = '10217870509586417'; //superhero api
const apikey = 'f7467abc'; //movie api

//--- heroku ---
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

//query to get hero when submitted
app.get('/gethero', (req, res) =>{
  const name = req.query.name;
  const querystr = `https://superheroapi.com/api/${accesstoken}/search/${name}`;
  const querystrmovie = `http://www.omdbapi.com/?t=${name}&apikey=${apikey}`;
  axios.all([
    Superres=axios.get(querystr),
    Movieres=axios.get(querystrmovie)
  ])
  .then(axios.spread((Superres,Movieres)=>{
    const hero = new Superhero({
      id: Superres.data.results[0].id,
      name: Superres.data.results[0].name,
      fullname: Superres.data.results[0].biography['full-name'],
      intelligence: Superres.data.results[0].powerstats.intelligence,
      strength: Superres.data.results[0].powerstats.strength,
      speed: Superres.data.results[0].powerstats.speed,
      durability: Superres.data.results[0].powerstats.durability,
      power: Superres.data.results[0].powerstats.power,
      combat: Superres.data.results[0].powerstats.combat,
      publisher: Superres.data.results[0].biography.publisher,
      poster: Superres.data.results[0].image.url,
      title: Movieres.data.Title,
      year: Movieres.data.Year,
      genre: Movieres.data.Genre,
      actors: Movieres.data.Actors,
      plot: Movieres.data.Plot,
      movieposter: Movieres.data.Poster

    });
    if(!hero.name || !hero.title){
      res.status(200).json('Not found');
      return;
    }
    hero.save()
    .then(response=>{
      res.status(200).json(response);

    })
    .catch(error =>{
      res.status(400).json(error);
    });    
  }))
  .catch(error => {
    res.status(400).json(error);
  }); 
})

//query to get all superheros saved
app.get('/getallheroes', (req, res) => {
  Superhero.find({})
    .sort([['_id', -1]])
    .then(response => {
      res.status(200).json(response);
    })
    .catch(error => {
      res.status(400).json(error);
    });
});

//query to delete hero through id
app.get('/deletehero', (req, res) => {
  Superhero.findByIdAndDelete({ _id: req.query._id })
    .then(response => {
      res.status(200).json(response);
    })
    .catch(error => {
      res.status(400).json(error);
    });
});

//query to edithero through id
app.get('/edithero', (req,res) =>{
  const myquery=req.query._id;
  const newvalues={ $set: { name: req.query.name,fullname: req.query.fullname, publisher: req.query.publisher}};
  
  Superhero.findByIdAndUpdate(myquery, newvalues)
   .then(response =>{
     res.status(200).json(response);
     
   })
   .catch(error=>{
     res.status(400).json(error);
   });
  
});

app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});