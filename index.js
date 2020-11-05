const express = require('express');
const path = require('path');
const csrf = require('csurf');
const flash = require('connect-flash');
const mongoos = require('mongoose');
const exphbs = require('express-handlebars');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);

const homeRouter = require('./routes/home');
const cardRouter = require('./routes/card');
const addRouter = require('./routes/add');
const coursesRouter = require('./routes/courses');
const ordersRouter = require('./routes/orders');
const authRouter = require('./routes/auth');
const varMiddleware = require('./middleware/variables');
const userMiddleware = require('./middleware/user');

const MONGODB_URI = `mongodb+srv://Mariia:P5L0Vuv8BkslxCaF@cluster0.eyx9s.mongodb.net/shop`;

const app = express();
const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true
  }
});

const store = new MongoStore({
  collection: 'sessions',
  uri: MONGODB_URI
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'some secret value',
  resave: false,
  saveUninitialized: false,
  store
}));
app.use(csrf());
app.use(flash());
app.use(varMiddleware);
app.use(userMiddleware);

app.use('/', homeRouter);
app.use('/add', addRouter);
app.use('/courses', coursesRouter);
app.use('/card', cardRouter);
app.use('/orders', ordersRouter);
app.use('/auth', authRouter);


const PORT = process.env.PORT || 4000;

async function start() {
  try {
    await mongoos.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    });
  } catch (e) {
    console.log(e)
  }
}

start();



