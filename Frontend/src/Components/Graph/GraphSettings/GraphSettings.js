import React from 'react';
import classes from './GraphSettings.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { contactServer } from '../../../store/actions/index';
import Spinner from '../../UI/LoadingIndicator/LoadingIndicator';

const GraphSettings = () => {
	const dispatch = useDispatch();
	const activeRoomNumber = useSelector((state) => state.room.activeRoomNumber);
	const selectedInterval = useSelector((state) => state.data.selectedInterval);
	const loading = useSelector((state) => state.data.loading);
	const activeDate = useSelector((state) => state.data.activeDate);

	const onChangeHandler = (event) => {
		if (event.target.value !== selectedInterval) {
			dispatch(contactServer(activeRoomNumber, event.target.value, activeDate));
		}
	};

	return (
		<div className={classes.Wrapper}>
			<div className={classes.SelectorWrapper}>
				<p className={classes.Text}>Zobraz dáta za posledných:</p>
				<select value={selectedInterval} className={classes.Select} onChange={onChangeHandler}>
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
			<div className={classes.LoaderWrapper}>{loading ? <Spinner /> : null}</div>
		</div>
	);
};

export default GraphSettings;
