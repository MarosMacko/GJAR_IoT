import React, { memo } from "react";
import classes from "./Backdrop.module.scss";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "../../../store/store";

const Backdrop = ({ isVisible }) => {
    const dispatch = useStore(false)[1];
    return (
        <AnimatePresence>
            {isVisible ? (
                <motion.div
                    onClick={() => dispatch("CLOSE_ALL_SIDEBARS")}
                    className={classes.Backdrop}
                    transition={{ type: "tween" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    exit={{ opacity: 0 }}
                ></motion.div>
            ) : null}
        </AnimatePresence>
    );
};

export default memo(Backdrop);
