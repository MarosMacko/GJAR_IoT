import React, { useEffect } from "react";
import "./App.scss";
import { BrowserRouter, Redirect } from "react-router-dom";
import Main from "./routes/Main/Main";
import About from "./routes/About/About";
import NavBar from "./components/NavBar/NavBar";
import ItemsSideBar from "./components/ItemsSideDrawer/ItemsSideDrawer";
import Backdrop from "./components/UI/Backdrop/Backdrop";
import Settings from "./components/Settings/Settings";
import { useStore } from "./store/store";
import RouteTransition from "./hoc/RouterTransitions/RouteTransition";
import AnimatedRoutes from "./hoc/RouterTransitions/AnimatedRoutes";
import { getActiveWeather } from "./utils/fetchData";
import useWindowDimensions from "./hooks/useWindowDimensions";

function App() {
    const [store, dispatch] = useStore(true, ["sidebarOpen", "settingsSidebarOpen"]);
    const { width } = useWindowDimensions();

    useEffect(() => {
        getActiveWeather().then((weather) => {
            dispatch("SET_ACTIVE_WEATHER", weather);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <BrowserRouter>
            <div className="App">
                <ItemsSideBar />
                <NavBar openSidebar={() => dispatch("OPEN_SIDEBAR")} />
                <AnimatedRoutes exitBeforeEnter initial={false}>
                    <RouteTransition path="/" exact={true} slideUp={0}>
                        <Redirect exact from="/" to="/room/29" />
                    </RouteTransition>
                    <RouteTransition path="/about" exact={true} slideUp={0}>
                        <About />
                    </RouteTransition>
                    <RouteTransition path="/room/:id" exact={true} slideUp={0}>
                        <Main />
                    </RouteTransition>
                    <RouteTransition path="*" slideUp={0}>
                        <h1>404 page</h1>
                    </RouteTransition>
                </AnimatedRoutes>
                <Settings />
                <Backdrop isVisible={store.sidebarOpen || (store.settingsSidebarOpen && width < 1000)} />
            </div>
        </BrowserRouter>
    );
}

export default App;
