import logo from './logo.svg';
import './App.css';
import blm from './blm.png'
import farmers from './farmers.jpg'
import nokid from './nokidhungry.png'
import Figure from 'react-bootstrap/Figure'
import ProgressBar from 'react-bootstrap/ProgressBar'
import LoadingBar from 'react-top-loading-bar'
import React, {useContext, useState, useEffect} from 'react'
import {makeStyles} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Slider from '@material-ui/core/Slider';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import GooglePayButton from '@google-pay/button-react';
import LinearProgress from "@material-ui/core/LinearProgress";
import Grid from '@material-ui/core/Grid';
import axios from "axios";
import Cause from './Cause';
import {getCauseArray} from './services/firebase';
import {UserContext} from "./providers/UserProvider";
import {
    useParams
} from "react-router-dom";


function App() {
    const [progress, setProgress] = useState(0);
    const [open, setOpen] = React.useState(false);
    const [currIndex, setCurrIndex] = React.useState(0);
    const [donation, setDonation] = React.useState(false);
    const [causeData, setCauseData] = React.useState([{title: "Activst", image: ""}]);
    const nl2br = require('react-nl2br');
    let userHash = useParams().userHash;

    const bios = {
        "Black Lives Matter": "Black Lives Matter is a decentralized political and social movement protesting against incidents of police brutality and all racially motivated violence against black people. We appreciate your support of the movement and our ongoing fight to end state-sanctioned violence, liberate Black people, and end white supremacy forever.",
        "No Kid Hungry": "America's kids need us. Because of the coronavirus, millions of vulnerable children are losing the school meals they depend on. For some, it's the only food they'll receive in a given day. We have a plan to feed kids, but we need your help today to continue our work to ensure every kid gets three meals a day.\n" +
            "\n" +
            "Donations made through this page support Share Our Strength's entire mission and will not be designated to a specific campaign or location. Your gift will be used where it is needed most.",
        "Indian Farmers": `Over 75% of Punjab’s 30 million-strong population is involved in agriculture. The three new laws fail to protect farmers from exploitation and to ensure fair prices for their produce. These laws could lead to large private corporate entities taking advantage of farmers.The funds you donate will be used towards giving protesting farmers the assistance they need to sustain their fight:
-Providing ambulances and arranging for doctors to go along the farmers to Delhi
-Portable toilets that will be towed behind vehicles for use by families
-Financial assistance for diesel for farmers' tractors
-Rent for buses and trucks (some of the farmers do not have their own vehicles) 
-Mattresses and bedding for overnight use\n`,

    };

    const handleOpen = (ind) => {
        setOpen(true);
        setCurrIndex(ind);
    };

    const user = useContext(UserContext);

    // const causeData = [{index: 1, title: "Black Lives Matter", picture: "https://garveylhkgn.files.wordpress.com/2020/06/blm.png?w=450"}, {index: 2, title: "No Kid Hungry", picture: "https://pbs.twimg.com/profile_images/1179877675701342209/e9bo6xML_400x400.png"}, {index: 3, title: "Indian Farmers", picture: "https://ih1.redbubble.net/image.1745001457.7090/st,small,507x507-pad,600x600,f8f8f8.jpg"}];


    useEffect(() => {
        getCauseArray(userHash).then(r => {
            if(r){
                setCauseData(r);
                console.log(r);
                console.log(userHash);
            }
        });
    }, []);




    const handleClose = () => {
        setOpen(false);
    };

    const [value, setValue] = React.useState(30);

    const handleSliderChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleInputChange = (event) => {
        setValue(event.target.value === '' ? '' : Number(event.target.value));
    };

    const handleBlur = () => {
        if (value < 0) {
            setValue(0);
        } else if (value > 100) {
            setValue(100);
        }
    };
    const paymentRequest = {
        apiVersion: 2,
        apiVersionMinor: 0,
        allowedPaymentMethods: [
            {
                type: 'CARD',
                parameters: {
                    allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                    allowedCardNetworks: ['MASTERCARD', 'VISA'],
                },
                tokenizationSpecification: {
                    type: 'PAYMENT_GATEWAY',
                    parameters: {
                        gateway: 'example',
                        gatewayMerchantId: 'exampleGatewayMerchantId',
                    },
                },
            },
        ],
        merchantInfo: {
            merchantId: '12345678901234567890',
            merchantName: 'Demo Merchant',
        },
        transactionInfo: {
            totalPriceStatus: 'FINAL',
            totalPriceLabel: 'Total',
            totalPrice: '100.00',
            currencyCode: 'USD',
            countryCode: 'US',
        },
    };
    function handleLoadPaymentData(paymentData) {


        const params = new URLSearchParams({
            "causeName" : causeData[currIndex].title,
            "causeEmail" : "tejasmehtag@gmail.com",
            "amt" : value,
            "pwd": "checkbook"
        }).toString();

        const url = 'https://us-central1-activst.cloudfunctions.net/checkbook?' + params;

        // axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

        console.log('load payment data', paymentData);
        axios.post(url,  {headers: {
            "Content-Type": "text/plain"}
    })
            .then(res => {
                console.log(res);
                console.log(res.data);
                setDonation(donation + value);
                handleClose();
            })
    }


    return (

        <div className="App">

            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={"modal"}
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <div className={"paper"}>
                        <h2 id="transition-modal-title">{causeData[currIndex].title}</h2>
                        <p id="transition-modal-description">{nl2br(causeData[currIndex].description)}</p>
                        <Slider
                            value={typeof value === 'number' ? value : 0}
                            onChange={handleSliderChange}
                            aria-labelledby="input-slider"
                        />


                        <Input
                            className={"sliderInput"}
                            value={value}
                            margin="dense"
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            startAdornment={<InputAdornment style={{color: "white"}} position="start">$</InputAdornment>}
                            inputProps={{
                                step: 10,
                                min: 0,
                                max: 100,
                                type: 'number',
                                'aria-labelledby': 'input-slider',

                            }}
                        />
                        <br/>
                        <br/>
                        <br/>
                        <GooglePayButton
                            environment="TEST"
                            buttonType={"donate"}
                            buttonColor="yellow"
                            paymentRequest={paymentRequest}
                            onLoadPaymentData={handleLoadPaymentData}
                        />

                    </div>
                </Fade>
            </Modal>
            <header className="App-header">
                <div>
                    <LoadingBar
                        color='#f11946'
                        progress={progress}
                        onLoaderFinished={() => setProgress(0)}
                        loaderSpeed={600}
                    />
                </div>
                <h1>@{userHash}'s Causes</h1>

                    <Grid item xs={12}>
                        <Grid container justify="center" spacing={0}>
                            {causeData.map((data, index) => (
                                <Grid key={index} item>
                                    <Cause title={data.title} picture={data.image} handleOpen={handleOpen} index={index}/>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>

                <LinearProgress className={"progressBar"} variant="determinate" value={(4000+donation)/9000*100} />
                <h3>${4000 + donation} raised out of $9000 goal</h3>
            </header>
        </div>
    );
}

export default App;
