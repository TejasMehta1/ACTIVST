import { UserContext } from './providers/UserProvider';
import React, {  useEffect, useContext, useState } from 'react';
import { signInWithGoogle, updateUserName, checkIfUrlExists } from './services/firebase';
import { Redirect, useHistory } from "react-router-dom";
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

import './Signup.css';
function Signup (){
    const [userName, setUserName] = useState("");
    const user = useContext(UserContext);
    const [redirect, setredirect] = useState(null);
    const history = useHistory();
    useEffect(() => {
        if (!user) {
                setredirect('/')
        }
        else if('userName' in user && isValidUrl(user['userName'])){
            setredirect('/admin');
        }
    }, [user]);
    if (redirect) {
        history.push(redirect);
    }

    const handleUsernameChange = (newUsr) => {
        setUserName(newUsr.toLowerCase());

    };

    const submitUserName = async () => {
        if (userName !== "" && isValidUrl(userName)){
            let res = await checkIfUrlExists(userName);
            if (!res) {
                updateUserName(user, userName).then(setredirect('/admin/' + userName));
            }
            else if(res == user.uid){
                console.log("Redirecting Anyways");
                setredirect('/admin');
            }
            else{
                console.error("Url Already Exists" + res);
            }
        }
        else{
            console.log(userName);
        }

    };

    const isValidUrl = (str) => {
        var code, i, len;

        for (i = 0, len = str.length; i < len; i++) {
            code = str.charCodeAt(i);
            if (!(code > 47 && code < 58) && // numeric (0-9)
                !(code > 64 && code < 91) &&
                !(code == 45) &&
                !(code > 96 && code < 123)) { // lower alpha (a-z)
                return false;
            }
        }
        return true;
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>Welcome {user && ['displayName'] in user ? user['displayName'] : ""}!</h1>
                <div className="login-buttons">
                    <p>Create your custom domain to host the causes you're most passionate about and allow for one-click donations (only use lowercase letters, numbers, and hyphens</p>
                     <TextField id="username" label="Username"  InputProps={{
                    startAdornment: <InputAdornment position="start">Activst.com/</InputAdornment>,
                }}
                     onChange={event => handleUsernameChange(event.target.value)}
                     />
                    <Button
                        variant="contained"
                        color="primary"
                        // className={classes.button}
                        onClick={submitUserName}
                        endIcon={<ArrowForwardIosIcon>Activate</ArrowForwardIosIcon>}
                    >
                        Activate
                    </Button>
                </div>
            </header>
        </div>
    );
}

export default Signup;
