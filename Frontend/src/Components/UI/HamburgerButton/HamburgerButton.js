import React from 'react';
import classes from './HamburgerButton.module.css';

const hamburgerButton = (props) => {
    const isActive = props.active ? classes.isactive : null;

    return (
        <div className={[classes.hamburger, classes.hamburgersqueeze, isActive].join(" ")} onClick={props.click}>
            <div className={classes.hamburgerbox}>
                <div className={classes.hamburgerinner}></div>
            </div>
        </div>
    )
};

export default hamburgerButton;