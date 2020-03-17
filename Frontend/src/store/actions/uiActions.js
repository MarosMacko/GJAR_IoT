import * as actionTypes from './actionTypes';

export const toggleNav = (isNavOpened) => {
	return {
		type: actionTypes.TOGGLE_NAV,
		isNavOpened: isNavOpened
	};
};

export const openBottomDrawerSettings = () => {
	return {
		type: actionTypes.OPEN_DRAWER_SETTINGS
	};
};

export const closeBottomDrawerSettings = () => {
	return {
		type: actionTypes.CLOSE_DRAWER_SETTINGS
	};
};
