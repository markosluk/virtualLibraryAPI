require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const PORT = process.env.PORT || 3500;
const db = require("./models/index.js");

// Credentials check
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json 
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

//serve static files
app.use('/', express.static(path.join(__dirname, '/public')));

// routes
app.use('/', require('./routes/root'));
app.use('/register-user', require('./routes/registerUser'));
app.use('/register-admin', require('./routes/registerAdmin'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));

app.use(verifyJWT); //verify token
app.use('/books', require('./routes/books'));

(async () => {
   // synchronize db models
   await db.sequelize.sync(
//      { force: true } // tests only - {force: true} will drop the table if it already exists
      );
      // db connection check
      try {
         await db.sequelize.authenticate();
         console.log('Database connection has been established successfully.');
       } catch (error) {
         console.error('Unable to connect to the database:', error);
       }
   // start server
   app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
 })();

