import React from "react";

import "./Content.css";
import UserContent from "./UserContent/UserContent";

const Content = (props) => {
    const {
        _id,
        title,
        genre,
        imdbId,
        averageScore,
        year,
        userData,
    } = props.movieData;
    return (
        <article className="content-wrapper">
            <div className="common__data-wrapper">
                <div id="movie-title">
                    <span className="common__data">{title}</span>
                </div>
                <h2 id="movie-genre">
                    genre: <span className="common__data">{genre}</span>
                </h2>
                <div className="common__data-small">
                    <h2 id="movie-imdb">
                        imdb id: <span className="common__data">{imdbId}</span>
                    </h2>
                    <h2 id="movie-avg">
                        average score:{" "}
                        <span className="common__data">{averageScore}</span>
                    </h2>
                </div>
                <h2 id="movie-year">
                    production year:{" "}
                    <span className="common__data">{year}</span>
                </h2>
            </div>
            {props.authData.isAuth && (
                <>
                    {/* <hr /> */}
                    <UserContent
                        userData={userData}
                        authData={props.authData}
                        movieId={_id}
                        movieTitle={title}
                        port={props.port}
                        searchHandler={props.searchHandler}
                    />
                </>
            )}
        </article>
    );
};

export default Content;
