import React, { useEffect, useState } from 'react';
import { useAuth } from 'reactfire';
import 'firebase/auth'
import { Link } from 'react-router-dom'
import firebase from 'firebase';
import googleLogo from '../assets/images/btn_google_signin_dark_normal_web.png';
import { useUser } from 'reactfire';
import axios from 'axios';
import {config} from '../config';

const Login = () => {
    // User State
    const [userEntry, setUser] = useState({
        email: '',
        password: '',
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

    //Google Sign In
    const signIn = async () => {
        await reactAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then((result) => {

            //TODO: Handle if an error occurs. That's probably a good idea.
            if(result.isNewUser){
                axios.post(`${config.apiUrl}/user`, {
                    displayName: result.user.displayName,
                    email: result.user.email,
                    uid: result.user.uid
                }).then(() => {
                    window.location.href = "/dashboard";
                })
            } else {
                window.location.href = "/dashboard";
            }      
        });
    };


    // Submit function (Log in user)
    const handleSubmit = e => {
        e.preventDefault();

        //log in with email ()
        firebase.auth().signInWithEmailAndPassword(userEntry.email, userEntry.password).then(result => {
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
            <h3 className="title center">Log In</h3>
            <p>Sign in with Google creates a new account, so just use that for now.</p>
            <div className="login-wrapper">
                <form className="signup-form" onSubmit={handleSubmit}>
                    <label className="form-label" htmlFor="email">Email Address</label><br />
                    <input type="text" placeholder="yourname@writan.app" name="email" onChange={handleChange} required />
                    <div>
                        <label className="form-label text-center" htmlFor="password">
                            Password
                        </label>
                        <br />
                        <input type="password" placeholder="******************" name="password" onChange={handleChange} required /><br />
                    </div>

                    <button className="w-75 submit-button-round-blue" type="submit">Log In</button>
                    <br />
                    <img src={googleLogo} onClick={signIn} alt="Sign in With Google Logo" />


                </form>
            </div>

            <hr />
            {userEntry.error && <h4>{userEntry.error}</h4>}
            <div className="text-center">
                <Link to="/signup">
                    <span
                        className="link-text-secondary"
                    >
                        No account? Create one here.
                    </span>
                </Link>
            </div>
            <div className="text-center">
                <Link to="/resetpassword"><span className="link-text-secondary">Reset Password</span></Link>
            </div>



        </>


    )
};

export default Login;