import { initStore } from "./store";
import moment from "moment";

const configureDataStore = () => {
    const actions = {
        SET_ACTIVE_ROOM: (curState, obj) => {
            return { activeRoom: obj };
        },
        SET_GRAPH_DATA: (curState, data) => {
            return { GraphData: data };
        },
        SET_INTERVAL: (curState, updatedInterval) => {
            return { interval: updatedInterval };
        },
        SET_ACTIVE_DATE: (curState, date) => {
            return { activeDate: date };
        },
        RESET_ACTUAL_ROOM_DATA: (curState) => {
            return {
                ActualRoomData: {
                    brightness: "",
                    temperature: "",
                    humidity: "",
                },
            };
        },
        SET_ACTUAL_ROOM_DATA: (curState, data) => {
            return { ActualRoomData: data };
        },
        SET_ACTIVE_WEATHER: (curState, weather) => {
            return { ActiveWeather: { ...weather } };
        },
    };

    const initialState = {
        activeRoom: null,
        interval: 12,
        activeDate: moment(),
        GraphData: null,
        ActualRoomData: null,
        ActiveWeather: null,
    };

    initStore(actions, initialState);
};

export default configureDataStore;
