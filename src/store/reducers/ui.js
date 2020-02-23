import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
	isNavOpened: false,
	loading: false
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.TOGGLE_NAV:
			return updateObject(state, { isNavOpened: !action.isNavOpened });
		default:
			return state;
	}
};

export default reducer;
