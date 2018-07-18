const nightmarePackage = require('Nightmare');
const blueBird = require('bluebird');
const nightmareConfig = {
  show: false,
  openDevTools: false,
 // gotoTimeout is an item in this object you need to adjust based on net speed.
 // when electron takes too long to load something, it errors out after a number of seconds
 // you can adjust the amount of seconds here in the gotoTimeout key pair depending on your
 // internet speed (The slower the higher);
  gotoTimeout: 70000
};

const nightmareWithConfig = () => {
 return nightmarePackage(nightmareConfig);
};
// Step 0 Get Link Array and pass down promise chain
// Step 1 Open Link from Array
// Step 2 Get the text form of HTML
// Step 3 Look for string that has email in it 
// Step 4 Push that link into array of emails
// Step 5 Go to next link
// Step 6 Once completed, give me array of emails

let arrayOfLinks = ['https://rmc.one/', 'http://beancash.org/'];

const emailScraper = (arrayOfLinks) => {
	
	Promise.resolve(arrayOfLinks)	
		.then(arrayOfLinks => {
			return arrayOfLinks.map(url => {
				return nightmareWithConfig()
				.viewport(1000,1000)
				.goto(url)
				.wait(10000)
				.evaluate(() => {
					return document.body.innerHTML;
				})
				.end()
				.catch(error => {
					console.log(error);
				})
			});	
		})
		.then(arrayOfPromises => {
			console.log('Array of Promises', arrayOfPromises);
			return blueBird
				.mapSeries(arrayOfPromises, htmlTextArray => {
					return htmlTextArray;
				})
		})
		.then(htmlTextArray => {
			let htmlTextArrayEmails = htmlTextArray.map( htmlString => {
				console.log(typeof htmlString);
				return htmlString.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
			})
			console.log(htmlTextArrayEmails);
		})
		.catch(error => {
			console.log('Error Main Promise Chain', error)
		})
}

emailScraper(arrayOfLinks);