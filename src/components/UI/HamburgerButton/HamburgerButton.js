import React, { memo } from "react";
import { motion } from "framer-motion";
import classes from "./HamburgerButton.module.scss";

const Path = (props) => <motion.path fill="transparent" strokeWidth="3" stroke={props.color} strokeLinecap="round" {...props} />;

const HamburgerButton = ({ toggle, style, open, color }) => (
    <button style={{ ...style }} className={classes.Button} onClick={toggle}>
        <svg width="23" height="23" viewBox="0 0 23 23">
            <Path color={color ? color : "#fff"} d={open ? "M 3 16.5 L 17 2.5" : "M 2 2.5 L 20 2.5"} />
            <Path
                color={color ? color : "#fff"}
                style={open ? { opacity: 0 } : null}
                d="M 2 9.423 L 20 9.423"
                transition={{ duration: 0.1 }}
            />
            <Path color={color ? color : "#fff"} d={open ? "M 3 2.5 L 17 16.346" : "M 2 16.346 L 20 16.346"} />
        </svg>
    </button>
);

export default memo(HamburgerButton);
