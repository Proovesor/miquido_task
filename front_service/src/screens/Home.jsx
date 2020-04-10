import React, { useState } from "react";
import Navbar from "./components/Navbar/Navbar";

import "./Home.css";
import Content from "./components/Content/Content";

const Home = (props) => {
    const [movieTitle, setMovieTitle] = useState(null);
    const [movieData, setMovieData] = useState({
        _id: null,
        title: null,
        genre: null,
        imdbId: null,
        averageScore: null,
        year: null,
        userData: null,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [searchError, setSearchError] = useState(false);

    const inputChangeHandler = (event) => {
        setMovieTitle(event.target.value);
    };

    const searchHandler = async (event, title, authData) => {
        event && event.preventDefault();
        const url = `http://localhost:${props.port}/search`;

        try {
            const fetchResult = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authData.token}`,
                },
                body: JSON.stringify({ title: title }),
            });
            const retreivedData = await fetchResult.json();
            if (retreivedData.badRequest || retreivedData.error) {
                setSearchError(true);
                return;
            }
            setMovieData({
                _id: retreivedData.searchedMovie._id,
                title: retreivedData.searchedMovie.title,
                genre: retreivedData.searchedMovie.genre,
                imdbId: retreivedData.searchedMovie.imdbID,
                averageScore: retreivedData.averageRating,
                year: retreivedData.searchedMovie.year,
                userData: retreivedData.userData,
            });
            setSearchError(false);
            setIsLoading(false);
        } catch (error) {
            throw new Error(error);
        }
    };

    return (
        <>
            <Navbar
                authData={props.authData}
                actionHandler={props.actionHandler}
            />
            <div className="container">
                <div className="search-wrapper">
                    <form
                        onSubmit={(event) =>
                            searchHandler(event, movieTitle, props.authData)
                        }
                    >
                        <label>
                            Movie title:{" "}
                            <input
                                id="search-input"
                                type="text"
                                name="search"
                                onChange={inputChangeHandler}
                            />
                        </label>
                        <button type="submit" className="search-button">
                            search...
                        </button>
                    </form>
                </div>
                {searchError && (
                    <h1 style={{ margin: "auto" }}>
                        Could not find such movie.
                    </h1>
                )}
                {!isLoading && (
                    <Content
                        movieData={movieData}
                        port={props.port}
                        authData={props.authData}
                        searchHandler={searchHandler}
                    />
                )}
            </div>
        </>
    );
};

export default Home;
