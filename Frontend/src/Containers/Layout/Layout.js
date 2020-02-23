import React, { useEffect, useState } from 'react';
import classes from './Layout.module.css';
import Navbar from '../../Components/Navbar/Navbar';
import SideDrawer from '../../Components/SideDrawer/SideDrawer';
import Backdrop from '../../Components/UI/Backdrop/Backdrop';
import DesktopSideDrawer from '../../Components/DesktopSideDrawer/DesktopSideDrawer';
import MainPage from '../../Components/MainPage/MainPage';
import Loader from '../../Components/UI/Loader/Loader';
import ErrorDiv from '../../Components/ErrorDiv/ErrorDiv';
import { Route } from 'react-router-dom';
import AboutUsPage from '../../Components/AboutUsPage/AboutUsPage';
import 'moment/locale/sk';
import { contactServer, changeActiveRoom, toggleNav, clearActiveValues } from '../../store/actions/index';
import { connect } from 'react-redux';

const Layout = (props) => {
	const { changeActiveRoom, contactServer } = props;
	useEffect(
		() => {
			changeActiveRoom(29, 'Študovňa (29)');
			contactServer(29, 3);
		},
		[ changeActiveRoom, contactServer ]
	);

	const changeActiveRoomHandler = (roomName, roomNumber) => {
		if (props.activeRoomNumber !== roomNumber || props.activeRoomNumber === null) {
			props.changeActiveRoom(roomNumber, roomName);
			if (props.isNavOpened === true) {
				props.toggleNav(props.toggleNav);
			}
			props.contactServer(roomNumber, 3);
		}
	};

	const aboutProjectClickHandler = () => {
		props.changeActiveRoom(null, 'O projekte');
		props.clearActiveValues();
		if (props.isNavOpened) {
			props.toggleNav(props.isNavOpened);
		}
	};

	let content = <Loader />;
	if (props.serverError) {
		content = <ErrorDiv errMessage={props.errMessage} />;
	} else if (!props.serverError && !props.render) {
		content = <Loader />;
	} else if (props.render) {
		content = <MainPage />;
	}

	return (
		<React.Fragment>
			<nav className={classes.Navbar}>
				<Navbar />
			</nav>
			<main className={classes.Content}>
				<Route path="/" exact render={() => content} />
				<Route path="/about-project" exact component={AboutUsPage} />
			</main>
			<DesktopSideDrawer aboutProjectClick={aboutProjectClickHandler} click={changeActiveRoomHandler} />
			<SideDrawer aboutProjectClick={aboutProjectClickHandler} click={changeActiveRoomHandler} />
			<Backdrop />
		</React.Fragment>
	);
};

const mapStateToProps = (state) => {
	return {
		isNavOpened: state.ui.isNavOpened,
		activeRoomNumber: state.room.activeRoomNumber,
		serverError: state.data.serverError,
		render: state.data.render,
		errMessage: state.data.errMessage,
		isLoading: state.ui.loading,
		values: state.data.values,
		selectedInterval: state.data.selectedInterval
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		contactServer: (roomNumber, interval) => dispatch(contactServer(roomNumber, interval)),
		changeActiveRoom: (roomNumber, roomName) => dispatch(changeActiveRoom(roomNumber, roomName)),
		toggleNav: (isNavOpened) => dispatch(toggleNav(isNavOpened)),
		clearActiveValues: () => dispatch(clearActiveValues())
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
