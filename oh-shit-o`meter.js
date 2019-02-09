const puppeteer = require('puppeteer');
const fs = require(`fs`);

(async () => {

	const browser = await puppeteer.launch({headless: true});
	const page = await browser.newPage();
	await page.setViewport({ width: 1366, height: 768});

	await page.goto('https://www.treasury.gov/resource-center/data-chart-center/interest-rates/pages/textview.aspx?data=yield');

	let table = await page.evaluate(()=>{

		let table = [];
		let tableI = 0;
		let tableII = 0;

		Array.from(document.querySelector(`.t-chart`).children[0].children).forEach((a)=>{ 
			
			table[tableI] = [];

			Array.from(a.children).forEach((aa)=>{

				table[tableI][tableII] = aa.textContent;
				tableII++;
				
			});

			tableII = 0;
			tableI++;

		});

		return table;

	});
	
	// console.log(table);

	await browser.close();

	/*----------  Formating data form the websit  ----------*/

	let stuff = [];
	let stuffI = 0;

	table.forEach((a)=>{
		stuff[stuffI] = [];
		stuff[stuffI] = formatData(a);
		stuffI++;
	});

	// console.log(`stuff`);
	// console.log(stuff);

	/*----------  Bulding the new html  ----------*/
	
	let htmlTale = `<!DOCTYPE html><html><head><style type="text/css"> table.minimalistBlack {border: 3px solid #000000;width: 100%;text-align: left;border-collapse: collapse;}table.minimalistBlack td, table.minimalistBlack th {border: 1px solid #000000;padding: 5px 4px;}table.minimalistBlack tbody td {font-size: 13px;}table.minimalistBlack thead {background: #CFCFCF;background: -moz-linear-gradient(top, #dbdbdb 0%, #d3d3d3 66%, #CFCFCF 100%);background: -webkit-linear-gradient(top, #dbdbdb 0%, #d3d3d3 66%, #CFCFCF 100%);background: linear-gradient(to bottom, #dbdbdb 0%, #d3d3d3 66%, #CFCFCF 100%);border-bottom: 3px solid #000000;}table.minimalistBlack thead th {font-size: 15px;font-weight: bold;color: #000000;text-align: left;}table.minimalistBlack tfoot {font-size: 14px;font-weight: bold;color: #000000;border-top: 3px solid #000000;}table.minimalistBlack tfoot td {font-size: 14px;} .sad{color: red;}.ok{color: green;}</style></head><body><table class="minimalistBlack">`;	

	for(let i = 0; i < table.length; i++){

		htmlTale = htmlTale.concat(`<tr>`);

		for(let ii = 0; ii < table[i].length; ii++){
			if(i == 0){
				htmlTale = htmlTale.concat(`<th> ${table[i][ii]} </th>`);
			}else{
				htmlTale = htmlTale.concat(`<th class="${stuff[i][ii]}"> ${table[i][ii]} </th>`);
			}
		}

		htmlTale = htmlTale.concat(`</tr>`)
	}

	htmlTale = htmlTale.concat(`</table></body></html>`);

	fs.writeFile(`ohShit.html`, htmlTale, (err)=>{
		if(err){
			console.log(err);
		}
	});


})()

let formatData = (arr)=>{

	let arrTwo = [];

	arrTwo[0] = `meh`;
	arrTwo[1] = `meh`;

	for(let i = 2; i < arr.length; i++){
		if(arr[i] > arr[i-1]){
			arrTwo[i] = `ok`;
		}else{
			arrTwo[i] = `sad`;
		}
	}

	return arrTwo;
}
