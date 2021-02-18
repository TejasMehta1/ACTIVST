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

function Nav (){

    const user = useContext(UserContext);
    const history = useHistory();
    const goTo = () =>{
        history.push('/');
    };

    const signOutAndGoTo = () => {
        signOut().then(() => goTo());
    };




    return (
       <div className={"Nav"}>
           <div className={"Left"}>
               Activst

           </div>
           <div className={"Right"}>
               {user ? <p>Welcome {user.displayName} <Button onClick={signOutAndGoTo}>Sign Out</Button></p> :  <Button onClick={goTo}>Sign Up</Button>}

           </div>


       </div>
    );
}

export default Nav;
