import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import { useDispatch, useSelector } from 'react-redux';
import { closeBottomDrawerSettings } from '../../store/actions/index';

const BottomDrawerSettings = () => {
	const dispatch = useDispatch();
	const isBottomSettingsOpened = useSelector((state) => state.ui.isBottomSettingsOpened);

	return (
		<Drawer anchor="bottom" open={isBottomSettingsOpened} onClose={() => dispatch(closeBottomDrawerSettings())}>
			{/*setting (download options etc.) calendar !!! not implemented yet*/}
		</Drawer>
	);
};

export default BottomDrawerSettings;
