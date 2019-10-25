import React from 'react';
import classes from './DesktopSideDrawer.module.css';
import SideDrawerItems from '../SideDrawer/SideDrawerItems/SideDrawerItems';

const desktopSideDrawer = (props) => {
    return (
        <div className={classes.DesktopSideDrawer}>
            <SideDrawerItems aboutProjectClick={props.aboutProjectClick} styling={classes} click={props.click}/>
        </div>
    )
}

export default desktopSideDrawer;