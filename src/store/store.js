import { useState, useEffect } from "react";

let globalState = {};
let listeners = [];
let actions = {};

const areCommonElements = (arr1, arr2) => {
    if (!arr1 || !arr2) return false;
    const [shortArr, longArr] = arr1.length < arr2.length ? [arr1, arr2] : [arr2, arr1];
    const longArrSet = new Set(longArr);
    return shortArr.some((el) => longArrSet.has(el));
};

export const useStore = (shouldListen = true, arrayOfValuesToListenTo) => {
    const setState = useState(globalState)[1];

    const dispatch = (actionIdentifier, payload) => {
        const newState = actions[actionIdentifier](globalState, payload);
        globalState = { ...globalState, ...newState };

        for (const listener of listeners) {
            if (!listener[1] || areCommonElements(listener[1], Object.keys(newState))) {
                listener[0](globalState);
            }
        }
    };

    useEffect(() => {
        if (shouldListen) {
            listeners.push([setState, arrayOfValuesToListenTo]);
        }
        return () => {
            if (shouldListen) {
                listeners = listeners.filter((li) => li[0] !== setState);
            }
        };
    }, [setState, shouldListen, arrayOfValuesToListenTo]);

    return [globalState, dispatch];
};

export const initStore = (userActions, initialState) => {
    if (initialState) globalState = { ...initialState, ...globalState };
    actions = { ...actions, ...userActions };
};
