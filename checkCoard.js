
const puppeteer = require('puppeteer');

(async () => {
	const browser = await puppeteer.launch({headless: true});
	const page = await browser.newPage();
	await page.setViewport({ width: 1366, height: 768});

	await page.goto('https://frcc.desire2learn.com/d2l/le/content/2271056/viewContent/24384506/View');

	await page.waitForNavigation();

	await page.type("#username", "");

	await page.type("#password", ``);

	await page.click(".btn-submit");

	// await page.waitForNavigation({ waitUntil: 'networkidle2' })

	try {
		await page.waitForSelector('.d2l-page-main-padding');
	} catch (e) {
		if (e instanceof TimeoutError) {
			console.log(`oh shit… thats like bad, you should try rerunning this program if your a user, also copy this mesage and yell at the guy to fix this`);
		}
	}

	// console.log(`test`);

	let result = await page.evaluate(()=>{

		let arr = [];
		let arrI = 0;
		arrAllGood = 3;

		let myNodeList = document.querySelectorAll('div.d2l-thread-reply-counts');

		Array.from(myNodeList).forEach(function(el) {
			// console.log(el.children);
			for(let i = 0; i < el.children.length; i++){
				
				if(arrAllGood == 3){
					// console.log(el.children[i].children[0].textContent);
					arr[arrI] = el.children[i].children[0].textContent;
					arrI++;
					arrAllGood = 1;
				}else{
					arrAllGood++;
				}

			}
		});
		
		return arr;
		
	});

	console.log(result);

	let bolI = 0;
	let bol = true;

	while(bolI < result.length && bol == true){
		if(result[bolI] != 0){
			bol = false;
		}
		bolI++;
	}

	// bol = false;

	if(bol){
		console.log(`you all good bro`);
	}else{
		console.log(`nah you got work to do`);

		const browserTwo = await puppeteer.launch({headless: false});
		const pagetwo = await browserTwo.newPage();
		await pagetwo.setViewport({ width: 1366, height: 768});

		await pagetwo.goto('https://frcc.desire2learn.com/d2l/le/content/2271056/viewContent/24384506/View');

		await pagetwo.waitForNavigation();

		await pagetwo.type("#username", "S02108336");

		await pagetwo.type("#password", `sy("USn8jgtd!<Mc`);

		await pagetwo.click(".btn-submit");

	}

	await browser.close();

})();

