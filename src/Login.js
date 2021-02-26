import { UserContext } from './providers/UserProvider';
import React, {  useEffect, useContext, useState } from 'react';
import { signInWithGoogle } from './services/firebase';
import { Redirect, useHistory } from "react-router-dom";
import GoogleButton from "react-google-button";
import Hand from "./helping.svg";
import InstaMock from "./InstagramMock.png"
import CausesMock from "./CausesMock.png"
import CauseMock from "./CauseMock2.png"
import CauseEditMock from "./CauseEditMock2.png"
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

//Share how to make a real impact with your personal link.
function Login (){
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 2,
        autoplay: true,
        autoplaySpeed: 7000,
        responsive: [
            {
                breakpoint: 1000,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
            // You can unslick at a given breakpoint now by adding:
            // settings: "unslick"
            // instead of a settings object
        ]
    };
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
                        <p style={{marginBottom: "30px"}}>Share and enable impact with your personal link.</p>
                        <div className="login-buttons">
                                {/*<a href={"instagram://story-camera"}>Story</a>*/}
                                <GoogleButton id="googleSignIn" type="light" onClick={signInWithGoogle}/>
                        </div>
                        <br/>
                        <div style={{width: "81%"}}>
                    <Slider {...settings}>
                        {/*<video controls autoPlay>*/}
                        {/*  <source src={DropdownVideo}/>*/}
                        {/*</video>*/}
                        <div>
                            <p className={"carouselText"}>Share your ACTIVST link on your bio</p>
                            <img className={"center"} width={300} src={InstaMock}/>
                        </div>
                        <div>
                            <p className={"carouselText"}>Share causes you're most passionate about</p>
                            <img className={"center"} width={300} src={CausesMock}/>
                        </div>
                        <div>
                            <p className={"carouselText"}>Add Tangible ways to make a difference</p>
                            <img className={"center"} width={300} src={CauseEditMock}/>
                        </div>
                        <div>
                            <p className={"carouselText"}>Donate, petition, share, and engage</p>
                            <img className={"center"} width={300} src={CauseMock}/>
                        </div>
                    </Slider>
                        </div>

                    <br/>
                    <br/>

                </header>
                <div>

                </div>
            </div>
        );
}

export default Login;
