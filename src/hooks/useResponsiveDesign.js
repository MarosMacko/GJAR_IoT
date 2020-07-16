import { useState, useEffect } from "react";
import useWindowDimensions from "./useWindowDimensions";
import { useLocation, matchPath } from "react-router-dom";

export default function useResponsiveDesign() {
    const [shouldDisplay, setShouldDisplay] = useState(false);
    const [locationOnRoom, setLocationOnRoom] = useState(true);
    const { width } = useWindowDimensions();
    const location = useLocation();

    useEffect(() => {
        if (!!matchPath(location.pathname, "/room/:id")) {
            setLocationOnRoom(true);
        } else {
            setLocationOnRoom(false);
        }
        const timeout = setTimeout(() => {
            if (width < 1000) {
                setShouldDisplay(false);
            } else {
                setShouldDisplay(true);
            }
        }, 500);
        return () => {
            clearTimeout(timeout);
        };
    }, [width, location]);

    return {
        shouldDisplay,
        locationOnRoom,
    };
}
