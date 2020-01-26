import React from 'react';
import Box from './Box/Box';
import classes from './Boxes.module.css';
import { connect } from 'react-redux';

const boxes = (props) => (
	<div className={classes.Boxes}>
		<Box type="temperature" value={props.values.temperature[props.values.temperature.length - 1]} />
		<Box type="humidity" value={props.values.humidity[props.values.humidity.length - 1]} />
		<Box type="brightness" value={props.values.brightness[props.values.brightness.length - 1]} />
	</div>
);

const mapStateToProps = (state) => {
	return {
		values: state.data.values
	};
};

export default connect(mapStateToProps)(boxes);
