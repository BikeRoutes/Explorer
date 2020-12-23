import * as express from "express";
import * as cors from "cors";
import { getRoutesListener } from "./server/server";

const app = express();

app.use(cors());

const port = 8081;

app.get("/", (req, res) => {
  const time = Date.now();
  getRoutesListener().then(response => {
    res.status(response.statusCode);

    console.log(Date.now() - time);
    res.json(response);
  });
});

app.listen(port, () => {
  console.log(`Dev server listening at http://localhost:${port}`);
});
