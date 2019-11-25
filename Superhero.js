const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const db = 'mongodb+srv://WebApi:Mongo123@webapi-rn7d6.mongodb.net/Movies?retryWrites=true&w=majority';

mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log('Connected to database');
  })
  .catch(error => {
    console.log('Mongoose connetion error: ', error);
  });

const schema = mongoose.Schema({
  id: { type: String },
  name: { type: String },
  fullname: { type: String },
  intelligence: { type: String },
  strength: { type: String },
  speed: {type: String },
  durability: { type: String },
  power: { type: String },
  combat: { type: String },
  publisher: { type: String },
  poster: { type: String },
  title: { type: String },
  year: { type: String },
  genre: { type: String },
  actors: { type: String },
  plot: { type: String },
  movieposter: { type: String }

});

const Superhero = mongoose.model('Movies', schema, 'heroCollection');

module.exports = Superhero;