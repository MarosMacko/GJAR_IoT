import React, { useEffect } from 'react';
import classes from './Layout.module.css';
import Navbar from '../../Components/Navbar/Navbar';
import SideDrawer from '../../Components/SideDrawer/SideDrawer';
import Backdrop from '../../Components/UI/Backdrop/Backdrop';
import DesktopSideDrawer from '../../Components/DesktopSideDrawer/DesktopSideDrawer';
import MainPage from '../../Components/MainPage/MainPage';
import Loader from '../../Components/UI/Loader/Loader';
import { Route } from 'react-router-dom';
import AboutUsPage from '../../Components/AboutUsPage/AboutUsPage';
import {
	contactServer,
	changeActiveRoom,
	toggleNav,
	clearActiveValues,
	changeActiveDate,
	clearError
} from '../../store/actions/index';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

const Layout = () => {
	const dispatch = useDispatch();
	const isNavOpened = useSelector((state) => state.ui.isNavOpened);
	const activeRoomNumber = useSelector((state) => state.room.activeRoomNumber);
	const serverError = useSelector((state) => state.data.serverError);
	const render = useSelector((state) => state.data.render);
	const errMessage = useSelector((state) => state.data.errMessage);
	const activeDate = useSelector((state) => state.data.activeDate);
	const selectedInterval = useSelector((state) => state.data.selectedInterval);

	useEffect(
		() => {
			dispatch(changeActiveRoom(29, 'Študovňa (29)'));
			dispatch(contactServer(29, 3));
			dispatch(changeActiveDate(moment()));
		},
		[ dispatch ]
	);

	const changeActiveRoomHandler = (roomName, roomNumber) => {
		if (activeRoomNumber !== roomNumber || activeRoomNumber === null) {
			dispatch(changeActiveRoom(roomNumber, roomName));
			if (isNavOpened === true) {
				dispatch(toggleNav(isNavOpened));
			}
			dispatch(contactServer(roomNumber, selectedInterval, activeDate));
		}
	};

	const aboutProjectClickHandler = () => {
		dispatch(changeActiveRoom(null, 'O projekte'));
		dispatch(clearActiveValues());
		if (isNavOpened) {
			dispatch(toggleNav(isNavOpened));
		}
	};

	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}

		dispatch(clearError());
	};

	let content;
	if (!render) {
		content = <Loader />;
	} else {
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
			<Snackbar open={serverError} autoHideDuration={6000} onClose={handleClose}>
				<MuiAlert elevation={6} variant="filled" onClose={handleClose} severity="error">
					{errMessage}
				</MuiAlert>
			</Snackbar>
		</React.Fragment>
	);
};

export default Layout;
