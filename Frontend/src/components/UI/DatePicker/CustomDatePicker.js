import React, { useState } from "react";
import { DatePicker } from "react-nice-dates";
import { sk } from "date-fns/locale";
import moment from "moment";
import { useStore } from "../../../store/store";
import HoverModal from "../../HoverModal/HoverModal";
import { AiFillQuestionCircle } from "react-icons/ai";

import "react-nice-dates/build/style.css";
import "./CustomDatePicker.scss";

const CustomDatePicker = () => {
    const [store, dispatch] = useStore(true, ["activeDate"]);
    const [show, setShow] = useState(false);
    return (
        <div className="MainWrapper">
            <div className="HeaderWrapper">
                <div className="Label">Dátum</div>
                <div style={{ cursor: "pointer" }} onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
                    <AiFillQuestionCircle />
                    <HoverModal show={show} x={-180} y={-15} width={200}>
                        <div>Určuje dátum podľa ktorého budú zobrazené dáta v grafe. Dáta sme začali merať od 23.1.2020.</div>
                    </HoverModal>
                </div>
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
