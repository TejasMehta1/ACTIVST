import dotenv from 'dotenv'
import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";

dotenv.config();

firebase.initializeApp({
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId:  process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID
});

export const auth = firebase.auth();
export const firestore = firebase.firestore();
const googleProvider = new firebase.auth.GoogleAuthProvider();
export const signInWithGoogle = () => {
    auth.signInWithPopup(googleProvider).then((res) => {
        console.log(res.user)
    }).catch((error) => {
        console.log(error.message)
    })
};
export const generateUserDocument = async (user, additionalData) => {
    if (!user) return;

    const userRef = firestore.doc(`users/${user.uid}`);
    const snapshot = await userRef.get();

    if (!snapshot.exists) {
        const { email, displayName, photoURL } = user;
        try {
            await userRef.set({
                displayName,
                email,
                photoURL,
                ...additionalData
            });
        } catch (error) {
            console.error("Error creating user document", error);
        }
    }
    return getUserDocument(user.uid);
};

const getUserDocument = async uid => {
    if (!uid) return null;
    try {
        const userDocument = await firestore.doc(`users/${uid}`).get();

        return {
            uid,
            ...userDocument.data()
        };
    } catch (error) {
        console.error("Error fetching user", error);
    }
};

export const updateUserName = async (user, usrName) => {
    if (!user) return;

    const userRef = firestore.doc(`users/${user.uid}`);
    const snapshot = await userRef.get();

    if (snapshot.exists) {

        let currUsrName = await snapshot.get('userName');
        if (currUsrName){
            await removeUrlDocument(currUsrName);
        }
        try {
            await userRef.update({
                userName: usrName
            });
        } catch (error) {
            console.error("Error creating user document", error);
        }
    }

    let res = await addUrlDocument(user, usrName);
    return res;
};

const removeUrlDocument = async (usrName) => {
    const urlRef = firestore.doc(`urls/${usrName}`);
    await urlRef.delete();
};

const addUrlDocument = async (user, usrName) => {
    const urlRef = firestore.doc(`urls/${usrName}`);
    const snapshot = await urlRef.get();

    if (!snapshot.exists) {
        try {
            await urlRef.set({
                uid: user.uid,
            });
        } catch (error) {
            console.error("Error creating user document", error);
            return false;
        }
    }
    else{
        console.error("Username Already Exists");
        return false;
    }
    return true;
};

export const checkIfUrlExists = async (usrName) => {
    const urlRef = firestore.doc(`urls/${usrName}`);
    const snapshot = await urlRef.get();
    if (snapshot.exists){
        return await snapshot.get('uid');
    }
    else{
        return false;
    }


};
