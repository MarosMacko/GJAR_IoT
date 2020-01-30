import React from 'react';
import { Line } from 'react-chartjs-2';
import classes from './Graph.module.css';
import GraphSettings from './GraphSettings/GraphSettings';
import { connect } from 'react-redux';

const graph = (props) => {
	return (
		<div className={classes.Wrapper}>
			<div className={classes.Graph}>
				<Line
					data={{
						labels: props.values.times,
						datasets: [
							{
								label: 'Teplota',
								data: props.values.temperature,
								fill: true,
								backgroundColor: 'rgba(85, 186, 254, .3)',
								borderWidth: 4,
								borderColor: '#55D8FE'
							},
							{
								label: 'Vlhkosť',
								data: props.values.humidity,
								fill: true,
								backgroundColor: 'rgba(163, 160, 251, .3)',
								borderWidth: 4,
								borderColor: '#A3A0FB'
							},
							{
								label: 'Osvetlenie',
								data: props.values.brightness,
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
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		values: state.data.values
	};
};

export default connect(mapStateToProps)(graph);
