import logo from './logo.svg';
import './App.css';
import blm from './blm.png'
import farmers from './farmers.jpg'
import nokid from './nokidhungry.png'
import Figure from 'react-bootstrap/Figure'
import ProgressBar from 'react-bootstrap/ProgressBar'
import LoadingBar from 'react-top-loading-bar'
import React, {useContext, useState, useEffect, createRef} from 'react'
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
import {Redirect, useHistory} from "react-router-dom";
import InstagramIcon from '@material-ui/icons/Instagram';
import Button from "@material-ui/core/Button";
import ClearIcon from '@material-ui/icons/Clear';
import WebIcon from '@material-ui/icons/Web';
import {logEventOnAnalytics} from "./services/firebase";
import {
    useParams
} from "react-router-dom";
import {useScreenshot} from "./ReactScreenShotHook";
import venmoIcon from './venmo-icon.svg'
import gfm from './GoFundMe_logo.svg'
import NoImage from "./noImage.png";
import cashApp from './CashApp.svg'
import petition from './petition.svg'
import instagram from "./instagram.svg"
import Checkbox from '@material-ui/core/Checkbox';
import {CopyToClipboard} from "react-copy-to-clipboard";
import toaster from "toasted-notes";
import Hand from "./helping.svg";

function App() {
    const [progress, setProgress] = useState(0);
    const [open, setOpen] = React.useState(false);
    const [currIndex, setCurrIndex] = React.useState(0);
    const [donation, setDonation] = React.useState(false);
    const [showCauses, setShowCauses] = React.useState(false);
    const [causeData, setCauseData] = React.useState([{title: "Activst", image: ""}]);
    const [displayInstaScreenshot, setDisplayInstaScreenshot] = React.useState("none");


    const nl2br = require('react-nl2br');
    const history = useHistory();
    const neededKeys = ['title', 'description'];
    const donationTypes = ['venmo', "gofundme", "cashapp", "direct"];
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
        logEventOnAnalytics('CauseExplored', {url: userHash, loggedIn: user != null});
    };

    const user = useContext(UserContext);

    // const causeData = [{index: 1, title: "Black Lives Matter", picture: "https://garveylhkgn.files.wordpress.com/2020/06/blm.png?w=450"}, {index: 2, title: "No Kid Hungry", picture: "https://pbs.twimg.com/profile_images/1179877675701342209/e9bo6xML_400x400.png"}, {index: 3, title: "Indian Farmers", picture: "https://ih1.redbubble.net/image.1745001457.7090/st,small,507x507-pad,600x600,f8f8f8.jpg"}];


    useEffect(() => {
        logEventOnAnalytics('ProfileView', {url: userHash, loggedIn: user != null});
        getCauseArray(userHash).then(r => {
            if (r) {
                if (r.length >= 1) {
                    let valid = true;
                    for (let i = 0; i < r.length; i++) {

                        valid = neededKeys.every(key => Object.keys(r[i]).includes(key));
                        if (valid) {
                            valid = r[i].title.length > 0
                        }

                    }
                    if (valid) {
                        setShowCauses(true);
                        setCauseData(r);
                        console.log(r);
                        console.log(userHash);
                    } else {
                        setShowCauses(false);
                    }

                }
            } else {
                history.push({
                        pathname: "/notfound",
                        search: '?query=' + userHash
                    }
                )
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

    const donationIsPresent = (param) => {
        return param in causeData[currIndex] && causeData[currIndex][param].length > 0;
    };

    const anyDonationIsPresent = () => {
        for (let i = 0; i < donationTypes.length; i++) {
            if (donationIsPresent(donationTypes[i])) {
                return true;
            }
        }
        return false;
    };

    const getDonation = (param) => {
        if (donationIsPresent(param)) {
            return causeData[currIndex][param];
        } else {
            return "";
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

    const drawInstagramStory = () => {
    };

    function handleLoadPaymentData(paymentData) {


        const params = new URLSearchParams({
            "causeName": causeData[currIndex].title,
            "causeEmail": "tejasmehtag@gmail.com",
            "amt": value,
            "pwd": "checkbook"
        }).toString();

        const url = 'https://us-central1-activst.cloudfunctions.net/checkbook?' + params;

        // axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

        console.log('load payment data', paymentData);
        axios.post(url, {
            headers: {
                "Content-Type": "text/plain"
            }
        })
            .then(res => {
                console.log(res);
                console.log(res.data);
                setDonation(donation + value);
                handleClose();
            })
    }

    const ref = createRef(null);
    const [image, takeScreenshot] = useScreenshot();
    const getImage = () => {
        document.getElementById("instagramCanvasContainer").style.display = "block";
        // let prev = document.getElementById("instaButton").style.display;
        // document.getElementById("instaButton").style.display = "none";
        logEventOnAnalytics('CauseEngagement', {url: userHash, loggedIn: user != null});
        logEventOnAnalytics('ShareStory', {url: userHash, loggedIn: user != null});
        takeScreenshot(ref.current, {allowTaint: true, useCORS: true});
        // document.getElementById("instaButton").style.display = prev;
    };

    useEffect(() => {
        downloadImg();
    }, [image]);

    const downloadImg = () => {
        if (image) {
            // let svgElements = document.body.querySelectorAll('svg');
            // svgElements.forEach(function(item) {
            //     item.setAttribute("width", item.getBoundingClientRect().width);
            //     item.setAttribute("height", item.getBoundingClientRect().height);
            //     item.style.width = null;
            //     item.style.height= null;
            // });
            const linkSource = image;
            const downloadLink = document.createElement("a");
            downloadLink.href = linkSource;
            let today = new Date();
            let niceDate = today.getFullYear() + "-" + today.getMonth() + "-" + today.getDate() + '-' + today.getHours() + "+" + today.getMinutes();
            downloadLink.download = getDonation('title') + "-" + niceDate + ".png";
            downloadLink.click();
            document.getElementById("instagramCanvasContainer").style.display = "none";
            window.location.href = 'instagram://story-camera';
        }
    };


    return (

        <div className="App">

            <div ref={ref} style={{display: "none"}} id={"instagramCanvasContainer"}>
            <div onClick={drawInstagramStory} id={"instagramCanvas"}>
                <h1>{causeData[currIndex].title}</h1>
                <img id="instagramCanvasImg" src={causeData[currIndex].image}/>



                {donationIsPresent('petition') ?
                    <React.Fragment>

                        <Button
                            className={"donationButton"}
                            variant="contained"
                            color="secondary"
                            id={"instaPetitionButton"}
                            endIcon={<img width={10} src={petition}/>}
                        >Sign a Petition </Button>
                        <br/>
                    </React.Fragment>

                    : null}

                {donationIsPresent("gofundme") ? <React.Fragment>
                   <Button
                    className={"donationButton"}
                    variant="contained"
                    color="secondary"
                    id={"instaGfmButton"}
                    endIcon={<img width={75} src={gfm}/>}
                >
                    <line style={{cursor: "pointer", stroke: "black", strokeWidth: 2}}/>
                    Donate with
                </Button> </React.Fragment> : null}



                {donationIsPresent("direct") ? <React.Fragment>
                    <br/><Button
                    className={"donationButton"}
                    variant="contained"
                    color="none"
                    color={"secondary"}
                    id={"instaDirectButton"}
                    endIcon={<WebIcon/>}
                >
                    <line style={{cursor: "pointer", stroke: "black", strokeWidth: 2}}/>
                    Donate on website
                </Button> </React.Fragment> : null}

                {donationIsPresent("venmo") ? <React.Fragment>
                    <br/>
                    <Button
                        className={"donationButton"}
                        variant="contained"
                        color="secondary"
                        id={"instaVenmoButton"}
                        endIcon={<img width={75} src={venmoIcon}/>}
                    >
                        <line style={{cursor: "pointer", stroke: "black", strokeWidth: 2}}/>
                        Donate with
                    </Button> </React.Fragment> : null}

                {donationIsPresent("cashapp") ? <React.Fragment>
                    <br/><Button
                    className={"donationButton"}
                    variant="contained"
                    color="none"
                    id={"instaCashAppButton"}
                    endIcon={<img width={75} src={cashApp}/>}
                >
                    <line style={{cursor: "pointer", stroke: "black", strokeWidth: 2}}/>
                    Donate with
                </Button> </React.Fragment> : null}

                <h3>Link in bio <br/><u>{window.location.host+ window.location.pathname}</u></h3>


                <h2  className={"instaLogo"}><span>ACTIVST</span> <img id={"instaLogoHand"} src={Hand}/></h2>

            </div>
            </div>
            <Modal
                // ref={ref}
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={"modal causeContainer"}
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
                        <ClearIcon id={"closeModal"} onClick={handleClose}/>
                        <h2 id="transition-modal-title">{causeData[currIndex].title}</h2>
                        <img src={causeData[currIndex].image} width={150} onError={(e) => {
                            e.target.onerror = null;
                            e.target.width = 0;
                            e.target.height = 0;
                        }}/>
                        <p id="transition-modal-description">
                            {nl2br(causeData[currIndex].description)}
                        </p>
                        {donationIsPresent('website') ?
                            <Button
                                className={"donationButton"}
                                // variant="contained"
                                color="primary"
                                onClick={() => {
                                    logEventOnAnalytics('CauseEngagement', {url: userHash, loggedIn: user != null});
                                    logEventOnAnalytics('LearnMore', {url: userHash, loggedIn: user != null});
                                    window.open(getDonation("website"), "_blank")
                                }}
                                id={"websiteButton"}
                                startIcon={<WebIcon/>}
                            >Learn More</Button> : ""}

                        <h6>Spread Awareness by Sharing:

                            <br/>
                            <Button
                                className={"donationButton"}
                                variant="contained"
                                color="secondary"
                                onClick={getImage}
                                id={"instaButton"}
                                startIcon={<img width={20} src={instagram}/>}
                            >Story </Button>
                        </h6>

                        {donationIsPresent('petition') ?
                            <h6>Let Your Voice Be Heard By Signing:
                                <br/>

                                <Button
                                    className={"donationButton"}
                                    variant="contained"
                                    color="secondary"
                                    id={"petitionButton"}
                                    startIcon={<img width={10} src={petition}/>}
                                    onClick={() => {
                                        logEventOnAnalytics('CauseEngagement', {url: userHash, loggedIn: user != null});
                                        logEventOnAnalytics('SignPetition', {url: userHash, loggedIn: user != null});
                                        window.open(getDonation("petition"), "_blank")
                                    }
                                    }
                                >Petition </Button>
                            </h6>
                            : null}

                        <h6>{anyDonationIsPresent() ? "Donate!" : ""}

                            {donationIsPresent("venmo") ? <React.Fragment>
                                <br/>
                                <Button
                                    className={"donationButton"}
                                    variant="contained"
                                    color="secondary"
                                    id={"venmoButton"}
                                    onClick={() => {
                                        logEventOnAnalytics('CauseEngagement', {url: userHash, loggedIn: user != null});
                                        logEventOnAnalytics('Venmo', {url: userHash, loggedIn: user != null});
                                        logEventOnAnalytics('Donate', {url: userHash, loggedIn: user != null});
                                        window.open("https://venmo.com/" + getDonation("venmo"), "_blank")
                                    }
                                    }
                                    endIcon={<img width={75} src={venmoIcon}/>}
                                >
                                    <line style={{cursor: "pointer", stroke: "black", strokeWidth: 2}}/>
                                    Donate with
                                </Button> </React.Fragment> : null}

                            {donationIsPresent("gofundme") ? <React.Fragment>
                                <br/> <Button
                                className={"donationButton"}
                                variant="contained"
                                color="secondary"
                                id={"gfmButton"}
                                onClick={() => {
                                    logEventOnAnalytics('CauseEngagement', {url: userHash, loggedIn: user != null});
                                    logEventOnAnalytics('Gofundme', {url: userHash, loggedIn: user != null});
                                    logEventOnAnalytics('Donate', {url: userHash, loggedIn: user != null});
                                    window.open(getDonation("gofundme"), "_blank")
                                }
                                }
                                endIcon={<img width={75} src={gfm}/>}
                            >
                                <line style={{cursor: "pointer", stroke: "black", strokeWidth: 2}}/>
                                Donate with
                            </Button> </React.Fragment> : null}

                            {donationIsPresent("cashapp") ? <React.Fragment>
                                <br/><Button
                                className={"donationButton"}
                                variant="contained"
                                color="none"
                                id={"cashAppButton"}
                                onClick={() => {
                                    logEventOnAnalytics('CauseEngagement', {url: userHash, loggedIn: user != null});
                                    logEventOnAnalytics('CashApp', {url: userHash, loggedIn: user != null});
                                    logEventOnAnalytics('Donate', {url: userHash, loggedIn: user != null});
                                    window.open("https://cash.app/$" + getDonation("cashapp"), "_blank")
                                }
                                }
                                endIcon={<img width={75} src={cashApp}/>}
                            >
                                <line style={{cursor: "pointer", stroke: "black", strokeWidth: 2}}/>
                                Donate with
                            </Button> </React.Fragment> : null}
                            {donationIsPresent("direct") ? <React.Fragment>
                                <br/><Button
                                className={"donationButton"}
                                variant="contained"
                                color="none"
                                id={"directButton"}
                                color={"secondary"}
                                onClick={() => {
                                    logEventOnAnalytics('CauseEngagement', {url: userHash, loggedIn: user != null});
                                    logEventOnAnalytics('DirectDonate-', {url: userHash, loggedIn: user != null});
                                    logEventOnAnalytics('Donate', {url: userHash, loggedIn: user != null});
                                    window.open(getDonation("direct"), "_blank")
                                }
                                }
                                endIcon={<WebIcon/>}
                            >
                                <line style={{cursor: "pointer", stroke: "black", strokeWidth: 2}}/>
                                Donate on website
                            </Button> </React.Fragment> : null}

                        </h6>

                        {userHash==="cantorarts" ?
                            <div>
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
                                    startAdornment={<InputAdornment style={{color: "white"}}
                                                                    position="start">$</InputAdornment>}
                                    inputProps={{
                                        step: 10,
                                        min: 0,
                                        max: 100,
                                        type: 'number',
                                        'aria-labelledby': 'input-slider',

                                    }}
                                />
                                <br/>
                                <GooglePayButton
                                    environment="TEST"
                                    buttonType={"donate"}
                                    buttonColor="yellow"
                                    paymentRequest={paymentRequest}
                                    onLoadPaymentData={handleLoadPaymentData}
                                />
                            </div> : null}

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
                <h1>@{userHash}'s Causes   <CopyToClipboard text={window.location.href}
                                                            onCopy={() => toaster.notify("Copied to clipboard", {
                                                                duration: 1000
                                                            })}>
                    <Button><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" fill="#FFFFFF"/></svg>
                    </Button>
                </CopyToClipboard></h1>

                <Grid item xs={12}>
                    <Grid container justify="center" spacing={0}>
                        {showCauses ? causeData.map((data, index) => (
                            <Grid key={index} item>
                                <Cause title={data.title} picture={data.image} handleOpen={handleOpen} index={index}/>
                            </Grid>
                        )) : userHash + " is currently advocating for no Causes"}
                    </Grid>
                </Grid>
                {userHash==="cantorarts" ?
                <LinearProgress className={"progressBar"} variant="determinate" value={(4000 + donation) / 9000 * 100}/>
                 : null }
                {userHash==="cantorarts" ?
                <h3>${4000 + donation} raised out of $9000 goal</h3> : null }

            </header>
        </div>
    );
}

export default App;
