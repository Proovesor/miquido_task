import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Signing from "./screens/Signing";
import Home from "./screens/Home";

function App() {
    const API_SERVICE_PORT = 8080;

    const [authData, setAuthData] = useState({
        token: null,
        email: null,
        isAuth: false,
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const token = localStorage.getItem("token");
        const expiryDate = localStorage.getItem("expiration");
        if (!token || !expiryDate) return;
        if (new Date() >= new Date(expiryDate)) {
            logoutHandler();
            return;
        }
        const email = localStorage.getItem("email");
        const remainingTime =
            new Date(expiryDate).getTime() - new Date().getTime();
        setAuthData({
            token: token,
            email: email,
            isAuth: true,
        });
        setLogoutTimer(remainingTime);
    }, [authData.isAuth]);

    const signupHandler = async (event, userData, props) => {
        event.preventDefault();
        const url = `http://localhost:${API_SERVICE_PORT}/signup`;

        try {
            const fetchResponse = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });
            const retreivedData = await fetchResponse.json();

            if (retreivedData.created) {
                props.history.push("/login");
                setErrors({});
                return;
            }
            if (retreivedData.password) {
                setErrors({ error: retreivedData.password });
                return;
            }
            if (retreivedData.exists) {
                setErrors({ error: retreivedData.exists });
                return;
            }
        } catch (error) {
            throw new Error(error);
        }
    };

    const loginHandler = async (event, userData, props) => {
        event.preventDefault();
        const url = `http://localhost:${API_SERVICE_PORT}/signin`;

        try {
            const fetchResponse = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });
            const retrievedData = await fetchResponse.json();
            if (retrievedData.token) {
                localStorage.setItem("token", retrievedData.token);
                localStorage.setItem("email", retrievedData.userInfo.email);
                localStorage.setItem(
                    "expiration",
                    new Date(
                        new Date().getTime() + 1000 * 60 * 60
                    ).toISOString()
                );
                setAuthData({
                    token: retrievedData.token,
                    email: retrievedData.userInfo.email,
                    isAuth: true,
                });

                setLogoutTimer(1000 * 60 * 60);
                props.history.push("/");
                return;
            }
            setErrors({ error: "Invalid email or password." });
        } catch (error) {
            throw new Error(error);
        }
    };

    function setLogoutTimer(time) {
        setTimeout(() => logoutHandler(), time);
    }

    function logoutHandler() {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("expiration");
        setAuthData({
            token: null,
            email: null,
            isAuth: false,
        });
    }

    return (
        <Router>
            <div>
                <Switch>
                    <Route exact path="/">
                        <Home
                            authData={authData}
                            actionHandler={logoutHandler}
                            port={API_SERVICE_PORT}
                        />
                    </Route>
                    {!authData.isAuth && (
                        <Route
                            exact
                            path="/login"
                            render={(props) => (
                                <Signing
                                    {...props}
                                    authData={authData}
                                    action="login"
                                    actionHandler={loginHandler}
                                    isAuth={authData.isAuth}
                                    errors={errors}
                                />
                            )}
                        />
                    )}
                    {!authData.isAuth && (
                        <Route
                            exact
                            path="/register"
                            render={(props) => (
                                <Signing
                                    {...props}
                                    authData={authData}
                                    action="register"
                                    actionHandler={signupHandler}
                                    isAuth={authData.isAuth}
                                    errors={errors}
                                />
                            )}
                        />
                    )}
                    <Route render={() => <h2>404 Page Not Found</h2>} />
                </Switch>
            </div>
        </Router>
    );
}

export default App;
