import React from "react";
import SideBar from "../../hoc/SideBar/SideBar";
import useResponsiveDesign from "../../hooks/useResponsiveDesign";
import classes from "./Settings.module.scss";
import Slider from "../UI/Slider/Slider";
import CustomTimePicker from "../UI/TimePicker/CustomTimePicker";
import CustomDatePicker from "../UI/DatePicker/CustomDatePicker";
import { useStore } from "../../store/store";

export default function Settings() {
    const [store, dispatch] = useStore(true, ["settingsSidebarOpen"]);
    const { shouldDisplay, locationOnRoom } = useResponsiveDesign();

    return (
        <SideBar position="right" black isVisible={(shouldDisplay && locationOnRoom) || store.settingsSidebarOpen}>
            <h1 className={classes.Header}>Nastavenia</h1>
            <Slider defaultvalue={12} change={(newValue) => dispatch("SET_INTERVAL", newValue)} />
            <CustomTimePicker />
            <CustomDatePicker />
        </SideBar>
    );
}
