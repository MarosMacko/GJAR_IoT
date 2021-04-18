import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import classes from "./BottomDrawer.module.scss";
import Backdrop from "../../components/UI/Backdrop/Backdrop";

const BottomDrawer = ({ children, show, onClose }) => {
    return (
        <>
            <AnimatePresence>
                {show ? (
                    <motion.div
                        transition={{ transition: "tween" }}
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        className={classes.Wrapper}
                    >
                        {children}
                    </motion.div>
                ) : null}
            </AnimatePresence>
            <Backdrop top isVisible={show} onClick={onClose} />
        </>
    );
};

export default BottomDrawer;
