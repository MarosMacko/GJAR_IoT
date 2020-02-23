import React from 'react';
import classes from './LoadingIndicator.module.css';

const loadingIndicator = () => {
	return (
		<div className={classes.ldsRing}>
			<div />
			<div />
			<div />
			<div />
		</div>
	);
};

export default loadingIndicator;
