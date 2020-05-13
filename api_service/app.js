import {} from "dotenv/config";

import express from "express";
import bodyParser from "body-parser";
import { MongoClient } from "mongodb";

import UserDAO from "./src/db/UserDAO";
import MovieDAO from "./src/db/MovieDAO";

import userRoutes from "./src/api/user.routes";
import movieRoutes from "./src/api/movie.routes";
import authMiddleware from "./src/middleware/isAuth";
import { User } from "./src/api/user.controller";

const app = express();
const DB_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0-jrq9y.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "OPTIONS, GET, POST, PUT, PATCH, DELETE"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
    );
    next();
});

app.use(authMiddleware);
app.use(userRoutes);
app.use(movieRoutes);

app.use("/", (req, res, next) => {
    res.status(404).json({ notFound: "Page not found." });
});

(async () => {
    try {
        const dbClient = await MongoClient.connect(DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        await UserDAO.injectDb(dbClient);
        await MovieDAO.injectDb(dbClient);
        app.listen(PORT, (err) => console.log(`listening on port ${PORT}`));
    } catch (err) {
        console.error(err);
    }
})();
