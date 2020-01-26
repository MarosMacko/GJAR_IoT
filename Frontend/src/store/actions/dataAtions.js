import * as actionTypes from './actionTypes';
import axios from '../../axios-call';
import moment from 'moment';

const contactServerSuccess = (response, interval) => {
	return {
		type: actionTypes.CONTACT_SERVER_SUCCESS,
		response: response,
		interval: interval
	};
};

const contactServerFail = (error) => {
	return {
		type: actionTypes.CONTACT_SERVER_FAIL,
		error: error
	};
};

export const contactServer = (roomNumber, interval) => {
	return (dispatch) => {
		const beforeTimeHours = moment().subtract(interval, 'hours');

		const times = {
			timeTo: moment().format('YYYY-MM-DD'),
			timeFrom: moment(beforeTimeHours).format('YYYY-MM-DD'),
			beforeTimeHours: beforeTimeHours,
			todayHours: moment().format('LTS')
		};

		const parseData = {
			room: roomNumber,
			time: {
				'time-from': `${times.timeFrom} ${moment(times.beforeTimeHours).format('LTS')}`,
				'time-to': `${times.timeTo} ${times.todayHours}`
			}
		};

		axios({
			method: 'POST',
			data: parseData,
			url: 'api/v1/view',
			headers: { 'content-type': 'application/json', 'cache-control': 'no-cache' }
		})
			.then((response) => {
				dispatch(contactServerSuccess(response, interval));
			})
			.catch((error) => {
				dispatch(contactServerFail(error.message));
			});
	};
};
