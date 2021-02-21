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
import Tooltip from '@material-ui/core/Tooltip';
import Hand from "./helping.svg"

function Nav (){

    const user = useContext(UserContext);
    const history = useHistory();
    const goTo = () =>{
        history.push('/');
    };

    const signOutAndGoTo = () => {
        signOut().then(() => goTo());
    };

    const showAdmin = () => {
        // return ;
    };




    return (
       <div className={"Nav"}>
           <div className={"Left vertical-center"}>
               <h1 onClick={goTo} className={"Logo navLogo"}><span>ACTIVST</span> <img className={"logoHand"} src={Hand}/></h1>

           </div>
           <div className={"Right vertical-center"}>
               {user ? <p className={"Welcome"}> <Tooltip title={user.email} arrow>
                   <img className={"pfp vertical-center"} src={user.photoURL} alt="Profile"/>
               </Tooltip>  <Button id={"adminButton"} variant={"contained"} onClick={goTo}>Admin</Button> <Button id={"signOut"} onClick={signOutAndGoTo}>Sign Out</Button> </p>  :  (window.location.pathname !== "/" ? <Button onClick={goTo}>Sign Up</Button> : "")}

           </div>


       </div>
    );
}

export default Nav;
