import React from 'react';
import classes from './SideDrawer.module.css';
import { IoIosClose } from 'react-icons/io';
import SideDrawerItems from './SideDrawerItems/SideDrawerItems';
import { connect } from 'react-redux';
import { toggleNav } from '../../store/actions/index';

const sideDrawer = (props) => {
	let sideDrawerClasses = props.active ? [ classes.SideDrawer, classes.Active ].join(' ') : classes.SideDrawer;

	return (
		<div className={sideDrawerClasses}>
			<div className={classes.CloseBtn} onClick={props.toggleNav.bind(this, props.isNavOpened)}>
				<IoIosClose size={'1.7em'} value={{ style: { verticalAlign: 'middle' } }} />
				Close
			</div>
			<SideDrawerItems aboutProjectClick={props.aboutProjectClick} click={props.click} />
		</div>
	);
};

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

export default connect(mapStateToProps, mapDispatchToProps)(sideDrawer);
