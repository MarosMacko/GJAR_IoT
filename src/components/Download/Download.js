import React, { useState } from "react";
import BottomDrawer from "../../hoc/BottomDrawer/BottomDrawer";
import { matchPath, useHistory, useLocation } from "react-router-dom";
import { useStore } from "../../store/store";
import { DateRangePicker, START_DATE, END_DATE } from "react-nice-dates";
import "react-nice-dates/build/style.css";
import { sk } from "date-fns/locale";
import Button from "../UI/Button/Button";

const Download = () => {
    const [store, dispatch] = useStore(true, ["downloadDrawerOpen"]);
    const { pathname } = useLocation();
    const history = useHistory();
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();

    const onClose = () => {
        dispatch("CLOSE_DOWNLOAD_DRAWER");
    };
    return (
        <BottomDrawer onClose={onClose} show={store.downloadDrawerOpen}>
            <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
                minimumDate={new Date()}
                minimumLength={1}
                format="dd MMM yyyy"
                locale={sk}
            >
                {({ startDateInputProps, endDateInputProps, focus }) => (
                    <div className="date-range">
                        <input
                            className={"input" + (focus === START_DATE ? " -focused" : "")}
                            {...startDateInputProps}
                            placeholder="Start date"
                        />
                        <span className="date-range_arrow" />
                        <input
                            className={"input" + (focus === END_DATE ? " -focused" : "")}
                            {...endDateInputProps}
                            placeholder="End date"
                        />
                    </div>
                )}
            </DateRangePicker>
        </BottomDrawer>
    );
};

export default Download;
