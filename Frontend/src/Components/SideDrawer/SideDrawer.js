import React from 'react';
import classes from './SideDrawer.module.css';
import { IoIosClose } from 'react-icons/io';
import SideDrawerItems from './SideDrawerItems/SideDrawerItems';
import { useDispatch, useSelector } from 'react-redux';
import { toggleNav } from '../../store/actions/index';

const SideDrawer = (props) => {
	const dispatch = useDispatch();
	const isNavOpened = useSelector((state) => state.ui.isNavOpened);
	let sideDrawerClasses = isNavOpened ? [ classes.SideDrawer, classes.Active ].join(' ') : classes.SideDrawer;

	return (
		<div className={sideDrawerClasses}>
			<div className={classes.CloseBtn} onClick={() => dispatch(toggleNav(isNavOpened))}>
				<IoIosClose size={'1.7em'} value={{ style: { verticalAlign: 'middle' } }} />
				Close
			</div>
			<SideDrawerItems aboutProjectClick={props.aboutProjectClick} click={props.click} />
		</div>
	);
};

export default SideDrawer;
