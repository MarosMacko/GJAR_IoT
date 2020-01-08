import React, { Component } from 'react';
import classes from './Layout.module.css';
import Navbar from '../../Components/Navbar/Navbar';
import SideDrawer from '../../Components/SideDrawer/SideDrawer';
import Backdrop from '../../Components/UI/Backdrop/Backdrop';
import DesktopSideDrawer from '../../Components/DesktopSideDrawer/DesktopSideDrawer';
import MainPage from '../MainPage/MainPage';
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
		activeRoom: 'Byt (29)',
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
		selectedInterval: 1,
		timeFrom: null,
		timeTo: null,
		beforeTimeHours: null
	};

	hamburgerButtonClickedHandler = () => {
		this.setState(() => {
			return {
				activeNav: !this.state.activeNav
			};
		});
	};

	changeActiveRoomHandler = (room, roomNumber) => {
		const defaultSelectedInterval = 1;

		const beforeTimeHours = moment().subtract(defaultSelectedInterval, 'hours');

		this.setState({
			timeTo: formatDate(moment()),
			timeFrom: formatDate(moment(beforeTimeHours)),
			beforeTimeHours: beforeTimeHours,
			todayHours: moment().format('LTS')
		});

		const parseData = {
			room: roomNumber,
			time: {
				'time-from': `${this.state.timeFrom} ${moment(this.state.beforeTimeHours).format('LTS')}`,
				'time-to': `${this.state.timeTo} ${this.state.todayHours}`
			}
		};
		if (this.state.activeRoomNumber !== roomNumber || this.state.activeRoomNumber === null) {
			this.setState({
				activeRoom: room,
				activeRoomNumber: roomNumber,
				render: false,
				serverError: false,
				errMessage: null,
				selectedInterval: defaultSelectedInterval
			});
			if (this.state.activeNav === true) {
				this.setState({ activeNav: !this.state.activeNav });
			}
			axios({
				method: 'POST',
				data: parseData,
				url: 'api/v1/view',
				headers: { 'content-type': 'application/json', 'cache-control': 'no-cache' }
			})
				.then((response) => {
					this.processResponse(response);
				})
				.catch((error) => {
					this.setState({
						render: false,
						serverError: true,
						errMessage: error.message
					});
				});
		}
	};

	componentDidMount() {
		this.changeActiveRoomHandler('Byt (29)', 16);
	}

	setSelectedInterval = (interval) => {
		const beforeTimeHours = moment().subtract(interval, 'hours');

		this.setState({
			selectedInterval: interval,
			timeFrom: formatDate(moment(beforeTimeHours)),
			beforeTimeHours: beforeTimeHours
		});

		const parseData = {
			room: this.state.activeRoomNumber,
			time: {
				'time-from': `${formatDate(moment(beforeTimeHours))} ${moment(beforeTimeHours).format('LTS')}`,
				'time-to': `${this.state.timeTo} ${this.state.todayHours}`
			}
		};

		axios({
			method: 'POST',
			data: parseData,
			url: 'api/v1/view',
			headers: { 'content-type': 'application/json', 'cache-control': 'no-cache' }
		})
			.then((response) => {
				this.processResponse(response);
			})
			.catch((error) => {
				this.setState({
					render: false,
					serverError: true,
					errMessage: error.message
				});
			});
	};

	processResponse = (response) => {
		if (response.data.data.length <= 0) {
			this.setState({
				errMessage: 'No Data',
				serverError: true,
				render: false
			});
			return;
		}
		let temp = [];
		let hum = [];
		let brig = [];
		let tim = [];

		const reduceBy = response.data.data.length / (response.data.data.length / this.state.selectedInterval);

		for (let i = response.data.data.length - 1; i > 0; i -= reduceBy) {
			const rawTime = response.data.data[i].time.split(' ', 2)[1].split(':', 2);
			const time = rawTime[0] + ':' + rawTime[1];

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
