"use strict";

const { render, response } = require("simple-sls-ssr");

module.exports.index = async (event, context) => {
  return await render("index", {});
};
