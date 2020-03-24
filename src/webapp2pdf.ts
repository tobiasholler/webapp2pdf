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
  .option("outputfile", {
    alias: "o",
    demand: true,
    type: "string",
  })
  .option("nosandbox", {
    alias: "s",
    demand: false,
    type: "boolean",
    default: false
  })
  .option("scalefactor", {
    alias: "f",
    demand: false,
    type: "number",
    default: 1
  })
  .help()
  .argv;

(async () => {
  let puppeteerArgs: string[] = []
  if (argv.nosandbox) puppeteerArgs.push("--no-sandbox");
  const browser = await puppeteer.launch({
    args: puppeteerArgs
  });
  const page = await browser.newPage();
  await page.setViewport({
    width: 1920,
    height: 1080,
    deviceScaleFactor: argv.scalefactor || 1
  });
  await page.goto(argv.website, {waitUntil: 'networkidle0'});
  const pdf = await page.pdf({ format: 'A4' });
  fs.writeFile(argv.outputfile, pdf, async (err) => {
    if (err) throw err;
    await browser.close();
    process.exit();
  });
})();