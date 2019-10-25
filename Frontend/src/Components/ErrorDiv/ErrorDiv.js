import React from 'react';
import classes from './ErrorDiv.module.css';

const errorDiv = (props) => {
    return (
        <div className={classes.errDiv}>
            <p>
                {props.errMessage}
            </p>
        </div>
    )
}

export default errorDiv;
