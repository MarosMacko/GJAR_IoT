import React from 'react';
import HamburgerButton from '../UI/HamburgerButton/HamburgerButton';
import classes from './Navbar.module.css';
import { connect } from 'react-redux';
import { toggleNav } from '../../store/actions/index';

const navbar = (props) => (
	<React.Fragment>
		<div className={classes.GjarIot}>GJAR IOT</div>
		<p className={classes.Activeroom}>{props.activeRoom}</p>
		<div className={classes.HamburgerButton}>
			<HamburgerButton click={props.toggleNav.bind(this, props.isNavOpened)} active={props.isNavOpened} />
		</div>
	</React.Fragment>
);

const mapStateToProps = (state) => {
	return {
		isNavOpened: state.room.isNavOpened,
		activeRoom: state.room.activeRoom
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		toggleNav: (isNavOpened) => dispatch(toggleNav(isNavOpened))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(navbar);
