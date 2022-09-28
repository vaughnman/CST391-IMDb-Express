import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { StubReviewDatabase } from './databases/StubReviewDatabase';
import { StubAlbumDatabase } from './databases/StubAlbumDatabase';
import { ReviewRouter } from './routers/ReviewRouter';
import { AlbumRouter } from './routers/AlbumRouter';
import { RatingRouter } from './routers/RatingRouter';
import { RatingCalculator } from './RatingCalculator';
import bodyParser from 'body-parser';
import { AlbumDatabase } from './databases/AlbumDatabase';
import { ReviewDatabase } from './databases/ReviewDatabase';
import { IReviewDatabase } from './databases/IReviewDatabase';
import { IAlbumDatabase } from './databases/IAlbumDatabase';

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

let reviewDatabase: IReviewDatabase | undefined;
let albumDatabase: IAlbumDatabase | undefined;

if(process.env.DATABASE_CONNECTION_STRING) {
  console.log("Using Live Database");

  reviewDatabase = new ReviewDatabase();
  albumDatabase = new AlbumDatabase();
} else {
  console.log("Using Stub Database");

  reviewDatabase = new StubReviewDatabase();
  albumDatabase = new StubAlbumDatabase();
}

const ratingCalculator = new RatingCalculator(reviewDatabase);

const albumRouter = new AlbumRouter(albumDatabase, reviewDatabase);
const reviewRouter = new ReviewRouter(reviewDatabase);
const ratingRouter = new RatingRouter(ratingCalculator);

app.use(bodyParser.json())

app.get('/rating/get', ratingRouter.get);

app.post('/review/add', reviewRouter.add);
app.get('/review/get', reviewRouter.get);
app.delete('/review/delete', reviewRouter.delete);

app.get('/album/get', albumRouter.get);
app.get('/album/getAll', albumRouter.getAll);
app.post('/album/save', albumRouter.save);
app.delete('/album/delete', albumRouter.delete);

app.get('/', (req: any, res: any) => {
  res.send('Express + TypeScript Server!');
});

app.listen(port, () => {
  console.log(`[server]: Server is running at https://localhost:${port}`);
});