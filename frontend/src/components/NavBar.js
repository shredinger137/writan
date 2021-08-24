import React, { useState } from 'react';
import { BrowserRouter, Link } from 'react-router-dom'
import { useFirebaseApp, useUser } from 'reactfire';
import '../assets/css/nav.css';
import profile from '../assets/images/profile_default.png';
function NavBar(props) {

    const { data: user } = useUser();
    const firebase = useFirebaseApp();

    const handleLogOut = () => {
        firebase.auth().signOut();
    }

    const handleUserProfileClick = () => {
        document.getElementById("user-menu").classList.toggle('hide')
    }

    return (
        <>
            <nav className="header">
                <ul className="menuList">
                      <li><Link to="/catalog">Catalog</Link></li>
                    <li><Link to="/dashboard">Dashboard</Link></li>
                    {
                        user ?

                            <img src={profile} onClick={handleUserProfileClick} className="user-icon"></img>

                            :
                            null
                    }
                </ul>
                {user ?
                    <div className="user-menu hide" id="user-menu">
                        <ul id="user-menu-list">
                            <li><Link to="/profile">My Profile</Link></li>
                            <li style={{cursor: "pointer"}} onClick={handleLogOut}>Log Out</li>
                        </ul>
                    </div>
                    :
                    <Link className="login-link" to="/login">Log In</Link>
                }


            </nav>
        </>
    );


}

export default NavBar;



