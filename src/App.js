import logo from './logo.svg';
import './App.css';
import blm from './blm.png'
import farmers from './farmers.jpg'
import nokid from './nokidhungry.png'
import Figure from 'react-bootstrap/Figure'
import ProgressBar from 'react-bootstrap/ProgressBar'
import LoadingBar from 'react-top-loading-bar'
import React, {useState} from 'react'
import {makeStyles} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Slider from '@material-ui/core/Slider';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import GooglePayButton from '@google-pay/button-react';
import LinearProgress from "@material-ui/core/LinearProgress";



function App() {
    const [progress, setProgress] = useState(0);
    const [open, setOpen] = React.useState(false);
    const [title, setTitle] = React.useState(false);
    const nl2br = require('react-nl2br');

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

    const handleOpen = (title) => {
        setOpen(true);
        setTitle(title);
    };

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
        console.log('load payment data', paymentData);
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
                        <h2 id="transition-modal-title">{title}</h2>
                        <p id="transition-modal-description">{nl2br(bios[title])}</p>
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
                <h1>Tejas Mehta's Causes</h1>
                <div className={"contain"}>
                    <Figure className={"cause"}>
                        <Figure.Image
                            width={300}
                            height={300}
                            alt="171x180"
                            class="cause"
                            src={blm}
                            onClick={() => {
                                setProgress(100);
                                handleOpen("Black Lives Matter");
                            }}
                        />
                        <Figure.Caption>
                            Black Lives Matter

                        </Figure.Caption>
                    </Figure>
                    <Figure className={"cause"}>
                        <Figure.Image
                            width={300}
                            height={300}
                            alt="171x180"
                            class="cause"
                            src={nokid}
                            onClick={() => {
                                setProgress(100);
                                handleOpen("No Kid Hungry");
                            }}
                        />
                        <Figure.Caption>
                            No Kid Hungry

                        </Figure.Caption>
                    </Figure>

                    <Figure className={"cause"}>
                        <Figure.Image
                            width={300}
                            height={300}
                            alt="171x180"
                            class="cause"
                            src={farmers}
                            onClick={() => {
                                setProgress(100);
                                handleOpen("Indian Farmers");
                            }}
                        />
                        <Figure.Caption>
                            Indian Farmers
                        </Figure.Caption>
                    </Figure>

                </div>

                <LinearProgress className={"progressBar"} variant="determinate" value={50} />
                <h3>$4000 raised out of $9000 goal</h3>
            </header>
        </div>
    );
}

export default App;
