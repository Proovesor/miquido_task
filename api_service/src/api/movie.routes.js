import express from "express";

import MovieApi from "./movie.controller";

const router = express.Router();

router.route("/search").post(MovieApi.searchForMovie);
router.route("/rate").put(MovieApi.rateMovie);
router.route("/favorite").post(MovieApi.checkMovieFavorite);

export default router;
