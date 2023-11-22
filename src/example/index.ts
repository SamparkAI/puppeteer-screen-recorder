import fs from 'fs';
import { PassThrough } from 'stream';

import puppeteer from 'puppeteer-core';

import { PuppeteerScreenRecorder } from '../lib/PuppeteerScreenRecorder';

/** @ignore */
async function testStartMethod(format: string, isStream: boolean) {
  const browser = await puppeteer.launch({
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: false,
    defaultViewport: null,
  });
  const page = await browser.newPage();
  const recorder = new PuppeteerScreenRecorder(page);
  if (isStream) {
    const passthrough = new PassThrough();
    format = format.replace('video', 'stream');
    const fileWriteStream = fs.createWriteStream(format);
    passthrough.pipe(fileWriteStream);
    await recorder.startStream(passthrough);
  } else {
    await recorder.start(format);
  }
  await page.goto('https://developer.mozilla.org/en-US/docs/Web/CSS/animation');
  await new Promise(resolve => setTimeout(resolve, 10 * 1000));
  await recorder.stop();
  await browser.close();
}

async function executeSample(format) {
  const argList = process.argv.slice(2);
  const isStreamTest = argList.includes('stream');

  console.log(
    `Testing with Method using ${isStreamTest ? 'stream' : 'normal'} mode`
  );
  return testStartMethod(format, isStreamTest);
}

executeSample('./report/video/simple1.mp4').then(() => {
  console.log('completed');
});
