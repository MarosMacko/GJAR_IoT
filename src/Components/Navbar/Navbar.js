import React from 'react';
import HamburgerButton from '../UI/HamburgerButton/HamburgerButton';
import classes from './Navbar.module.css';

const navbar = (props) => (
    <React.Fragment>
        <div className={classes.GjarIot}>GJAR IOT</div>
        <p className={classes.Activeroom}>{props.title}</p>
        <div className={classes.HamburgerButton}>
            <HamburgerButton click={props.click} active={props.active}/>
        </div>
    </React.Fragment>
)

export default navbar;