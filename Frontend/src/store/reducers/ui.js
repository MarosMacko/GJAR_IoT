import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
	isNavOpened: false,
	loading: false,
	isBottomSettingsOpened: false
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.TOGGLE_NAV:
			return updateObject(state, { isNavOpened: !action.isNavOpened });
		case actionTypes.OPEN_DRAWER_SETTINGS:
			return updateObject(state, { isBottomSettingsOpened: true });
		case actionTypes.CLOSE_DRAWER_SETTINGS:
			return updateObject(state, { isBottomSettingsOpened: false });
		default:
			return state;
	}
};

export default reducer;
