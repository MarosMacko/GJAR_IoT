import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useStore } from "../../store/store";
import moment from "moment";
import Graph from "../../components/Graph/Graph";
import classes from "./Main.module.scss";
import colors from "../../constants/colors.scss";
import ActiveValueBox from "../../components/UI/ActiveValueBox/ActiveValueBox";
import { FaTemperatureLow, FaLightbulb } from "react-icons/fa";
import { AiFillQuestionCircle } from "react-icons/ai";
import { IoMdWater } from "react-icons/io";
import { motion } from "framer-motion";
import { fetchActualRoomData, fetchDataFromTimeInterval } from "../../utils/fetchData";
import { findActiveRoom } from "../../utils/helperFunctions";
import HoverModal from "../../components/HoverModal/HoverModal";
import "moment/locale/sk";

export default function Main() {
    const { id } = useParams();
    const [store, dispatch] = useStore(true, ["activeDate", "interval", "ActualRoomData"]);
    const [canAnimate, setCanAnimate] = useState(false);
    const [show, setShow] = useState(false);

    useEffect(() => {
        const abortCtrl = new AbortController();

        //set active room info
        dispatch("SET_CURRENT_ROOM_INFO", findActiveRoom(id));
        //load current data for selected room
        fetchActualRoomData(id, abortCtrl.signal)
            .then((res) => {
                dispatch("SET_ACTUAL_ROOM_DATA", res);
                setCanAnimate(true);
            })
            .catch((err) => {
                dispatch("SET_ACTUAL_ROOM_DATA", null);
                setCanAnimate(true);
            });
        return () => {
            abortCtrl.abort();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    useEffect(() => {
        const abortCtrl = new AbortController();

        dispatch("SET_CAN_ANIMATE", false);
        //load data widthin time interval
        const timeFrom = moment(store.activeDate).clone().subtract(store.interval, "hours");
        const timeTo = moment(store.activeDate);

        const data = {
            brightnessData: [],
            temperatureData: [],
            humidityData: [],
        };

        fetchDataFromTimeInterval(timeFrom, timeTo, id, abortCtrl.signal)
            .then((res) => {
                dispatch("SET_CAN_ANIMATE", true);
                res.forEach((val) => {
                    const time = moment(val.time).toDate();
                    data.brightnessData.push({ x: time, y: +val.brightness });
                    data.temperatureData.push({ x: time, y: +val.temperature });
                    data.humidityData.push({ x: time, y: +val.humidity });
                });
                if (res.length === 0) return dispatch("SET_GRAPH_DATA", null);
                dispatch("SET_GRAPH_DATA", data);
            })
            .catch((err) => {
                //alert(err);
                dispatch("SET_GRAPH_DATA", null);
                dispatch("SET_CAN_ANIMATE", true);
            });
        return () => {
            abortCtrl.abort();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, store.interval, store.activeDate]);

    return (
        <div className={classes.Wrapper}>
            <motion.div transition={{ transition: 0.5 }} animate={{ opacity: 1 }} className={classes.Headline}>
                <h1>{findActiveRoom(id).name}</h1>
            </motion.div>
            <div>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={canAnimate ? { opacity: 1 } : { opacity: 0 }}
                    className={classes.AcitveValuesBoxes}
                >
                    {store.ActualRoomData ? (
                        <>
                            <ActiveValueBox
                                color={colors.temperatureColor}
                                title={"Teplota"}
                                value={`${store.ActualRoomData.temperature}°C`}
                                icon={FaTemperatureLow}
                            />
                            <ActiveValueBox
                                color={colors.humidityColor}
                                title={"Vlhkosť"}
                                value={`${store.ActualRoomData.humidity}%`}
                                icon={IoMdWater}
                            />
                            <ActiveValueBox
                                color={colors.brightnessColor}
                                title={"Svietivost"}
                                value={`${store.ActualRoomData.brightness}%`}
                                icon={FaLightbulb}
                            />
                            <div
                                className={classes.InfoWrapper}
                                style={{ cursor: "pointer" }}
                                onMouseEnter={() => setShow(true)}
                                onMouseLeave={() => setShow(false)}
                            >
                                <AiFillQuestionCircle />
                                <HoverModal show={show} x={-180} y={-15} width={250}>
                                    <div>Aktualizované: {moment(store.ActualRoomData.time).format("LLLL")}</div>
                                </HoverModal>
                            </div>
                        </>
                    ) : (
                        <h1>Oops</h1>
                    )}
                </motion.div>
            </div>

            <Graph />
        </div>
    );
}
