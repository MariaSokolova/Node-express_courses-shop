const express = require('express');
const path = require('path');
const csrf = require('csurf');
const flash = require('connect-flash');
const helmet = require('helmet');
const compression = require('compression');
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
const errorHandler = require('./middleware/error');
const keys = require('./keys');

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
  uri: keys.MONGODB_URI
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: keys.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store
}));
app.use(csrf());
app.use(flash());
app.use(compression());
app.use(helmet());
app.use(varMiddleware);
app.use(userMiddleware);

app.use('/', homeRouter);
app.use('/add', addRouter);
app.use('/courses', coursesRouter);
app.use('/card', cardRouter);
app.use('/orders', ordersRouter);
app.use('/auth', authRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 4000;

async function start() {
  try {
    await mongoos.connect(keys.MONGODB_URI, {
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



