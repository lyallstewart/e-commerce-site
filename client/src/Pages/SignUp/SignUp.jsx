import "./SignUp.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

const SignUp = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const handleUsernameChange = (e) => { setUsername(e.target.value); };
    const handlePasswordChange = (e) => { setPassword(e.target.value); };
    const handleEmailChange = (e) => { setEmail(e.target.value); };
    const handleFirstNameChange = (e) => { setFirstName(e.target.value); };
    const handleLastNameChange = (e) => { setLastName(e.target.value); };

    const handleSignup = (e) => {
        e.preventDefault()
        axios.post(`https://localhost:8443/auth/signup`, { 
            username: username, 
            password: password,
            email: email,
            firstName: firstName,
            lastName: lastName
        })
        .then(res => {
          console.log(res);
          console.log(res.data);
        })
    };

    return (
        <main id="signup-page-container">
            <h1 id="signup-main-title">Welcome!</h1>
            <p className="signup-sub-title">Sign up to continue</p>
            <div id="signup-form-container">
                <form id="signup-form">
                    <input onChange={handleEmailChange} className="signup-input" id="signup-email-input" type="email" placeholder="Email" />
                    <input onChange={handleUsernameChange} className="signup-input" id="signup-username-input" type="text" placeholder="Username" />
                    <input onChange={handlePasswordChange} className="signup-input" id="signup-password-input" type="password" placeholder="Password" />
                    <div id="signup-name-container">
                        <input onChange={handleFirstNameChange} className="signup-input" id="signup-firstname-input" type="text" placeholder="First Name" />
                        <input onChange={handleLastNameChange} className="signup-input" id="signup-lastname-input" type="text" placeholder="Last Name" />
                    </div>
                    <button type="submit" className="signup-input" id="signup-submit-button" onClick={handleSignup}>Sign Up</button>
                </form>
            </div>
            <Link id="signup-login-button" to="/login">Already have an account?</Link>
        </main>
    );
};

export default SignUp;