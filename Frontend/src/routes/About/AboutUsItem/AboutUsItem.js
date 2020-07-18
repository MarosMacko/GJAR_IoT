import React from "react";
import classes from "./AboutUsItem.module.scss";

const AboutUsItem = ({ name, text, role }) => {
    return (
        <div className={classes.Wrapper}>
            <span>{role}</span>
            <h2>{name}</h2>
            <p>{text}</p>
        </div>
    );
};

export default AboutUsItem;
