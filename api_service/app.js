import express from "express";
import bodyParser from "body-parser";
import { MongoClient } from "mongodb";

import UserDAO from "./src/db/UserDAO";
import MovieDAO from "./src/db/MovieDAO";

import userRoutes from "./src/api/user.routes";
import movieRoutes from "./src/api/movie.routes";
import authMiddleware from "./src/middleware/isAuth";

const app = express();
const DB_URI = `mongodb+srv://miquido_task_user:task_password@cluster0-jrq9y.mongodb.net/miquido_task?retryWrites=true&w=majority`;

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(authMiddleware);
app.use(userRoutes);
app.use(movieRoutes);

app.use("/", (req, res, next) => {
  res.status(404).json({ notFound: "Page not found." });
});

MongoClient.connect(DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async (client) => {
  await UserDAO.injectDb(client);
  await MovieDAO.injectDb(client);
  app.listen(8080, (err) => {
    console.log("app is up and running");
  });
});
