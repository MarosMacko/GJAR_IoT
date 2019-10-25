import React from 'react';
import Box from './Box/Box';
import classes from './Boxes.module.css';

const boxes = (props) => (
    <div className={classes.Boxes}>
        <Box type="temperature" value={props.temperature}/>
        <Box type="humidity" value={props.humidity}/>
        <Box type="brightness" value={props.brightness}/>
    </div>
)

export default boxes;