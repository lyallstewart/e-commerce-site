import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
    return (
        <header>
            <Link to="/" id="header-logo-text">E-Commerce</Link>
            <a className="header-product-link" href="#">Men</a>
            <a className="header-product-link" href="#">Women</a>
            <a className="header-product-link" href="#">Children</a>
            <div id="header-search-container">
                <i style={{color: "white"}} className="material-symbols-outlined">search</i>
                <input id="header-search" type="text" placeholder="Search for a product"/>
            </div>
            <div id="header-cart-container">
                <i style={{color: "white"}} className="material-symbols-outlined">shopping_bag</i>
                <p id="header-cart-text">0</p>
            </div>
            <div id="header-account-button-container">
                <Link to="/login" className="header-account-text">Log In</Link>
                <Link to="/signup" className="header-account-text">Sign Up</Link>
            </div>
        </header>
    );
};

export default Header;