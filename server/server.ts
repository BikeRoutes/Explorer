import * as express from "express";
import * as cors from "cors";
import { getRoutes } from "./getRoutes";

const app = express();

app.use(cors());

app.get("/", async (_, res) => {
  const routes = await getRoutes();

  res.json(routes);
});

app.listen(process.env.PORT || 8081);
