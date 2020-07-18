import React, { memo } from "react";
import classes from "./Logo.module.scss";

const Logo = ({ style }) => {
    return (
        <div className={classes.Logo} style={{ ...style }}>
            <span>GJAR</span>
            <span>iot</span>
        </div>
    );
};

export default memo(Logo);
