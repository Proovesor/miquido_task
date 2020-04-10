import React, { useState } from "react";
import Navbar from "./components/Navbar/Navbar";

import "./Signing.css";

const Signing = (props) => {
    const [emailValue, setEmailValue] = useState(null);
    const [passwordValue, setPasswordValue] = useState(null);

    const inputChangeHandler = (event) => {
        event.target.name === "email" && setEmailValue(event.target.value);
        event.target.name === "password" &&
            setPasswordValue(event.target.value);
    };

    const userInput = {
        email: emailValue,
        password: passwordValue,
    };

    return (
        <>
            <Navbar authData={props.authData} />
            <div className="form-wrapper">
                {props.errors && (
                    <h4 style={{ color: "red", margin: "auto" }}>
                        {props.errors.error}
                    </h4>
                )}
                <form
                    onSubmit={(event) =>
                        props.actionHandler(event, userInput, props)
                    }
                >
                    <div className="input-wrapper">
                        <div>
                            <label id="email">
                                Email:{" "}
                                <input
                                    name="email"
                                    type="email"
                                    onChange={inputChangeHandler}
                                />
                            </label>
                        </div>
                        <div>
                            <label>
                                Password:{" "}
                                <input
                                    name="password"
                                    type="password"
                                    onChange={inputChangeHandler}
                                />
                            </label>
                        </div>
                        <button type="submit" className="button">
                            {props.action === "login" && "signIn"}
                            {props.action === "register" && "signUp"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Signing;
