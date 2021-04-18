import React from "react";
import { Link } from "react-router-dom";
import classes from "./Button.module.scss";

const Button = ({ path, children, onClick, className }) => {
    const component = (
        <button onClick={onClick} className={[classes.Button, className && classes[className]].join(" ")}>
            {children}
        </button>
    );

    if (path) {
        return <Link to={path}>{component}</Link>;
    }

    return <>{component}</>;
};

export default Button;
