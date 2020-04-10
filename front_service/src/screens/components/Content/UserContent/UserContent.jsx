import React, { useState, useEffect } from "react";

import "./UserContent.css";

const UserContent = (props) => {
    const [isFavorite, setIsFavorite] = useState(props.userData.isFavorite);
    const [ratingValue, setRatingValue] = useState(1);

    useEffect(() => {
        setIsFavorite(props.userData.isFavorite);
    }, [props.movieId]);

    const handleFavoriteCheck = async (movieId, authData) => {
        const url = `http://localhost:${props.port}/favorite`;

        try {
            const fetchResult = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authData.token}`,
                },
                body: JSON.stringify({ movie_id: movieId }),
            });
            const retreivedData = await fetchResult.json();
            if (!retreivedData) return;
            setIsFavorite(!isFavorite);
        } catch (error) {
            throw new Error(error);
        }
    };

    const handleRating = async (movieId, rating, authData) => {
        const url = `http://localhost:${props.port}/rate`;
        rating = Number(rating);
        try {
            const fetchResult = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authData.token}`,
                },
                body: JSON.stringify({ movie_id: movieId, rating: rating }),
            });
            const retreivedData = await fetchResult.json();
            if (retreivedData.rated)
                return props.searchHandler(
                    null,
                    props.movieTitle,
                    props.authData
                );
        } catch (error) {
            throw new Error(error);
        }
    };

    const inputChangeHandler = (event) => {
        setRatingValue(event.target.value);
    };

    return (
        <div className="user__data-wrapper">
            <div className="user__data-favorite">
                <button
                    className={[
                        "fav__button",
                        isFavorite
                            ? "fav__button-checked"
                            : "fav__button-unchecked",
                    ].join(" ")}
                    onClick={() =>
                        handleFavoriteCheck(props.movieId, props.authData)
                    }
                >
                    fav
                </button>
            </div>
            <div className="user__data-rating">
                <h2>
                    your score:{" "}
                    <span className="user__data">
                        {props.userData.userRating}
                    </span>
                </h2>
                <div className="user__data-rating-rate">
                    <input
                        type="range"
                        name="rating"
                        defaultValue="1"
                        min="1"
                        max="10"
                        step="1"
                        onChange={(event) => inputChangeHandler(event)}
                    />
                    <div className="user__data-rating-submit">
                        <div id="rating-value">
                            <p>{ratingValue}</p>
                        </div>
                        <button
                            className="rate-button"
                            onClick={() =>
                                handleRating(
                                    props.movieId,
                                    ratingValue,
                                    props.authData
                                )
                            }
                        >
                            rate!
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserContent;
