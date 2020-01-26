import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
	activeRoom: null,
	activeRoomNumber: null
};

const changeActiveRoom = (state, action) => {
	return updateObject(state, {
		activeRoom: action.roomName,
		activeRoomNumber: action.roomNumber
	});
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.CHANGE_ACTIVE_ROOM:
			return changeActiveRoom(state, action);
		default:
			return state;
	}
};

export default reducer;
