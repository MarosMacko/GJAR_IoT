import moment from "moment";

export const getActiveWeather = () => {
    return new Promise((resolve, reject) => {
        fetch("https://api.openweathermap.org/data/2.5/weather?q=Presov,sk&appid=80e7c80dad7e044aeb900596347bf3f5&units=metric")
            .then((res) => res.json())
            .then((body) => {
                resolve(body);
            })
            .catch((err) => reject(err));
    });
};

export const fetchActualRoomData = (id) => {
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
        })
            .then((res) => res.json())
            .then((body) => {
                resolve(body.data[0]);
            })
            .catch((err) => reject(err));
    });
};

export const fetchDataFromTimeInterval = (timeFrom, timeTo, roomId) => {
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
