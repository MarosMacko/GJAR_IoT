import React, { Component } from 'react';
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
import { contactServer, changeActiveRoom, toggleNav } from '../../store/actions/index';
import { connect } from 'react-redux';

class Layout extends Component {
	componentDidMount() {
		this.props.changeActiveRoom(29, 'Študovňa (29)');
		this.props.contactServer(29, 3);
	}

	changeActiveRoomHandler = (roomName, roomNumber) => {
		if (this.props.activeRoomNumber !== roomNumber || this.props.activeRoomNumber === null) {
			this.props.changeActiveRoom(roomNumber, roomName);
			if (this.props.isNavOpened === true) {
				this.props.toggleNav(this.props.toggleNav);
			}
			this.props.contactServer(roomNumber, 3);
		}
	};

	setSelectedInterval = (interval) => {
		this.props.contactServer(this.props.activeRoomNumber, interval);
	};

	aboutProjectClickHandler = () => {
		this.props.changeActiveRoom(null, 'O projekte');
		if (this.props.isNavOpened) {
			this.props.toggleNav(this.props.isNavOpened);
		}
	};

	render() {
		let content = <Loader />;
		if (this.props.serverError) {
			content = <ErrorDiv errMessage={this.props.errMessage} />;
		} else if (!this.props.serverError && !this.props.render) {
			content = <Loader />;
		} else if (this.props.render) {
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
				<DesktopSideDrawer
					aboutProjectClick={this.aboutProjectClickHandler}
					click={this.changeActiveRoomHandler}
				/>
				<SideDrawer
					aboutProjectClick={this.aboutProjectClickHandler}
					clicked={this.hamburgerButtonClickedHandler}
					click={this.changeActiveRoomHandler}
				/>
				<Backdrop />
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		isNavOpened: state.ui.isNavOpened,
		values: state.data.values,
		activeRoomNumber: state.room.activeRoomNumber,
		activeRoom: state.room.activeRoom,
		serverError: state.data.serverError,
		render: state.data.render,
		errMessage: state.data.errMessage,
		selectedInterval: state.data.selectedInterval
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		contactServer: (roomNumber, interval) => dispatch(contactServer(roomNumber, interval)),
		changeActiveRoom: (roomNumber, roomName) => dispatch(changeActiveRoom(roomNumber, roomName)),
		toggleNav: (isNavOpened) => dispatch(toggleNav(isNavOpened))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
