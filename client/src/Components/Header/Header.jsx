import "./Header.css";

const Header = () => {
    return (
        <header>
            <p id="header-logo-text">E-Commerce</p>
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
            <p id="header-account-text">Log In / Sign Up</p>
        </header>
    );
};

export default Header;