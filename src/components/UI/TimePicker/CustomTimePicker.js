import React, { useState } from "react";
import moment from "moment";
import "./CustomTimePicker.scss";
import TimePicker from "rc-time-picker";
import "rc-time-picker/assets/index.css";
import { useStore } from "../../../store/store";
import { AiFillQuestionCircle } from "react-icons/ai";
import HoverModal from "../../HoverModal/HoverModal";

const CustomTimePicker = () => {
    const [store, dispatch] = useStore(true, ["activeDate"]);
    const [show, setShow] = useState(false);

    const setActiveDate = (date) => {
        dispatch("SET_ACTIVE_DATE", moment(date));
    };

    return (
        <div className="MainWrapper">
            <div className="HeaderWrapper">
                <div className="Label">Čas</div>
                <div style={{ cursor: "pointer" }} onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
                    <AiFillQuestionCircle />
                    <HoverModal show={show} x={-180} y={-15} width={200}>
                        <div>Určuje čas po ktorý sa majú zobrazovať dáta v grafe.</div>
                    </HoverModal>
                </div>
            </div>
            <div className="InputWrapper">
                <TimePicker
                    onChange={setActiveDate}
                    allowEmpty={false}
                    popupClassName="TimePicker"
                    className="TimePicker"
                    showSecond={false}
                    showMinute={false}
                    value={moment(store.activeDate)}
                />
                <TimePicker
                    onChange={setActiveDate}
                    allowEmpty={false}
                    popupClassName="TimePicker"
                    className="TimePicker"
                    showSecond={false}
                    showHour={false}
                    value={moment(store.activeDate)}
                />
            </div>
        </div>
    );
};

export default CustomTimePicker;
