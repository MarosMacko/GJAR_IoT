import React, { Component } from 'react';
import classes from './Layout.module.css';
import Navbar from '../../Components/Navbar/Navbar';
import SideDrawer from '../../Components/SideDrawer/SideDrawer';
import Backdrop from '../../Components/UI/Backdrop/Backdrop';
import DesktopSideDrawer from '../../Components/DesktopSideDrawer/DesktopSideDrawer';
import MainPage from '../../Components/MainPage/MainPage';
import axios from '../../axios-call';
import Loader from '../../Components/UI/Loader/Loader';
import ErrorDiv from '../../Components/ErrorDiv/ErrorDiv';
import { Route } from 'react-router-dom';
import AboutUsPage from '../../Components/AboutUsPage/AboutUsPage';
import moment from 'moment';
import 'moment/locale/sk';

const formatDate = (date) => date.format('YYYY-MM-DD');

class Layout extends Component {
	state = {
		activeNav: false,
		activeRoom: null,
		activeRoomNumber: null,
		values: {
			temperature: [],
			humidity: [],
			brightness: [],
			times: []
		},
		render: false,
		serverError: false,
		errMessage: null,
		selectedInterval: 3
	};

	componentDidMount() {
		this.changeActiveRoomHandler('Študovňa (29)', 29);
	}

	hamburgerButtonClickedHandler = () => {
		this.setState(() => {
			return {
				activeNav: !this.state.activeNav
			};
		});
	};

	changeActiveRoomHandler = (roomName, roomNumber) => {
		const defaultSelectedInterval = 3;

		const beforeTimeHours = moment().subtract(defaultSelectedInterval, 'hours');

		const times = {
			timeTo: formatDate(moment()),
			timeFrom: formatDate(moment(beforeTimeHours)),
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

		if (this.state.activeRoomNumber !== roomNumber || this.state.activeRoomNumber === null) {
			this.setState({
				activeRoom: roomName,
				activeRoomNumber: roomNumber,
				render: false,
				serverError: false,
				errMessage: null,
				selectedInterval: defaultSelectedInterval
			});
			if (this.state.activeNav === true) {
				this.setState({ activeNav: !this.state.activeNav });
			}
			this.getDataFromServer(parseData);
		}
	};

	setSelectedInterval = (interval) => {
		const beforeTimeHours = moment().subtract(interval, 'hours');

		this.setState({
			selectedInterval: interval
		});

		const parseData = {
			room: this.state.activeRoomNumber,
			time: {
				'time-from': `${formatDate(moment(beforeTimeHours))} ${moment(beforeTimeHours).format('LTS')}`,
				'time-to': `${formatDate(moment())} ${moment().format('LTS')}`
			}
		};
		this.getDataFromServer(parseData);
	};

	getDataFromServer = (parseData, interval) => {
		axios({
			method: 'POST',
			data: parseData,
			url: 'api/v1/view',
			headers: { 'content-type': 'application/json', 'cache-control': 'no-cache' }
		})
			.then((response) => {
				this.processResponse(response, interval);
			})
			.catch((error) => {
				this.setState({
					render: false,
					serverError: true,
					errMessage: error.message
				});
			});
	};

	processResponse = (response, interval) => {
		if (response.data.data.length <= 0) {
			this.setState({
				errMessage: 'Žiadne dáta',
				serverError: true,
				render: false
			});
			return;
		}
		let temp = [];
		let hum = [];
		let brig = [];
		let tim = [];

		const reduceBy = response.data.data.length / (response.data.data.length / interval);

		for (let i = response.data.data.length - 1; i > 0; i -= reduceBy) {
			const time = moment(response.data.data[i].time).format('HH:mm DD/MM');

			temp.unshift(parseFloat(response.data.data[i].temperature).toFixed(2));
			hum.unshift(parseFloat(response.data.data[i].humidity).toFixed(2));
			brig.unshift(parseFloat(response.data.data[i].brightness).toFixed(2));
			tim.unshift(time);
		}
		this.setState({
			values: {
				temperature: temp,
				humidity: hum,
				brightness: brig,
				times: tim
			},
			render: true,
			serverError: false
		});
	};

	aboutProjectClickHandler = () => {
		this.setState({
			activeRoom: 'O projekte',
			activeRoomNumber: null
		});
		if (this.state.activeNav === true) {
			this.setState({ activeNav: !this.state.activeNav });
		}
	};

	render() {
		let content = <Loader />;
		if (this.state.serverError) {
			content = <ErrorDiv errMessage={this.state.errMessage} />;
		} else if (!this.state.serverError && !this.state.render) {
			content = <Loader />;
		} else if (this.state.render) {
			content = (
				<MainPage
					activeRoomNumber={this.state.activeRoomNumber}
					values={this.state.values}
					render={this.state.render}
					selectedInterval={this.state.selectedInterval}
					select={this.setSelectedInterval}
				/>
			);
		}

		return (
			<React.Fragment>
				<nav className={classes.Navbar}>
					<Navbar
						click={this.hamburgerButtonClickedHandler}
						active={this.state.activeNav}
						title={this.state.activeRoom}
					/>
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
					active={this.state.activeNav}
					clicked={this.hamburgerButtonClickedHandler}
					click={this.changeActiveRoomHandler}
				/>
				<Backdrop show={this.state.activeNav} clicked={this.hamburgerButtonClickedHandler} />
			</React.Fragment>
		);
	}
}

export default Layout;
