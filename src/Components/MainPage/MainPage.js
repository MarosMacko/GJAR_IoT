import React from 'react';
import Boxes from '../Boxes/Boxes';
import Graph from '../Graph/Graph';
import classes from './MainPage.module.css';

const mainPage = (props) => (
	<div className={classes.MainPage}>
		<Boxes
			temperature={props.values.temperature[props.values.temperature.length - 1]}
			humidity={props.values.humidity[props.values.humidity.length - 1]}
			brightness={props.values.brightness[props.values.brightness.length - 1]}
		/>
		<Graph
			selectedInterval={props.selectedInterval}
			select={props.select}
			temperature={props.values.temperature}
			humidity={props.values.humidity}
			brightness={props.values.brightness}
			time={props.values.times}
		/>
	</div>
);

export default mainPage;
