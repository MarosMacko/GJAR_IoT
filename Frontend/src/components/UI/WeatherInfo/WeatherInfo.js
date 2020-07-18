import React from "react";
import { useStore } from "../../../store/store";
import { motion, AnimatePresence } from "framer-motion";
import classes from "./WeatherInfo.module.scss";
import { useLocation, matchPath } from "react-router-dom";

const WeatherInfo = () => {
    const store = useStore(true, ["ActiveWeather"])[0];
    const location = useLocation();
    return (
        <AnimatePresence>
            {store.ActiveWeather && !!matchPath(location.pathname, { path: "/room/:id" }) ? (
                <motion.div className={classes.Wrapper} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <img src={`http://openweathermap.org/img/wn/${store.ActiveWeather.weather[0].icon}@2x.png`} alt="" />
                    <h3>{`${store.ActiveWeather.main.temp}°C`}</h3>
                </motion.div>
            ) : null}
        </AnimatePresence>
    );
};

export default WeatherInfo;
