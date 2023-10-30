import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.jpg";
const Nav = () => {
    return (
        <div className="nav">
            <Link to={"/"} className="nav__link">
                <img src={logo} alt="Logo" className="nav__img"  />
            </Link>
        </div>
    );
};

export default Nav;
