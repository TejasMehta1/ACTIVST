import { UserContext } from './providers/UserProvider';
import React, {  useEffect, useContext, useState } from 'react';
import {signInWithGoogle, updateUserName, checkIfUrlExists, getUserName, getCauseArray, setCauseArray} from './services/firebase';
import {Redirect, useHistory, useParams} from "react-router-dom";
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import SaveIcon from '@material-ui/icons/Save'
import CauseEdit from "./CauseEdit";
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

import './Signup.css';
import Grid from "@material-ui/core/Grid";
import Cause from "./Cause";
function Admin (){
    const [userName, setUserName] = useState("");
    const user = useContext(UserContext);
    const [redirect, setredirect] = useState(null);
    const history = useHistory();

    const defaultCauseEdit = {title: "", image: "", description: ""};

    let [causeDBData, setCauseDBData] = useState([]);
    let [newDBData, setNewDBData] = useState([]);




    useEffect(() => {
        if (!user) {
            setredirect('/');
        }
        else if(!('userName' in user)){
            setredirect('/signup');
        }
        else{
            reinitialize();
        }
    }, [user]);

    useEffect(() => {
        if(user){
            reinitialize();
        }

    }, []);

    if (redirect) {
        history.push(redirect);
    }

    const reinitialize = () => {
        getUserName(user).then( uName => {
            setUserName(uName);
            console.log(uName);
            getCauseArray(uName).then(r => {
                console.log(r);
                if(r && r.length >= 1 && 'title' in r[0] && 'image' in r[0] && 'description' in r[0]) {
                    setNewDBData(r);
                    setCauseDBData(r);
                }
                else{
                    setNewDBData(defaultCauseEdit);
                    setCauseDBData(defaultCauseEdit);
                }
            });
        });
    };

    const handleUsernameChange = (newUsr) => {
        setUserName(newUsr.toLowerCase());
    };

    const getNewDBData = () => {
        let res = newDBData.filter((e, index)=>(e !== null));
        if(res.length < 1 || !('title' in res[0] && 'image' in res[0] && 'description' in res[0])){
            return [defaultCauseEdit];
        }
        return res;
    };

    const updateDB = (index, key, value) => {
        let newArr = [];
        for (let i = 0; i < newDBData.length; i++){
            if(i != index) {
                newArr.push(newDBData[i]);
            }
            else{
                let newObj = newDBData[i];
                newObj[key] =value;
                newArr.push(newObj);
            }
        }
        setNewDBData(newArr);
    };

    const handleDelete = (ind) => {
        console.log("iayai: " + ind);
        console.log("Deleted");
        let newArr = [];
        for (let i = 0; i < newDBData.length; i++){
            if(i !== ind) {
                newArr.push(newDBData[i]);
            }
            else{
                newArr.push(null);
            }
        }
        console.log(newArr);
        setNewDBData(newArr);
    };

    const appendEmpty = () => {
        setCauseDBData([...causeDBData, defaultCauseEdit]);
        setNewDBData([...newDBData, defaultCauseEdit]);
    };
    const popItem = () => {
        setCauseDBData(causeDBData.filter((e, index)=>(index !== 0)))
    };

    const submitCausesAndUsername = async () => {
        // let firstDone = false;

        if (userName !== "" && isValidUrl(userName)){
            let res = await checkIfUrlExists(userName);
            if (!res) {
                updateUserName(user, userName).then( () =>
                {
                    setCauseArray(userName, getNewDBData()).then(() => {
                        setredirect('/' + userName);
                    });

                }
                );
            }
            else if(res === user.uid){
                console.log("Didn't Change Username");
                setCauseArray(userName, getNewDBData()).then(() => {
                    setredirect('/' + userName);
                });
            }
            else{
                console.error("Url Already Exists" + res);
            }
        }
        else{
            console.error("Invalid Username: " + userName);
        }



    };

    const isValidUrl = (str) => {
        var code, i, len;

        for (i = 0, len = str.length; i < len; i++) {
            code = str.charCodeAt(i);
            if (!(code > 47 && code < 58) && // numeric (0-9)
                !(code > 64 && code < 91) &&
                !(code === 45) &&
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
                       <TextField id="username" label="Username"  value={userName} InputProps={{
                        startAdornment: <InputAdornment position="start">Activst.com/</InputAdornment>,
                    }}
                               onChange={event => handleUsernameChange(event.target.value)}
                    />

                {causeDBData.length >= 1 ? causeDBData.map((data,index) => (
                        <CauseEdit ind={index} dbTitle={data.title} dbImage={data.image} dbDescription={data.description} handleDelete={handleDelete} updateDB={updateDB}/>

                )) : reinitialize()}
                    {/*<CauseEdit index={1} dbTitle={"Tejas"}/>*/}

                <Fab onClick={appendEmpty} color="primary" aria-label="add">
                    <AddIcon />
                </Fab>

                <br/>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={<SaveIcon />}
                    onClick={() => submitCausesAndUsername()}
                >
                    Save
                </Button>
                <br/>
            </header>
        </div>
    );
}

export default Admin;
