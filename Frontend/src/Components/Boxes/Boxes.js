import React from 'react';
import Box from './Box/Box';
import classes from './Boxes.module.css';
import { useSelector } from 'react-redux';

const Boxes = (props) => {
	const values = useSelector((state) => state.data.values);

	return (
		<div className={classes.Boxes}>
			<Box type="temperature" value={values.temperature[values.temperature.length - 1]} />
			<Box type="humidity" value={values.humidity[values.humidity.length - 1]} />
			<Box type="brightness" value={values.brightness[values.brightness.length - 1]} />
		</div>
	);
};

export default Boxes;
