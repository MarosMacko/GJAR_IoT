import React from 'react';
import HamburgerButton from '../UI/HamburgerButton/HamburgerButton';
import classes from './Navbar.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { toggleNav } from '../../store/actions/index';

const Navbar = (props) => {
	const dispatch = useDispatch();
	const isNavOpened = useSelector((state) => state.room.isNavOpened);
	const activeRoom = useSelector((state) => state.room.activeRoom);

	return (
		<React.Fragment>
			<div className={classes.GjarIot}>GJAR IOT</div>
			<p className={classes.Activeroom}>{activeRoom}</p>
			<div className={classes.HamburgerButton}>
				<HamburgerButton click={() => dispatch(toggleNav(isNavOpened))} active={isNavOpened} />
			</div>
		</React.Fragment>
	);
};

export default Navbar;
