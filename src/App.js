import React from 'react';
import Layout from './Containers/Layout/Layout';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import dataReducer from './store/reducers/data';
import uiReducer from './store/reducers/ui';
import roomReducer from './store/reducers/room';
import thunk from 'redux-thunk';

const rootReducer = combineReducers({
	data: dataReducer,
	ui: uiReducer,
	room: roomReducer
});

const store = createStore(rootReducer, applyMiddleware(thunk));

function App() {
	return (
		<Provider store={store}>
			<BrowserRouter>
				<Layout />
			</BrowserRouter>
		</Provider>
	);
}

export default App;
