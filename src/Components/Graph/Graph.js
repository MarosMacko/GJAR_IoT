import React, { useRef, useEffect, useState } from "react";
import CanvasJSReact from "./canvasjs.react";
import { useStore } from "../../store/store";
import classes from "./Graph.module.scss";
import colors from "../../constants/colors.scss";
import { motion } from "framer-motion";
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

export default function Graph() {
    const [store, dispatch] = useStore(true, ["GraphData", "canAnimate"]);
    const ChartWithCrosshair = useRef();
    const [options, setOptions] = useState({});

    useEffect(() => {
        if (!store.GraphData) return;
        setOptions({
            interactivityEnabled: true,
            animationEnabled: true,
            zoomEnabled: true,
            theme: "dark2",
            backgroundColor: colors.tertiaryBlack,
            axisX: {
                valueFormatString: "HH:mm DD/MM",
                crosshair: {
                    enabled: true,
                    snapToDataPoint: true,
                },
                labelFontSize: 12,
            },
            axisY: {
                title: "",
                includeZero: true,
                crosshair: {
                    enabled: true,
                    snapToDataPoint: true,
                },
            },
            toolTip: {
                shared: true,
            },
            data: [
                {
                    name: "Vlhkosť",
                    xValueFormatString: "DD/MM HH:mm",
                    yValueFormatString: '#,##0.##"%"',
                    type: "area",
                    color: colors.humidityColor,
                    dataPoints: store.GraphData.humidityData,
                },
                {
                    name: "Teplota",
                    xValueFormatString: "DD/MM HH:mm",
                    yValueFormatString: '#,##0.##"°C"',
                    type: "area",
                    color: colors.temperatureColor,
                    dataPoints: store.GraphData.temperatureData,
                },
                {
                    name: "Osvetlenie",
                    xValueFormatString: "DD/MM HH:mm",
                    yValueFormatString: '#,##0.##"%"',
                    type: "area",
                    color: colors.brightnessColor,
                    dataPoints: store.GraphData.brightnessData,
                },
            ],
        });
    }, [store.GraphData]);

    useEffect(() => {
        return () => {
            dispatch("SET_CAN_ANIMATE", false);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <motion.div initial={{ opacity: 0 }} animate={store.canAnimate ? { opacity: 1 } : { opacity: 0 }} className={classes.ChartWrapper}>
            {store.GraphData !== null ? <CanvasJSChart options={options} ref={ChartWithCrosshair} /> : <h1>Žiadne dáta</h1>}
        </motion.div>
    );
}
