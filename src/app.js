/* eslint-disable no-console */
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { notFound, errorHandler } from './errorMiddlewares';
import routes from './routes';

require('dotenv').config();

const cloudinary = require('cloudinary').v2;

if (typeof (process.env.CLOUDINARY_URL) === 'undefined') {
  console.warn('!! cloudinary config is undefined !!');
} else {
  console.log('cloudinary config', cloudinary.config() ? 'OK' : 'FAIL');
}

const app = express();
app.use(morgan('dev'));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.json({
    message: '🌈✨'
  });
});

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
