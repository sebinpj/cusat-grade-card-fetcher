const puppeteer = require('puppeteer');
const { convert } = require('url-slug');
const fs = require('fs').promises; // Use fs promises API directly
const pino = require('pino');
const pretty = require('pino-pretty')
const { SingleBar, Presets } = require('cli-progress'); // Import SingleBar and Presets from cli-progress
const yargs = require('yargs')
const { hideBin } = require('yargs/helpers');

// Setup logger
const logger = pino(pretty({
    colorize: true,
}))

// Parse command line arguments
const argv = yargs(hideBin(process.argv))
    .option('rollNumber', {
        describe: 'Roll number of the student',
        demandOption: 'Roll number is required',
        type: 'string',
    })
    .option('path', {
        describe: 'Path to save the PDFs',
        default: './',
        type: 'string',
    })
    .help()
    .alias('help', 'h')
    .argv;

let rollNumber = argv.rollNumber;
let path = argv.path;
let savedMessages = [];

// Before proceeding, ensure the path exists or create it
async function ensurePathExists(path) {
    try {
        await fs.mkdir(path, { recursive: true });
        logger.info(`Directory ${path} is ready`);
    } catch (err) {
        logger.error(`Error creating directory ${path}: ${err}`);
        throw err;
    }
}
async function initializeBrowser() {
    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
    });
    logger.info('Browser initialized');
    return browser;
}

async function navigateToWebsite(browser) {
    const page = await browser.newPage();
    const url = 'http://exam.cusat.ac.in/erp5/cusat/Cusat-Home/home_oldresults#';
    await page.goto(url);
    await page.waitForSelector('#maincol');
    logger.info(`Navigated to ${url} website`);

    const tableLinks = await fetchTables(page);
    const combinedTableLinks = tableLinks.flat().reverse();
    logger.info(`Processing ${combinedTableLinks.length} result links and fetching grade cards for the roll number: ${rollNumber}`);

    // Initialize cli-progress bar
    const bar = new SingleBar({
        format: 'Processing |{bar}| {percentage}% | {value}/{total}',
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        hideCursor: true
    }, Presets.shades_classic);

    bar.start(combinedTableLinks.length, 0);

    for (const link of combinedTableLinks) {
        await findGradeCard(page, link, bar);
        // Refetch to ensure the page structure hasn't changed post-navigation
        await fetchTables(page);
    }

    for (const message of savedMessages) {
        logger.info(message);
    }

    bar.stop();

    await browser.close();
    logger.info('Browser closed and fetch completed');
}

async function fetchTables(page) {
    const tables = await page.$$('#maincol table');
    const tableLinks = tables.map(async (table) => {
        return await table.$$('a');
    });
    return (await Promise.all(tableLinks)).flat();
}

async function findGradeCard(page, element, bar) {
    const text = await extractTextFromAnchor(element);
    await element.click();
    await page.waitForSelector('#txtboxToFilter');
    const fileName = convert(text) + '.pdf';
    const inputElement = await page.$('#txtboxToFilter');
    await inputElement.type(rollNumber);
    await inputElement.press('Enter');

    const targetPage = await new Promise((resolve) => page.once('popup', resolve));
    await page.goBack();
    await page.waitForSelector('#maincol');

    const pageContent = await targetPage.content();
    if (pageContent.includes(rollNumber)) {
        const pdfPath = `${path}/${fileName}`;
        const exists = await fs.access(pdfPath).then(() => true).catch(() => false);
        if (!exists) {
            await targetPage.pdf({path: pdfPath});
            savedMessages.push(`For the exam ${text}, the report card has been saved as a PDF for roll number ${rollNumber} at: ${pdfPath}`);
        } else {
            savedMessages.push(`For the exam ${text}, the PDF report card for roll number ${rollNumber} already exists at: ${pdfPath}`);
        }
    }

    await targetPage.close();
    bar.increment(1);
}

async function extractTextFromAnchor(element) {
    return element.evaluate((el) => {
        const strongElement = el.querySelector('strong');
        return strongElement ? strongElement.innerText.trim() : el.innerText.trim();
    });
}


async function main() {
    try {
        const startTime = process.hrtime.bigint();
        logger.info('CUSAT Grade Card Fetcher started');

        // Ensure the output path exists
        await ensurePathExists(path);

        const browser = await initializeBrowser();
        await navigateToWebsite(browser);
        const endTime = process.hrtime.bigint();
        const executionTimeMs = (endTime - startTime) / BigInt(1e6); // Convert to milliseconds
        const executionTimeSeconds = Number(executionTimeMs) / 1000; // Convert milliseconds to seconds
        const minutes = Math.floor(executionTimeSeconds / 60);
        const seconds = Math.floor(executionTimeSeconds % 60);
        logger.info(`CUSAT Grade Card Fetcher execution completed in ${minutes}m ${seconds}s`);
    } catch (err) {
        logger.error(err);
        process.exit(1); // Exit the process with an error code
    }
}

main().catch((err) => {
    logger.error(err);
});
