require("dotenv").config();

import RedisStore from "connect-redis";
import express from "express";
import session, { SessionOptions } from "express-session";
import clc from "cli-color";

const redis = require("redis");

const app = express();

const redisClient = redis.createClient({
  password: process.env.REDIS_PWD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

const store = new RedisStore({
  client: redisClient,
  prefix: "myapp:",
}) as unknown as SessionOptions["store"];

app.use(
  session({
    store,
    secret: "abcdefgh",
    resave: true,
    saveUninitialized: true,
  })
);

app.get("/", (req, resp) => {
  if (!req.session["visit"]) {
    req.session["visit"] = 1;
  } else {
    req.session["visit"]++;
  }

  resp.send(`hello welcome visit:${req.session["visit"]}`);
});

app.listen(3000, () => {
  console.clear();
  console.log(clc.green("app running on port 3000"));
  redisClient.connect().then(() => {
    console.log(clc.cyan("redis server connected"));
  });
});
