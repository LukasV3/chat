import { FastifyInstance } from "fastify";
import { StreamChat } from "stream-chat";

const streamChat = StreamChat.getInstance(
  process.env.STREAM_API_KEY!,
  process.env.STREAM_API_SECRET!
);

const userRoutes = (app: FastifyInstance) => {
  app.post<{ Body: { id: string; name: string; image: string } }>(
    "/signup",
    async (request, response) => {
      const { id, name, image } = request.body;
      if (id == null || id === "" || name == null || name === "") {
        response.status(400).send();
      }

      // const existingUser = await streamChat.queryUsers({ id });
      // if (existingUser.users.length > 0) {
      //   return response.status(400).send("User ID taken");
      // }

      await streamChat.upsertUser({ id, name, image });
    }
  );
};

export { userRoutes };
