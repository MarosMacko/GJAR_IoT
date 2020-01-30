import React from 'react';
import classes from './GraphSettings.module.css';
import { connect } from 'react-redux';
import { contactServer } from '../../../store/actions/index';

const graphSettings = (props) => {
	const onChangeHandler = (event) => {
		if (event.target.value !== props.selectedInterval) {
			props.contactServer(props.activeRoomNumber, event.target.value);
		}
	};

	return (
		<div className={classes.Wrapper}>
			<p className={classes.Text}>Zobraz dáta za posledných:</p>
			<select value={props.selectedInterval} className={classes.Select} onChange={onChangeHandler}>
				<option className={classes.Item} value="3">
					3 hodiny
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

const mapStateToProps = (state) => {
	return {
		activeRoomNumber: state.room.activeRoomNumber,
		selectedInterval: state.data.selectedInterval
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		contactServer: (roomNumber, inteval) => dispatch(contactServer(roomNumber, inteval))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(graphSettings);
