#!/usr/bin/env node

"use strict";

const dotenv = require("dotenv");
const getEnv = dotenv.config();
const fs = require("fs");

const sortEnv = () => {
  if (getEnv.error) {
    return console.log("🚨 UNABLE TO PARSE YOUR .env FILE 🤷‍");
  }

  const env = getEnv.parsed;

  const keysInEnv = Object.keys(env);
  const numberOfKeys = keysInEnv.length;

  if (!numberOfKeys > 0) {
    return console.log("🚨 .env IS EMPTY 🤔");
  }

  //Make a backup of currrent .env
  fs.unlinkSync(".env.bak");
  fs.copyFileSync(".env", ".env.bak");
  fs.appendFileSync(".env.bak", `\r\n \r\nBackup made on ${new Date()}`);

  const sortedEnv = {};
  Object.keys(env)
    .sort()
    .forEach(function(key) {
      sortedEnv[key] = env[key];
    });

  fs.unlinkSync(".env");

  Object.keys(sortedEnv).map(key => {
    const line = `${key}=${sortedEnv[key]}` + "\r\n";
    fs.appendFileSync(".env", line);
  });
};

module.exports = sortEnv;
