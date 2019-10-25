import React from 'react';
import classes from './SideDrawer.module.css';
import { IoIosClose } from "react-icons/io";
import SideDrawerItems from './SideDrawerItems/SideDrawerItems';

const sideDrawer = (props) => {
    let sideDrawerClasses = props.active ? [classes.SideDrawer, classes.Active].join(" ") : classes.SideDrawer;

    return (
        <div className={sideDrawerClasses}>
            <div className={classes.CloseBtn} onClick={props.clicked}>
                <IoIosClose size={"1.7em"} value={{ style: { verticalAlign: 'middle'} }}/>
                Close
            </div>
            <SideDrawerItems aboutProjectClick={props.aboutProjectClick} click={props.click}/>
        </div>
    );
};


export default sideDrawer;