import React, { useEffect } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';

const Layout = () => {
	const dispatch = useDispatch();
	const isNavOpened = useSelector((state) => state.ui.isNavOpened);
	const activeRoomNumber = useSelector((state) => state.room.activeRoomNumber);
	const serverError = useSelector((state) => state.data.serverError);
	const render = useSelector((state) => state.data.render);
	const errMessage = useSelector((state) => state.data.errMessage);

	useEffect(
		() => {
			dispatch(changeActiveRoom(29, 'Študovňa (29)'));
			dispatch(contactServer(29, 3));
		},
		[ dispatch ]
	);

	const changeActiveRoomHandler = (roomName, roomNumber) => {
		if (activeRoomNumber !== roomNumber || activeRoomNumber === null) {
			dispatch(changeActiveRoom(roomNumber, roomName));
			if (isNavOpened === true) {
				dispatch(toggleNav(isNavOpened));
			}
			dispatch(contactServer(roomNumber, 3));
		}
	};

	const aboutProjectClickHandler = () => {
		dispatch(changeActiveRoom(null, 'O projekte'));
		dispatch(clearActiveValues());
		if (isNavOpened) {
			dispatch(toggleNav(isNavOpened));
		}
	};

	let content;
	if (serverError) {
		content = <ErrorDiv errMessage={errMessage} />;
	} else if (!serverError && !render) {
		content = <Loader />;
	} else if (render) {
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

export default Layout;
