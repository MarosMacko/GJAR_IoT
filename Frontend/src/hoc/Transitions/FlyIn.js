import React from "react";
import { motion } from "framer-motion";

const FlyIn = ({ children, slideUp = 0, delay = 0, className }) => {
    return (
        <motion.div
            className={className}
            transition={{ delay: delay, duration: 0.5, times: [0.3, 0.6, 1] }}
            initial={{ opacity: 0, y: slideUp }}
            animate={{ opacity: [0, 1, 1], y: [slideUp, slideUp / 2, 0] }}
        >
            {children}
        </motion.div>
    );
};

export default FlyIn;
