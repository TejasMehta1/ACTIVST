import { UserContext } from './providers/UserProvider';
import React, {  useEffect, useContext, useState } from 'react';
import {signInWithGoogle, updateUserName, checkIfUrlExists, getUserName} from './services/firebase';
import { Redirect, useHistory } from "react-router-dom";
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import toaster from "toasted-notes";
import "toasted-notes/src/styles.css"; // optional styles
import InstaMock from "./InstagramMock.png"

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
        else if(('userName' in user && isValidUrl(user['userName']))){
            setredirect('/admin');
        }
        else {
            getUserName(user).then((res) =>
            {
                if (res && isValidUrl(res)){
                    setredirect('/admin');
                }
            });
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
                updateUserName(user, userName).then((r) => {
                    if(r){
                        setredirect('/');
                    }
                });
            }
            else if(res == user.uid){
                console.log("Redirecting Anyways");
                setredirect('/admin');
            }
            else{
                console.error("Url Already Exists" + res);
                toaster.notify("Username Already Taken", {
                    duration: 3000
                });
            }
        }
        else{
            toaster.notify("Username contains invalid characters: " + userName, {
                duration: 3000,
            });
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
                <div className="variableContainer">
                    <p>Create your custom domain to host the causes you're most passionate about and allow for one-click donations (only use lowercase letters, numbers, and hyphens</p>
                    <br/>
                    <TextField error={!isValidUrl(userName)} value={userName} id="username" label="Username(*)"  InputProps={{
                    startAdornment: <InputAdornment position="start">activst.org/</InputAdornment>,
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
                    <br/>
                    <img style={{width: "50%", marginTop:"30px"}} src={InstaMock}/>

                </div>
            </header>
        </div>
    );
}

export default Signup;
