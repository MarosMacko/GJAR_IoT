import React, { memo } from "react";
import classes from "./NavBar.module.scss";
import HamburgerButton from "../UI/HamburgerButton/HamburgerButton";
import Logo from "../UI/Logo/Logo";
import SettingsButton from "../UI/SettingsButton/SettingsButton";
import WeatherInfo from "../UI/WeatherInfo/WeatherInfo";

const NavBar = ({ openSidebar }) => {
    return (
        <div className={classes.Wrapper}>
            <div className={classes.LeftSide}>
                <HamburgerButton toggle={openSidebar} style={{ marginLeft: 10 }} />
                <Logo style={{ marginLeft: 10 }} />
            </div>
            <div className={classes.Weather}>
                <WeatherInfo />
            </div>
            <div className={classes.RightSide}>
                <SettingsButton />
            </div>
        </div>
    );
};

export default memo(NavBar);
