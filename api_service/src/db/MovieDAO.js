import { ObjectId } from "mongodb";

let movies;

export default class MovieDAO {
    static async injectDb(client) {
        if (movies) return;
        try {
            movies = await client.db("miquido_task").collection("movies");
        } catch (error) {
            console.error(error);
        }
    }

    static async lookForMovieById(movie_id) {
        const movieId = ObjectId(movie_id);
        try {
            return await movies.findOne({ _id: movieId });
        } catch (error) {
            console.error(error);
        }
    }

    static async saveMovieToDb(movieData) {
        const { Title, Year, Genre, imdbID } = movieData;

        try {
            const movieFromDb = await movies.findOne({ title: Title });
            if (movieFromDb) return movieFromDb;
            await movies.updateOne(
                { title: Title },
                {
                    $set: {
                        title: Title,
                        year: Year,
                        genre: Genre,
                        imdbID: imdbID,
                        ratings: [],
                        fans: [],
                    },
                },
                { upsert: true }
            );
            const insertedMovie = await movies.findOne({ title: Title });
            return insertedMovie;
        } catch (error) {
            console.error(error);
        }
    }

    static async updateMovieRating(email, movie_id, rating) {
        const movieId = ObjectId(movie_id);
        try {
            await movies.updateOne(
                { _id: movieId },
                { $pull: { ratings: { email: email } } }
            );
            const { modifiedCount } = await movies.updateOne(
                { _id: movieId },
                { $addToSet: { ratings: { email: email, rating: rating } } }
            );
            return modifiedCount;
        } catch (error) {
            console.error(error);
        }
    }

    static async handleFavoriteCheck(email, movie_id) {
        const movieId = ObjectId(movie_id);

        try {
            const isFavorite = await movies.findOne({
                _id: movieId,
                fans: { $all: [email] },
            });
            if (isFavorite) {
                await movies.updateOne(
                    { _id: movieId },
                    { $pull: { fans: email } }
                );
                return false;
            }
            await movies.updateOne(
                { _id: movieId },
                { $push: { fans: email } }
            );
            return true;
        } catch (error) {
            console.error(error);
        }
    }

    static async averageRating(title) {
        const matchStage = { $match: { title: title } };
        const projectionStage = { $project: { _id: 0, ratings: 1 } };
        const averageCountStage = {
            $addFields: { averageRating: { $avg: "$ratings.rating" } },
        };
        try {
            const aggregationResult = await (
                await movies.aggregate([
                    matchStage,
                    projectionStage,
                    averageCountStage,
                ])
            ).next();
            return Math.round(aggregationResult.averageRating * 100) / 100;
        } catch (error) {
            console.error(error);
        }
    }

    static async userPreferences(email, title) {
        try {
            const isFavorite = await movies.findOne({
                title: title,
                fans: { $all: [email] },
            });
            const { ratings } = await movies.findOne({ title: title });
            const userRating = ratings.filter(
                (rating) => rating.email === email
            );

            return {
                isFavorite: Boolean(isFavorite),
                userRating: userRating[0] ? userRating[0].rating : null,
            };
        } catch (error) {
            console.error(error);
        }
    }
}
