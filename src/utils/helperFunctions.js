import { rooms } from "../constants/rooms";

export const findActiveRoom = (id) => {
    let activeRoomObj = {};
    Object.keys(rooms).forEach((floor) => {
        rooms[floor].forEach((room) => {
            if (room.id === +id) {
                activeRoomObj = {
                    name: room.name,
                    id: room.id,
                    floor: floor,
                };
            }
        });
    });

    return activeRoomObj;
};
