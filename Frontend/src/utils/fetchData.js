import moment from "moment";

export const getActiveWeather = () => {
    return new Promise((resolve, reject) => {
        fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=Presov,sk&appid=${process.env.REACT_APP_OPEN_WEATHER_APP_TOKEN}&units=metric`
        )
            .then((res) => res.json())
            .then((body) => {
                resolve(body);
            })
            .catch((err) => reject(err));
    });
};

export const fetchActualRoomData = (id, signal) => {
    return new Promise((resolve, reject) => {
        fetch("https://iot.gjar-po.sk/api/v1/view", {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "cache-control": "no-cache",
            },
            body: JSON.stringify({
                room: +id,
            }),
            signal: signal,
        })
            .then((res) => res.json())
            .then((body) => {
                resolve(body.data[0]);
            })
            .catch((err) => reject(err));
    });
};

export const fetchDataFromTimeInterval = (timeFrom, timeTo, roomId, signal) => {
    return new Promise((resolve, reject) => {
        const parseData = {
            room: parseInt(roomId),
            time: {
                "time-from": `${moment(timeFrom).format("YYYY-MM-DD")} ${moment(timeFrom).format("HH:mm:ss")}`,
                "time-to": `${moment(timeTo).format("YYYY-MM-DD")} ${moment(timeTo).format("HH:mm:ss")}`,
            },
        };

        fetch("https://iot.gjar-po.sk/api/v1/view", {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "cache-control": "no-cache",
            },
            body: JSON.stringify(parseData),
            signal: signal,
        })
            .then((res) => res.json())
            .then((body) => {
                resolve(body.data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};
