#!/usr/bin/env node

"use strict";

const dotenv = require("dotenv");
const fs = require("fs");

const ENV_FILENAME = ".env";
const ENV_BACKUP_FILENAME = ".env.backup";
const FILE_DOES_NOT_EXIST_ERROR = "🚨 .env does not exist";
const PARSING_ERROR = "🚨 UNABLE TO PARSE YOUR .env FILE 🤷‍";
const EMPTY_ERROR = "🚨 .env IS EMPTY 🤔";
const NEW_LINE = '\r\n';
const BACKUP_TIMESTAMP = `${NEW_LINE}${NEW_LINE}Backup made on`;

const sortEnv = () => {
  if (!fs.existsSync(ENV_FILENAME)) {
    return console.log(FILE_DOES_NOT_EXIST_ERROR);
  }

  const getEnv = dotenv.config();

  if (getEnv.error) {
    return console.log(PARSING_ERROR);
  }

  const env = getEnv.parsed;

  const keysInEnv = Object.keys(env);
  const numberOfKeys = keysInEnv.length;

  if (!numberOfKeys > 0) {
    return console.log(EMPTY_ERROR);
  }

  //Make a backup of currrent .env
  if (fs.existsSync(ENV_BACKUP_FILENAME)) {
    fs.unlinkSync(ENV_BACKUP_FILENAME);
  }

  fs.copyFileSync(ENV_FILENAME, ENV_BACKUP_FILENAME);
  fs.appendFileSync(ENV_BACKUP_FILENAME, `${BACKUP_TIMESTAMP} ${new Date()}`);

  const sortedEnv = {};
  Object.keys(env)
    .sort()
    .forEach(function(key) {
      sortedEnv[key] = env[key];
    });

  fs.unlinkSync(ENV_FILENAME);

  Object.keys(sortedEnv).map(key => {
    const line = `${key}=${sortedEnv[key]}${NEW_LINE}`;
    fs.appendFileSync(ENV_FILENAME, line);
  });
};

module.exports = sortEnv;
