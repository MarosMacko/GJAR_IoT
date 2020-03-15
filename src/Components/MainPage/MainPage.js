import React from 'react';
import Boxes from '../Boxes/Boxes';
import Graph from '../Graph/Graph';
import classes from './MainPage.module.css';
//import BottomDrawerSettings from '../BottomDrawerSettings/BottomDrawerSettings';

const mainPage = (props) => (
	<div className={classes.MainPage}>
		<Boxes />
		<Graph />
	</div>
);

export default mainPage;
