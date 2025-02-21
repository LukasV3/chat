import { FastifyInstance } from "fastify";
import { StreamChat } from "stream-chat";
import "dotenv/config";

const serverClient = StreamChat.getInstance(
  process.env.STREAM_API_KEY!,
  process.env.STREAM_API_SECRET!
);

const TOKEN_USER_ID_MAP = new Map<string, string>();

const userRoutes = (app: FastifyInstance) => {
  app.post<{ Body: { id: string; name: string; image: string } }>(
    "/signup",
    async (request, reply) => {
      const { id, name, image } = request.body;

      if (id == null || id === "" || name == null || name === "") {
        reply.status(400).send();
      }

      try {
        const existingUser = await serverClient.queryUsers({ id });
        if (existingUser.users.length > 0) {
          return reply.status(400).send("User ID taken");
        }

        await serverClient.upsertUser({ id, name, image });
      } catch (error) {
        console.error(error);
        reply.status(500).send();
      }
    }
  );

  app.post<{ Body: { id: string } }>("/login", async (request, reply) => {
    const { id } = request.body;

    if (id == null || id === "") {
      reply.status(400).send();
    }

    try {
      const {
        users: [user],
      } = await serverClient.queryUsers({ id });
      if (user == null) return reply.status(401).send();

      const token = serverClient.createToken(id);
      TOKEN_USER_ID_MAP.set(token, user.id);

      return {
        token,
        user: { name: user.name, id: user.id, image: user.image },
      };
    } catch (error) {
      console.error(error);
      reply.status(500).send();
    }
  });

  app.post<{ Body: { token: string } }>("/logout", async (request, reply) => {
    const { token } = request.body;
    if (token == null || token === "") return reply.status(400).send();

    const id = TOKEN_USER_ID_MAP.get(token);
    if (id == null) return reply.status(400).send();

    await serverClient.revokeUserToken(id, new Date());
    TOKEN_USER_ID_MAP.delete(token);
  });
};

export { userRoutes };
