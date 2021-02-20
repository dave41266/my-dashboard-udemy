if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}


const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
//const partials = require('express-partials');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError.js');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const cors = require('cors');
const bodParser = require('body-parser');
const authRoutes = require('./routes/auth-routes');
const homeRoutes = require('./routes/home-routes');

mongoose.connect('mongodb://localhost:27017/dashboard', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

//app.use(cors());
//app.use(bodParser.json());

app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');

    console.log('req.flash with success arg', req.flash('success'));
    next();
})

// just a test, it's working now.  I had to delete my database and then it
// started working, can delete it later
app.get('/fakeUser', async (req, res) => {
    const user = new User({email: 'dave@gmail.com', username: 'dave'});
    const newUser = await User.register(user, 'chicken');
    res.send(newUser);
})


app.use(homeRoutes.routes);
app.use(authRoutes.routes);

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})


module.exports = ExpressError;

app.listen(7000, () => console.log('App is listening on url http://localhost:7000'));
