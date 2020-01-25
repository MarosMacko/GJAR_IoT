import * as actionTypes from './actionTypes';

export const changeActiveRoom = (roomNumber, roomName) => {
	return {
		type: actionTypes.CHANGE_ACTIVE_ROOM,
		roomNumber: roomNumber,
		roomName: roomName
	};
};
