require('dotenv').config()
const puppeteer = require('puppeteer');
const { createClient } = require('@supabase/supabase-js');

const scrapeOfferCounts = async () => {
	console.log(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
	const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
	try {
		const browser = await puppeteer.launch({ headless: true });
		const page = await browser.newPage();

		await page.setUserAgent(
			'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
		);

		await page.goto('https://www.olx.pl/praca/sulkow/?search%5Bdist%5D=30', {
			waitUntil: 'domcontentloaded',
			timeout: 0,
		});

		await page.waitForSelector('ul[data-testid="category-count-links"]');
		const totalCountElement = await page.waitForSelector('span[data-testid="total-count"]');

		data = await page.$$eval('ul[data-testid="category-count-links"] li', (items) => {
			const result = {};
			items.forEach((li) => {
				const name = li.querySelector('a')?.childNodes[0]?.textContent.trim();
				const count = li.querySelector('span')?.textContent.trim();
				if (name && count) {
					result[name] = parseInt(count);
				}
			});
			return result;
		});

		const totalCountText = await totalCountElement.evaluate((el) => el.textContent);
		const match = totalCountText.match(/\d+/);
		number = match ? parseInt(match[0]) : null;
		await browser.close();
		console.log(number);
		
		// const { error } = await supabase.from('offers').insert({ count_offers: number });
	} catch (err) {
		console.error('Error:', err);
	} finally {
		console.log('zakonczono');
	}
};

scrapeOfferCounts();
