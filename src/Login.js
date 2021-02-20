import { UserContext } from './providers/UserProvider';
import React, {  useEffect, useContext, useState } from 'react';
import { signInWithGoogle } from './services/firebase';
import { Redirect, useHistory } from "react-router-dom";
import GoogleButton from "react-google-button";
import Hand from "./helping.svg";
function Login (){

    const user = useContext(UserContext);
    const [redirect, setredirect] = useState(null);
    const history = useHistory();
    useEffect(() => {
        if (user) {
            if (user['username']){
                setredirect('/' + user['username']);
            }
            else{
                setredirect('/signup')
            }

        }
    }, [user]);
    if (redirect) {
        history.push(redirect);
    }
        return (
            <div className="App">
                <header className="App-header">

                        <h1>Sign up to be an <span className={"Logo"}>ACTIVST<img className={"logoHand"} src={Hand}/> </span></h1>
                        <div className="login-buttons">
                                {/*<a href={"instagram://story-camera"}>Story</a>*/}
                                <GoogleButton id="googleSignIn" type="light" onClick={signInWithGoogle}/>

                        </div>

                </header>
            </div>
        );
}

export default Login;
