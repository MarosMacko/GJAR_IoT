import React from "react";
import moment from "moment";
import "./CustomTimePicker.scss";
import TimePicker from "rc-time-picker";
import "rc-time-picker/assets/index.css";
import { useStore } from "../../../store/store";

const CustomTimePicker = () => {
    const [store, dispatch] = useStore(true, ["activeDate"]);
    return (
        <div className="MainWrapper">
            <div className="HeaderWrapper">
                <div className="Label">Čas</div>
            </div>
            <div className="InputWrapper">
                <TimePicker
                    onChange={(date) => {
                        dispatch("SET_ACTIVE_DATE", moment(date));
                    }}
                    allowEmpty={false}
                    popupClassName="TimePicker"
                    className="TimePicker"
                    showSecond={false}
                    showMinute={false}
                    value={moment(store.activeDate)}
                />
                <TimePicker
                    onChange={(date) => dispatch("SET_ACTIVE_DATE", moment(date))}
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
