import React from "react";
import { Link } from "react-router-dom";

import "./Navbar.css";

const Navbar = (props) => {
    return (
        <nav className="navbar">
            <ul className="nav-list">
                <div className="home-wrapper">
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                </div>
                {!props.authData.isAuth ? (
                    <div className="signing-wrapper">
                        <li>
                            <Link to="/login">Sign in</Link>
                        </li>
                        <li>
                            <Link to="/register">Sign up</Link>
                        </li>
                    </div>
                ) : (
                    <input
                        type="button"
                        className="logout-button"
                        value="Sign out"
                        onClick={() => props.actionHandler()}
                    />
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
