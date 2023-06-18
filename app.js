require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose"); 
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
app.use(cors({
  origin: process.env.ORIGIN,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));
const { requireAuth } = require('./middleware/authMiddleware');

///////////////////////////////////////////////// Connecting to Mongoose ///////////////////////////////////
const uri = 'mongodb://127.0.0.1:27017/juniorDB' || process.env.DATABASE_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;

db.on('error', (error)=> console.error('MongoDB connection error:', error));
db.once('open', ()=> {
    console.log('MongoDB connected!');
    //////////////////////////// Starting Server /////////////////////////////
    app.listen(3000 || process.env.PORT, ()=> {
        console.log("Server started!");
    });
});

///////////////////////////////////////////////// Routes ////////////////////////////////////////////////
const userRoutes = require('./routes/userRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const regionRoutes = require('./routes/regionRoutes');
const questionRoutes = require('./routes/questionRoutes');

app.use(userRoutes);
app.use(regionRoutes);
app.use(ticketRoutes);
app.use(questionRoutes);

app.get("/token", (req, res) => {
  try{
    const isAuth = requireAuth(req, res);
    res.send(isAuth);
  } catch(err){
    res.send(err.message);
  }
});

// app.get('/', (req,res)=> {
//   res.send('intro page');
// });