import React, { memo } from "react";
import classes from "./ActiveValueBox.module.scss";

const ActiveValueBox = ({ icon, title, value, color }) => {
    const Icon = icon;
    return (
        <div className={classes.Wrapper}>
            <div style={{ backgroundColor: color }} className={classes.IconWrapper}>
                <Icon size={25} />
            </div>
            <div className={classes.TextWrapper}>
                <p>{title}</p>
                <p>{value}</p>
            </div>
        </div>
    );
};

export default memo(ActiveValueBox);
