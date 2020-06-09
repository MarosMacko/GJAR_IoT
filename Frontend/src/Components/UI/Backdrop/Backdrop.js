import React from 'react';
import classes from './Backdrop.module.css';
import { connect } from 'react-redux';
import { toggleNav } from '../../../store/actions/index';

const backdrop = (props) =>
	props.isNavOpened ? (
		<div className={classes.Backdrop} onClick={props.toggleNav.bind(this, props.isNavOpened)} />
	) : null;

const mapStateToProps = (state) => {
	return {
		isNavOpened: state.ui.isNavOpened
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		toggleNav: (isNavOpened) => dispatch(toggleNav(isNavOpened))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(backdrop);
