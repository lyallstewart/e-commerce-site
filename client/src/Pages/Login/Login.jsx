import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const Login = (props) => {
    // Init hooks
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        axios.post(`https://localhost:8443/auth/login`, { username: username, password: password })
        .then(res => {
            if(!res) return;

            // If the login was successful, redirect to the homepage and update the data store
            if(res.data.success) {
                console.log("Login success")
                navigate("/", {replace: true})
            }
        })
    };

    const handleUsernameChange = (e) => { setUsername(e.target.value); };
    const handlePasswordChange = (e) => { setPassword(e.target.value); };

    return (
        <main id="login-page-container">
            <h1 id="login-main-title">Welcome back!</h1>
            <p className="login-sub-title">Login to continue</p>
            <div id="login-form-container">
                <form id="login-form">
                    <input className="login-input" id="login-username-input" type="text" placeholder="Username" value={username} onChange={handleUsernameChange}/>
                    <input className="login-input" id="login-password-input" type="password" placeholder="Password" value={password} onChange={handlePasswordChange}/>
                    <button onClick={handleLogin} type="submit" className="login-input" id="login-submit-button">Login</button>
                </form>
            </div>
            <Link id="login-register-button" to="/signup">Create an Account</Link>
        </main>
    );
}

export default Login;