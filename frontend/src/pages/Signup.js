import React, { useEffect, useState } from 'react';
import { useAuth } from 'reactfire';
import 'firebase/auth'
import { Link } from 'react-router-dom'
import firebase from 'firebase';
import googleLogo from '../assets/images/btn_google_signin_dark_normal_web.png';
import { useUser } from 'reactfire';
import axios from 'axios';
import { config } from '../config';

const Signup = () => {
    // User State
    const [userEntry, setUser] = useState({
        email: '',
        password: '',
        username: '',
        error: '',
    });

    const { data: user } = useUser();



    const handleChange = e => {
        setUser({
            ...userEntry,
            [e.target.name]: e.target.value,
            error: '',
        })
    };

    const reactAuth = useAuth()

    //sign in with Google
    const signIn = async () => {
        await reactAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then((result) => {
            axios.post(`${config.apiUrl}/user`, {
                displayName: result.user.displayName,
                email: result.user.email,
                uid: result.user.uid
            }).then(result => {
                window.location.href = "/dashboard";
            })

        });
    };


    // Submit function (Email user)
    const handleSubmit = e => {
        e.preventDefault();
        // Log in code here.

        firebase.auth().createUserWithEmailAndPassword(userEntry.email, userEntry.password).then(result => {
            axios.post(`${config.apiUrl}/user`, {
                displayName: result.user.displayName,
                email: result.user.email,
                uid: result.user.uid
            }).then(result => {
                window.location.href = "/dashboard";
            })
            window.location.href = "/dashboard"
        })
            .catch(error => {
                // Update the error
                setUser({
                    ...userEntry,
                    error: error.message,
                })
            })
    }

    return (
        <>
            <h3 className="title center">Create Account</h3>
            <div className="login-wrapper">
                <form className="signup-form" onSubmit={handleSubmit}>
                    <label className="form-label" htmlFor="email">Email Address</label><br />
                    <input type="text" placeholder="yourname@writan.app" name="email" onChange={handleChange} required />
                    <div>
                        <label className="form-label" htmlFor="username">Username</label><br />
                        <input type="text" name="username" onChange={handleChange} required />
                    </div>
                    <div>
                        <label className="form-label text-center" htmlFor="password">
                            Password
                        </label>
                        <br />
                        <input type="password" placeholder="******************" name="password" onChange={handleChange} required /><br />
                    </div>
                    <button className="w-75 submit-button-round-blue" type="submit">Sign Up</button>
                    <br />
                    <img src={googleLogo} onClick={signIn} alt="Sign in With Google Logo" />
                </form>
            </div>

            <hr />
            {userEntry.error && <h4>{userEntry.error}</h4>}
            <div className="text-center">
                <Link to="/login">
                    <span
                        className="link-text-secondary"
                    >
                        Already have an account? Log in here.
                    </span>
                </Link>
            </div>
            <div className="text-center">
                <Link to="/resetpassword"><span className="link-text-secondary">Reset Password</span></Link>
            </div>



        </>


    )
};

export default Signup;