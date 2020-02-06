#!/usr/bin/env node

import puppeteer from "puppeteer";
import * as yargs from "yargs";
import * as fs from "fs";

const argv = yargs
  .scriptName("webapp2pdf")
  .option("website", {
    alias: "w",
    demand: true,
    type: "string"
  })
  .option("outputFile", {
    alias: "o",
    demand: true,
    type: "string"
  })
  .help()
  .argv;

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(argv.website, {waitUntil: 'networkidle0'});
  const pdf = await page.pdf({ format: 'A4' });
  fs.writeFile(argv.outputFile, pdf, async (err) => {
    if (err) throw err;
    await browser.close();
    process.exit();
  });
})();