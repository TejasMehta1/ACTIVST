import React, { Component } from "react";
import {
    Route,
    NavLink,
    HashRouter,
    BrowserRouter,
    Switch,
} from "react-router-dom";
import App from "./App";
import Login from "./Login"
import UserProvider from "./providers/UserProvider";
import Signup from "./Signup";
import Admin from "./Admin";
class Main extends Component {
    render() {
        return (
            <UserProvider>
            <BrowserRouter>
            <div>
                {/*<h1>Simple SPA</h1>*/}
                {/*<ul className="header">*/}
                {/*    <li><NavLink to="/app">Home</NavLink></li>*/}
                {/*</ul>*/}
                <div className="content">
                    <Switch>
                        <Route path="/signup" component={Signup}/>
                        <Route path="/admin" component={Admin}/>
                        <Route exact path="/" component={Login}></Route>
                        <Route exact path="/:userHash" component={App}/>
                    </Switch>
                </div>
            </div>
            </BrowserRouter>
            </UserProvider>
        );
    }
}

export default Main;
