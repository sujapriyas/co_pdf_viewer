import { Elysia, t } from "elysia";
import { exitRoom, joinRoom, sendPage } from "./room";
import cors from "@elysiajs/cors";
import { addPDF } from "./permission";

const app = new Elysia()
  .use(cors())
  .get("/", () => "Hello Elysia")
  .get("/pdf-download/:id", ({ params: { id } }) => {
    const path = `./pdf-files/${id}.pdf`;

    return Bun.file(path);
  })
  .post(
    "/pdf-upload",
    async ({ body: { pdf } }) => {
      const id = crypto.randomUUID();
      const path = `./pdf-files/${id}.pdf`;
      await Bun.write(path, pdf);
      return id;
    },
    {
      body: t.Object({
        pdf: t.File(),
      }),
    },
  )

  .ws("/ws", {
    body: t.Object({
      page: t.Number(),
    }),
    query: t.Object({
      roomId: t.String(),
    }),
    open(ws) {
      const { roomId } = ws.data.query;
      const [admin, page] = joinRoom(roomId, ws);
      ws.send({
        admin,
        page,
      });
    },
    message(ws, message) {
      const { roomId } = ws.data.query;
      sendPage(roomId, message.page, ws);
    },
    close(ws) {
      const { roomId } = ws.data.query;
      exitRoom(roomId, ws);
    },
  })

  .listen(8000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
