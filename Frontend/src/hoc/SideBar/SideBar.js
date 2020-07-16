import React, { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import classes from "./SideBar.module.scss";

const SideBar = ({ isVisible, position, children, black }) => {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    transition={{ type: "tween" }}
                    className={[
                        classes.Wrapper,
                        position === "right" ? classes.Right : classes.Left,
                        black ? classes.Black : classes.White,
                    ].join(" ")}
                    initial={{ x: position === "right" ? "100%" : "-100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: position === "right" ? "100%" : "-100%" }}
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default memo(SideBar);
