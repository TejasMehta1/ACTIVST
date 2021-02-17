import { UserContext } from './providers/UserProvider';
import React, {  useEffect, useContext, useState } from 'react';
import { signInWithGoogle } from './services/firebase';
import { Redirect, useHistory } from "react-router-dom";
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
                    <h1>Sign up to be an ACTIVST</h1>
                    <div className="login-buttons">
                        <button className="login-provider-button" onClick={signInWithGoogle}>
                            <img src="https://img.icons8.com/ios-filled/50/000000/google-logo.png" alt="google icon"/>
                            <span> Continue with Google</span>
                        </button>
                    </div>
                </header>
            </div>
        );
}

export default Login;
