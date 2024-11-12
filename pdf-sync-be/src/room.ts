import { ServerWebSocket } from "bun";
import { ElysiaWS } from "elysia/dist/ws";

type WS = ElysiaWS<any, any, any>;

type Room = {
  id: string;
  admin: string;
  page: Number;
  connections: Array<WS>;
};

const rooms: Record<string, Room> = {};

export const joinRoom = (roomId: string, ws: WS) => {
  let room = rooms[roomId];
  if (!room) {
    room = {
      id: roomId,
      admin: ws.id,
      page: 1,
      connections: [ws],
    };
    rooms[roomId] = room;
    return [true, 1];
  } else {
    room.connections.push(ws);
    return [false, room.page];
  }
};

export const sendPage = (roomId: string, page: Number, ws: WS) => {
  const room = rooms[roomId];
  if (room) {
    if (room.admin === ws.id) {
      room.page = page;
      room.connections.forEach((ws) => {
        ws.send({
          page,
        });
      });
    }
  }
};

export const exitRoom = (roomId: string, ws: WS) => {
  const room = rooms[roomId];
  if (room) {
    room.connections = room.connections.filter((_ws) => ws.id != _ws.id);
  }
};
