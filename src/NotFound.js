import { UserContext } from './providers/UserProvider';
import React, {  useEffect, useContext, useState } from 'react';
import {signOut} from './services/firebase';
import { Redirect, useHistory } from "react-router-dom";
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import "./Nav.css"
import Grid from "@material-ui/core/Grid";

function NotFound (){

    const user = useContext(UserContext);
    const history = useHistory();
    const urlParams = new URLSearchParams(window.location.search);

    const goTo = () =>{
        history.push('/');
    };

    const signOutAndGoTo = () => {
        signOut().then(() => goTo());
    };




    return (
        <div className="App">
            <header className="App-header">
                <h3>@{urlParams.get('query')} doesn't match to an account you can claim it by signing up:</h3>
                <br/>
                <Button variant="contained" color="primary" onClick={goTo}>Sign Up</Button>
            </header>
        </div>
    );
}

export default NotFound;
