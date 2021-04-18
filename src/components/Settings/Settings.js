import React from "react";
import SideBar from "../../hoc/SideBar/SideBar";
import useResponsiveDesign from "../../hooks/useResponsiveDesign";
import classes from "./Settings.module.scss";
import Slider from "../UI/Slider/Slider";
import CustomTimePicker from "../UI/TimePicker/CustomTimePicker";
import CustomDatePicker from "../UI/DatePicker/CustomDatePicker";
import { useStore } from "../../store/store";
import Button from "../UI/Button/Button";
import { useLocation, matchPath } from "react-router-dom";
import moment from "moment";

export default function Settings() {
    const [store, dispatch] = useStore(true, ["settingsSidebarOpen", "downloadDrawerOpen", "activeDate", "interval"]);
    const { shouldDisplay, locationOnRoom } = useResponsiveDesign();
    const { pathname } = useLocation();

    console.log(
        matchPath(pathname, {
            path: "/room/:id",
        })
    );

    return (
        <SideBar position="right" black isVisible={(shouldDisplay && locationOnRoom) || store.settingsSidebarOpen}>
            <h1 className={classes.Header}>Nastavenia</h1>
            <Slider defaultvalue={12} change={(newValue) => dispatch("SET_INTERVAL", newValue)} />
            <CustomTimePicker />
            <CustomDatePicker />
            <div className={classes.ButtonWrapper}>
                <a
                    href={`https://iot.gjar-po.sk/api/export/${
                        matchPath(pathname, {
                            path: "/room/:id",
                        }).params.id
                    }/${moment(store.activeDate).format("YYYY-MM-DD")}`}
                >
                    <Button className="full-width">Stiahni dáta zo dňa {moment(store.activeDate).format("DD. MMMM")}</Button>
                </a>
            </div>
            <div className={classes.ButtonWrapper}>
                <a
                    href={`https://iot.gjar-po.sk/api/export/${
                        matchPath(pathname, {
                            path: "/room/:id",
                        }).params.id
                    }`}
                >
                    <Button className="full-width">
                        Stiahni všetky dáta z miestnosti
                        {
                            matchPath(pathname, {
                                path: "/room/:id",
                            }).params.id
                        }
                    </Button>
                </a>
            </div>
        </SideBar>
    );
}
