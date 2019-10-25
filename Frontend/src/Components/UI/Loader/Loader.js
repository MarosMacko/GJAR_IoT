import React from 'react';
import classes from './Loader.module.css'

const loader = () => (
    <div className={classes.spinner}>
        <div className={classes.cube1}></div>
        <div className={classes.cube2}></div>
    </div>
)

export default loader;