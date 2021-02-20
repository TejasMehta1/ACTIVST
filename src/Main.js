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
import Nav from "./Nav"
import NotFound from "./NotFound";
import {MuiThemeProvider, createMuiTheme} from "@material-ui/core/styles";

class Main extends Component {

    render() {
        const themeObject = {
            palette: {
                primary: { main: "#3f51b5"},
                secondary: {main: "#f50057"},
                type: "dark",
                tertiary: "#0A2640",
                logo: "#01D3FE",
                border: "#7fffd4"
            },
            themeName: "ActivstTheme",
            typography: {
                fontFamily : 'sans-serif'
            }
        };

        const themeConfig = createMuiTheme(themeObject);
        return (
            <UserProvider>
                <MuiThemeProvider theme={themeConfig}>
            <BrowserRouter>
            <div>
                {/*<h1>Simple SPA</h1>*/}
                {/*<ul className="header">*/}
                {/*    <li><NavLink to="/app">Home</NavLink></li>*/}
                {/*</ul>*/}
                <Nav/>
                <div className="content">
                    <Switch>
                        <Route path="/signup" component={Signup}/>
                        <Route path="/admin" component={Admin}/>
                        <Route path="/notfound" component={NotFound}/>
                        <Route exact path="/" component={Login}></Route>
                        <Route exact path="/:userHash" component={App}/>
                    </Switch>
                </div>
            </div>
            </BrowserRouter>
                </MuiThemeProvider>
            </UserProvider>
        );
    }
}

export default Main;
