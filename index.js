import puppeteer from 'puppeteer';
import express from 'express';
import stealthplugin from 'puppeteer-extra-plugin-stealth';
import puppeteerextra from 'puppeteer-extra';
const app = express();
const PORT = 3001 || process.env.PORT;

puppeteerextra.use(stealthplugin());
function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}
(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    
    await page.goto(process.env.RIGHTWEB_URL, { waitUntil: 'networkidle0' });


    await page.setViewport({ width: 1080, height: 1024 });
    await page.waitForSelector(process.env.RIGHTWEB_SELECTOR_INPUT_USER);
    await page.type(process.env.RIGHTWEB_SELECTOR_INPUT_USER, process.env.ONE_USER, { delay: 100 });
    // await page.screenshot({
    //     path: 'screenshot1.jpg',
    // });
    console.log(page)
    await delay(1200)
    console.log('writing password')
    await page.waitForSelector(process.env.RIGHTWEB_SELECTOR_INPUT_PASS);
    await page.type(process.env.RIGHTWEB_SELECTOR_INPUT_PASS, process.env.ONE_PASS, { delay: 100 });
    // await page.screenshot({
    //     path: 'screenshot2.jpg',
    // });
    await delay(500)
    console.log('password complete-logging on')
    // await page.click(`${process.env.SELETOR_BUTTON}`);   
    // await page.waitForSelector('#one');

    await Promise.all([
        page.click(`${process.env.RIGHTWEB_SELECTOR_BUTTON}`),
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
    ]);
    console.log('logon complete -> running report')
    // await page.screenshot({
    //     path: 'screenshot3.jpg',
    // });
    await page.waitForSelector(process.env.RIGHTWEB_SELECTOR_RUNREPORT);
    await page.screenshot({
        path: 'screenshot.jpg',
    });

    await delay(500)
    console.log('clicking html radio')
    await page.click(process.env.RIGHTWEB_SELECTOR_RADIOHTML);
    console.log('clicking run report')
    await Promise.all([
        page.click(process.env.RIGHTWEB_SELECTOR_RUNREPORT),
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
    ]);
    await page.screenshot({
        path: 'screenshot.jpg',
    });
    await delay(5000)
    const pages = await browser.pages()
    // await pages[2].waitForSelector(process.env.RW_ELEM_TABLE)
    const secondTab = pages[2];
    await secondTab.bringToFront();
    console.log('moved to new tab')
    console.log(secondTab)
    await delay(5000)
    // await page.waitForNavigation({ waitUntil: 'networkidle0' });
    await secondTab.click(process.env.RW_ELEM_REPORT_NEXT_BTN);
    console.log('button found')
    // await page.waitFor(3000)
    

    await delay(20000)
    await browser.close();
})();



app.get('/', (req, res) => {
    res.send('hello')
})


app.listen(PORT, () => {
    console.log('Listening on ' + PORT);
})


// parse the table GridViewRene