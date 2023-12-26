import express from "express";
import cors from 'cors';
import helmet from 'helmet';

import { notFound, errorHandler } from '../middlewares';
import api from './api';

const port = process.env.APP_PORT || 8080;

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.status(200).json({ message: req.query })
});

app.use('/api', api);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});