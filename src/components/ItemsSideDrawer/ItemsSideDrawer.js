import React from "react";
import SideBar from "../../hoc/SideBar/SideBar";
import HamburgerButton from "../UI/HamburgerButton/HamburgerButton";
import { useStore } from "../../store/store";
import classes from "./ItemsSideDrawer.module.scss";
import { NavLink } from "react-router-dom";
import { rooms } from "../../constants/rooms";

const ItemsSideDrawer = () => {
    const [store, dispatch] = useStore(true, ["sidebarOpen"]);
    return (
        <SideBar position="left" isVisible={store.sidebarOpen}>
            <HamburgerButton color={"#0e0e10"} style={{ margin: 24, marginLeft: 10 }} toggle={() => dispatch("CLOSE_SIDEBAR")} open />
            <span className={classes.Watermark}>GJAR</span>
            {Object.keys(rooms).map((separatorName, index) => {
                return [
                    <Separator key={index}>{separatorName}</Separator>,
                    rooms[separatorName].map((room, index) => (
                        <Item click={() => dispatch("CLOSE_ALL_SIDEBARS")} key={index} id={room.id}>
                            {room.name}
                        </Item>
                    )),
                ];
            })}
            <AboutUsButton click={() => dispatch("CLOSE_ALL_SIDEBARS")} />
        </SideBar>
    );
};

const Separator = (props) => {
    return <div className={classes.Separator}>{props.children}</div>;
};

const Item = (props) => {
    return (
        <NavLink className={classes.Item} onClick={props.click} to={`/room/${props.id}`} activeClassName={classes.Active}>
            <span></span>
            <div>{props.children}</div>
            <div>{props.id}</div>
        </NavLink>
    );
};

const AboutUsButton = (props) => {
    return (
        <NavLink className={classes.AboutUsButton} onClick={props.click} to={`/about`} activeClassName={classes.ActiveAboutUsButton}>
            <div>O projekte</div>
        </NavLink>
    );
};

export default ItemsSideDrawer;
