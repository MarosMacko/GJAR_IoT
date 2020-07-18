import React, { useState, useEffect, memo } from "react";
import Slider from "@material-ui/core/Slider";
import { withStyles } from "@material-ui/core/styles";
import colors from "../../../constants/colors.scss";
import classes from "./Slider.module.scss";

const CustomizedStyleSlider = withStyles({
    root: {
        color: colors.customBlue,
        height: 8,
    },
    thumb: {
        height: 24,
        width: 24,
        backgroundColor: colors.secondaryWhite,
        border: "2px solid currentColor",
        marginTop: -8,
        marginLeft: -12,
        "&:focus, &:hover, &$active": {
            boxShadow: "inherit",
        },
    },
    active: {},
    valueLabel: {
        left: "calc(-50% + 4px)",
    },
    track: {
        height: 8,
        borderRadius: 4,
    },
    rail: {
        height: 8,
        borderRadius: 4,
    },
})(Slider);

const CustomSlider = ({ change, defaultvalue }) => {
    const [newInterval, setNewInterval] = useState(defaultvalue);

    useEffect(() => {
        const timeout = setTimeout(() => {
            change(newInterval);
        }, 500);
        return () => {
            clearTimeout(timeout);
        };
    }, [newInterval, change]);

    return (
        <div className={classes.SliderWrapper}>
            <div>
                Interval: <span>{newInterval}</span> hod
            </div>
            <CustomizedStyleSlider
                onChange={(event, newValue) => setNewInterval(newValue)}
                aria-labelledby="discrete-slider"
                valueLabelDisplay="auto"
                step={1}
                min={1}
                max={24}
                value={newInterval}
            />
        </div>
    );
};

export default memo(CustomSlider);
