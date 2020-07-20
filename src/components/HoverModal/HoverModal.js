import React from "react";
import classes from "./HoverModal.module.scss";
import { AnimatePresence, motion } from "framer-motion";

const HoverModal = ({ show, boxWidth, x, y, children }) => {
    return (
        <AnimatePresence initial>
            {show ? (
                <motion.div
                    initial={{ opacity: 0, x: x, y: y }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ width: 200 }}
                    className={classes.hoverBox}
                >
                    <div>{children}</div>
                </motion.div>
            ) : null}
        </AnimatePresence>
    );
};

export default HoverModal;
