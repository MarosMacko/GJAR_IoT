import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';
import moment from 'moment';

const initialState = {
	values: {
		temperature: [],
		humidity: [],
		brightness: [],
		times: []
	},
	render: false,
	serverError: false,
	errMessage: null,
	selectedInterval: null,
	loading: false
};

const processResponse = (state, action) => {
	if (action.response.data.data.length <= 0) {
		return updateObject(state, {
			errMessage: 'Žiadne dáta',
			serverError: true,
			render: false
		});
	}

	const temp = [];
	const hum = [];
	const brig = [];
	const tim = [];

	const reduceBy = action.response.data.data.length / (action.response.data.data.length / action.interval);

	for (let i = action.response.data.data.length - 1; i > 0; i -= reduceBy) {
		const time = moment(action.response.data.data[i].time).format('HH:mm DD/MM');

		temp.unshift(parseFloat(action.response.data.data[i].temperature).toFixed(2));
		hum.unshift(parseFloat(action.response.data.data[i].humidity).toFixed(2));
		brig.unshift(parseFloat(action.response.data.data[i].brightness).toFixed(2));
		tim.unshift(time);
	}

	return updateObject(state, {
		values: {
			temperature: temp,
			humidity: hum,
			brightness: brig,
			times: tim
		},
		render: true,
		serverError: false,
		errMessage: null,
		selectedInterval: action.interval,
		loading: false
	});
};

const throwError = (state, action) => {
	return updateObject(state, {
		serverError: true,
		errMessage: action.error,
		render: false,
		loading: false
	});
};

const contactServerStart = (state, action) => {
	return updateObject(state, { loading: true });
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.CONTACT_SERVER_START:
			return contactServerStart(state, action);
		case actionTypes.CONTACT_SERVER_SUCCESS:
			return processResponse(state, action);
		case actionTypes.CONTACT_SERVER_FAIL:
			return throwError(state, action);
		case actionTypes.CLEAR_ACTIVE_VALUES:
			return updateObject(state, {
				values: {
					temperature: [],
					humidity: [],
					brightness: [],
					times: []
				},
				render: false
			});
		default:
			return state;
	}
};

export default reducer;
