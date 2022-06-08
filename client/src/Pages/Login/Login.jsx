import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Login.css";
import baseUrl from "../../main";

const Login = () => {
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        axios.post(`${baseUrl}/auth/login/`, { username: username, password: password })
        .then(res => {
            if(!res) return;
            console.log(res.data);
        })
    };

    const handleUsernameChange = (e) => { setUsername(e.target.value); };
    const handlePasswordChange = (e) => { setPassword(e.target.value); };

    return (
        <main id="login-page-container">
            <h1 id="login-main-title">Welcome back!</h1>
            <p class="login-sub-title">Login to continue</p>
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