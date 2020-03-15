import React from 'react';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { useDispatch, useSelector } from 'react-redux';
import { changeActiveDate, contactServer } from '../../../store/actions/index';
import MomentUtils from '@date-io/moment';
import classes from './GraphDate.module.css';
import moment from 'moment';

const GraphDate = () => {
	const dispatch = useDispatch();
	const activeDate = useSelector((state) => state.data.activeDate);
	const roomNumber = useSelector((state) => state.room.activeRoomNumber);
	const selectedInterval = useSelector((state) => state.data.selectedInterval);

	const handleDateChange = (date) => {
		dispatch(changeActiveDate(date));
		dispatch(contactServer(roomNumber, selectedInterval, moment(date)));
	};

	return (
		<MuiPickersUtilsProvider utils={MomentUtils}>
			<KeyboardDatePicker
				minDate={moment('2020-01-23')}
				maxDate={moment()}
				className={classes.GraphDate}
				disableToolbar
				variant="inline"
				format="MM/DD/YYYY"
				margin="normal"
				id="date-picker-inline"
				label="Dátum:"
				value={activeDate}
				onChange={handleDateChange}
				KeyboardButtonProps={{
					'aria-label': 'change date'
				}}
			/>
		</MuiPickersUtilsProvider>
	);
};

export default GraphDate;
