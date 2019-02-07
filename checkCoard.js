
let fs = require(`fs`);

let file = require(`./old.json`);

// console.log(file.result);

const puppeteer = require('puppeteer');

(async () => {
	const browser = await puppeteer.launch({headless: true});
	const page = await browser.newPage();
	
	await page.goto('https://frcc.desire2learn.com/d2l/le/content/2271056/viewContent/24384506/View');

	await page.waitForNavigation();

	await page.type("#username", "");

	await page.type("#password", ``);

	await page.click(".btn-submit");

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

		let myNodeList = document.querySelectorAll('div.d2l-thread-reply-counts');

		Array.from(myNodeList).forEach(function(el) {
			// console.log(el.children);
			for(let i = 0; i < el.children.length; i++){
				// console.log(el.children[i].children[0].textContent);
				arr[arrI] = el.children[i].children[0].textContent;
				arrI++;
			}
		});

		return arr;

	});

	// console.log(result);s

	let bol = true;

	if(file.result.length != result.length ){
		bol = false;
		// console.log(`ya you need to cheack the thing`);
	}else{

		// let bol = true;

		let bolI =0;

		while(bol == true && bolI < file.result.length){

			// console.log(bolI);

			if(file.result[bolI] == result[bolI] ){
				bolI++;
			}else{
				bol = false;

				fs.writeFile('old.json', JSON.stringify({

					result : result

				}), (err) => {
					if (err) throw err;
				});
			}

		}

	}

	if(bol){
		console.log(`you all good bro`);
	}else{
		console.log(`nah you got work to do`);

	}

	await browser.close();

})();

