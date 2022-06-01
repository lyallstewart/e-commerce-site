import React, { useEffect } from "react";
import WebFont from 'webfontloader';
import { Outlet} from "react-router-dom";
import "./App.css";
import Header from "../Components/Header/Header.jsx";

const App = () => {
    useEffect(() => {
        WebFont.load({
          google: {
            families: ['Roboto', 'Inter', 'Roboto Condensed', "Material Symbols Outlined"]
          }
        });
       }, []);
    return (
        <div id="app-global-wrapper">
            <Header />
            <main>
                <p>Content</p>
            </main>
            <footer>
                <p>&copy; 2022 Lyall Stewart</p>
            </footer>
        </div>
    );
};

export default App;