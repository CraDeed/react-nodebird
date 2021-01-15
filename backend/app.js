const express = require('express');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const postRouter = require('./routes/post');
const postsRouter = require('./routes/posts');
const userRouter = require('./routes/user');
const hashtagRouter = require('./routes/hashtag');
const db = require('./models');
const passportConfig = require('./passport');
const passport = require('passport');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');

dotenv.config();
const app = express();

db.sequelize
  .sync()
  .then(() => {
    console.log('db 연결 성공');
  })
  .catch(console.error);

passportConfig();

app.use(morgan('dev'));

app.use(
  cors({
    // origin: 'https://nodebird.com'
    origin: true,
    credentials: true,
  }),
);

// '/' = http://localhost:3065/
app.use('/', express.static(path.join(__dirname, 'uploads')));
app.use(express.json()); // axios 요청
app.use(express.urlencoded({ extended: true })); // 일반 폼 요청
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session());
app.use(passport.initialize());
app.use(
  passport.session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET,
  }),
);

app.use('/post', postRouter);
app.use('/posts', postsRouter);
app.use('/user', userRouter);
app.use('/hashtag', hashtagRouter);

app.listen(3065, () => {
  console.log('서버 실행 중!');
});
