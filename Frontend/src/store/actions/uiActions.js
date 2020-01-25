import * as actionTypes from './actionTypes';

export const toggleNav = (isNavOpened) => {
	return {
		type: actionTypes.TOGGLE_NAV,
		isNavOpened: isNavOpened
	};
};
