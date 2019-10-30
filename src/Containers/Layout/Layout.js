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

const todayHours = moment().format('LTS');
const beforeTimeHours = moment().subtract(3, 'hours');

const timeFrom = formatDate(moment(beforeTimeHours));
const timeTo = formatDate(moment());

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
		errMessage: null
	};

	hamburgerButtonClickedHandler = () => {
		this.setState(() => {
			return {
				activeNav: !this.state.activeNav
			};
		});
	};

	changeActiveRoomHandler = (room, roomNumber) => {
		const parseData = {
			room: roomNumber,
			time: {
				'time-from': `${timeFrom} ${moment(beforeTimeHours).format('LTS')}`,
				'time-to': `${timeTo} ${todayHours}`
			}
		};
		if (this.state.activeRoomNumber !== roomNumber || this.state.activeRoomNumber === null) {
			this.setState({
				activeRoom: room,
				activeRoomNumber: roomNumber,
				render: false,
				serverError: false,
				errMessage: null
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
		for (let i = 0; i < response.data.data.length; i++) {
			const rawTime = response.data.data[i].time.split(' ', 2)[1].split(':', 2);
			const time = rawTime[0] + ':' + rawTime[1];

			temp.push(parseFloat(response.data.data[i].temperature).toFixed(2));
			hum.push(parseFloat(response.data.data[i].humidity).toFixed(2));
			brig.push(parseFloat(response.data.data[i].brightness).toFixed(2));
			tim.push(time);
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
