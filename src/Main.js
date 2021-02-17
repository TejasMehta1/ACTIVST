import React, { Component } from "react";
import {
    Route,
    NavLink,
    HashRouter
} from "react-router-dom";
import App from "./App";
import Login from "./Login"
import UserProvider from "./providers/UserProvider";
import Signup from "./Signup";
class Main extends Component {
    render() {
        return (
            <UserProvider>
            <HashRouter>
            <div>
                {/*<h1>Simple SPA</h1>*/}
                {/*<ul className="header">*/}
                {/*    <li><NavLink to="/app">Home</NavLink></li>*/}
                {/*</ul>*/}
                <div className="content">
                    <Route exact path="/" component={Login}></Route>
                    <Route path="/app" component={App}/>
                    <Route path="/signup" component={Signup}/>
                    <Route path="/admin/:userHash" component={App}/>
                </div>
            </div>
            </HashRouter>
            </UserProvider>
        );
    }
}

export default Main;
