import fetch from "node-fetch";
import MovieDAO from "../db/MovieDAO";

const API_KEY = "5aa9361f";

export default class MovieApi {
  static async searchForMovie(req, res, next) {
    const { title } = req.body;
    const url = `http://www.omdbapi.com/?apikey=${API_KEY}&t=${title}`;

    try {
      const searchResult = await (await fetch(url)).json();
      let userPreferencesData;

      if (!searchResult.Title) {
        res.status(400).json({ badRequest: "Could not find movie." });
        return;
      }
      const searchedMovie = await MovieDAO.saveMovieToDb(searchResult);
      const averageRatingScore = await MovieDAO.averageRating(
        searchResult.Title
      );

      if (req.isAuth) {
        userPreferencesData = await MovieDAO.userPreferences(
          req.userEmail,
          searchResult.Title
        );
      }

      res.status(200).json({
        searchedMovie,
        averageRating: averageRatingScore,
        userData: userPreferencesData,
      });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  static async rateMovie(req, res, next) {
    if (!req.isAuth) {
      res
        .status(401)
        .json({ unauthorized: "Insufficient permissions for such action." });
      return;
    }

    const email = req.userEmail;
    const { movie_id, rating } = req.body;

    if (typeof rating !== "number") {
      res.status(400).json({ badRequest: "Provide a number." });
      return;
    }

    if (rating < 1 || rating > 10) {
      res
        .status(400)
        .json({ badRequest: "Rating must be integer on scale from 1 to 10." });
      return;
    }

    try {
      await MovieDAO.updateMovieRating(email, movie_id, rating);
      res.status(200).json({ rated: "Succesfully rated movie." });
    } catch (error) {
      res.status(500).json({ error: "Could not find movie." });
    }
  }

  static async checkMovieFavorite(req, res, next) {
    if (!req.isAuth) {
      res
        .status(401)
        .json({ unauthorized: "Insufficient permissions for such action." });
      return;
    }
    const email = req.userEmail;
    const { movie_id } = req.body;
    try {
      const determineFavorite = await MovieDAO.handleFavoriteCheck(
        email,
        movie_id
      );
      res.status(200).json({ isFavorite: determineFavorite });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
}
