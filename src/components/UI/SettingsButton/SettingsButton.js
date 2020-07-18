import React from "react";
import { FiSettings } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import classes from "./SettingsButton.module.scss";
import { useStore } from "../../../store/store";
import useResponsiveDesign from "../../../hooks/useResponsiveDesign";
import colors from "../../../constants/colors.scss";

const SettingsButton = () => {
    const dispatch = useStore(false)[1];
    const { shouldDisplay, locationOnRoom } = useResponsiveDesign();

    return (
        <AnimatePresence>
            {!shouldDisplay && locationOnRoom ? (
                <motion.div
                    whileHover={{ opacity: 0.7 }}
                    onClick={() => dispatch("OPEN_SETTINGS_SIDEBAR")}
                    className={classes.Wrapper}
                    transition={{ duration: 0.5 }}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                >
                    <FiSettings color={colors.secondaryWhite} size={25} />
                </motion.div>
            ) : null}
        </AnimatePresence>
    );
};

export default SettingsButton;
