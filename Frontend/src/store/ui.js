import { initStore } from "./store";

const configureUIStore = () => {
    const actions = {
        OPEN_SIDEBAR: () => {
            return { sidebarOpen: true };
        },
        CLOSE_SIDEBAR: () => {
            return { sidebarOpen: false };
        },
        CLOSE_ALL_SIDEBARS: () => {
            return { sidebarOpen: false, settingsSidebarOpen: false };
        },
        OPEN_SETTINGS_SIDEBAR: () => {
            return { settingsSidebarOpen: true };
        },
        CLOSE_SETTINGS_SIDEBAR: () => {
            return { settingsSidebarOpen: false };
        },
        SET_CAN_ANIMATE: (curState, canAnimState) => {
            return { canAnimate: canAnimState };
        },
        SET_CURRENT_ROOM_INFO: (curstate, info) => {
            return { currentRoomInfo: info };
        },
    };

    const initialState = {
        sidebarOpen: false,
        settingsSidebarOpen: false,
        canAnimate: false,
        currentRoomInfo: null,
    };

    initStore(actions, initialState);
};

export default configureUIStore;
