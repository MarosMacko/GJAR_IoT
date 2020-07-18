import React from "react";
import { DatePicker } from "react-nice-dates";
import { sk } from "date-fns/locale";
import moment from "moment";
import { useStore } from "../../../store/store";

import "react-nice-dates/build/style.css";
import "./CustomDatePicker.scss";

const CustomDatePicker = () => {
    const [store, dispatch] = useStore(true, ["activeDate"]);
    return (
        <div className="Wrapper">
            <div className="HeaderWrapper">
                <div className="Label">Dátum</div>
            </div>
            <DatePicker
                minimumDate={moment("2020-01-23").startOf("day").toDate()}
                maximumDate={moment().endOf("day").toDate()}
                date={moment(store.activeDate).toDate()}
                onDateChange={(date) => {
                    dispatch("SET_ACTIVE_DATE", moment(date));
                }}
                locale={sk}
                format="dd/MM/yyyy"
            >
                {({ inputProps, focused }) => <input className="DatePickerInput" {...inputProps} />}
            </DatePicker>
        </div>
    );
};

export default CustomDatePicker;
