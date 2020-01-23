import React from 'react';
import classes from './GraphSettings.module.css';

const graphSettings = (props) => {
	const onChangeHandler = (event) => {
		if (event.target.value !== props.selectedInterval) {
			props.select(event.target.value);
		}
	};

	return (
		<div className={classes.Wrapper}>
			<p className={classes.Text}>Zobraz dáta za posledných:</p>
			<select className={classes.Select} onChange={onChangeHandler}>
				<option className={classes.Item} value="1">
					1 hodina
				</option>
				<option className={classes.Item} value="6">
					6 hodín
				</option>
				<option className={classes.Item} value="24">
					24 hodín
				</option>
			</select>
		</div>
	);
};

export default graphSettings;
