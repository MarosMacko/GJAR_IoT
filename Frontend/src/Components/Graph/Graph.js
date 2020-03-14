import React from 'react';
import { Line } from 'react-chartjs-2';
import classes from './Graph.module.css';
import GraphSettings from './GraphSettings/GraphSettings';
import { useSelector, useDispatch } from 'react-redux';
import { openBottomDrawerSettings } from '../../store/actions/index';

const Graph = (props) => {
	const dispatch = useDispatch();
	const values = useSelector((state) => state.data.values);

	return (
		<div className={classes.Wrapper}>
			<div className={classes.Graph}>
				<Line
					data={{
						labels: values.times,
						datasets: [
							{
								label: 'Teplota',
								data: values.temperature,
								fill: true,
								backgroundColor: 'rgba(85, 186, 254, .3)',
								borderWidth: 4,
								borderColor: '#55D8FE'
							},
							{
								label: 'Vlhkosť',
								data: values.humidity,
								fill: true,
								backgroundColor: 'rgba(163, 160, 251, .3)',
								borderWidth: 4,
								borderColor: '#A3A0FB'
							},
							{
								label: 'Osvetlenie',
								data: values.brightness,
								fill: true,
								backgroundColor: 'rgba(94, 226, 160, .3)',
								borderWidth: 4,
								borderColor: '#5EE2A0'
							}
						]
					}}
					options={{
						responsive: true,
						maintainAspectRatio: false,
						legend: { position: 'bottom' },
						tooltips: {
							mode: 'index',
							intersect: false
						},
						hover: {
							mode: 'index',
							intersect: false
						}
					}}
				/>
			</div>
			<GraphSettings />
			<button onClick={() => dispatch(openBottomDrawerSettings())}>asdfasdf</button>
		</div>
	);
};

export default Graph;
