import express from "express";
import apiRouter from "./router";

const app = express();

// use JSON for req.body
app.use(express.json());

app.get("/health", (_, res) => {
  res.status(200).json({ status: "ok" });
});

// use the router to answers request on /api
app.use("/api", apiRouter);

// return HTTP 404 if the request has not been handled
app.use((_, res) => {
  res.status(404).send();
});

export default app;
