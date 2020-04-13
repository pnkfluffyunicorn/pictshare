const express = require('express');
const connectDB = require('./config/db');
const app = express();
const bodyParser = require('body-parser')

connectDB();

//Initialize Middleware
app.use(express.json({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }))

//Heroku Scripts
// app.use(express.static(path.join(__dirname, './client/src')));
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname + './client/src/index.html'))
// })

app.get('/', (req, res) => res.send('API Running'));

//Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
// STUPID HARDCODED FIX TO ROUTED AUTHENTICATION ERROR
// NEED TO FIND ROOT CAUSE AND FIX. ONLY HAPPENS FROM
// PAGES WITH CUSTOM :ID URL IN THE TITLE
app.use('/profile/api/auth', require('./routes/api/auth'));
app.use('/profile/api/users', require('./routes/api/users'));
app.use('/favorites/api/auth', require('./routes/api/auth'));

app.use('/api/posts', require('./routes/api/posts'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));