import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import { useDispatch, useSelector } from 'react-redux';
import { closeBottomDrawerSettings } from '../../store/actions/index';

const BottomDrawerSettings = () => {
	const dispatch = useDispatch();
	const isBottomSettingsOpened = useSelector((state) => state.ui.isBottomSettingsOpened);

	return (
		<Drawer anchor="bottom" open={isBottomSettingsOpened} onClose={() => dispatch(closeBottomDrawerSettings())}>
			{/*setting eg. calendar*/}
			askdfjksdjf Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptates aperiam ipsum nam dolor
			quas provident, temporibus reprehenderit doloribus mollitia. Amet exercitationem hic veritatis, ea
			voluptatem neque quas quaerat accusamus nobis.
		</Drawer>
	);
};

export default BottomDrawerSettings;
