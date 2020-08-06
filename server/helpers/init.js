import fs from 'fs';
import CSV from 'comma-separated-values';
import RestaurantModel from '../models/restaurant';
import BusinessHourModel from '../models/businessHour';

const filename = `${__dirname}/../../sample.csv`;
const weekdayMap = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 };

function transformHourToNumber(hour) {
	const indicator = hour.indexOf('pm') > -1 & 1;
	let [h, m] = hour.replace(/(a|p)m/, '').split(':');
	h = parseInt(h);
	m = m ? parseInt(m) : 0;
	return indicator * 720 + h * 60 + m;
};

module.exports = async (db) => {
	const Restaurant = new RestaurantModel(db);
	const BusinessHour = new BusinessHourModel(db);
	const rawContent = fs.readFileSync(filename).toString('utf-8');
	const csv = new CSV(rawContent);
	const list = csv.parse();
	let [restaurantName, businessHours] = list[1];
	// console.log(businessHours);
	// const restaurant = await Restaurant.create({ restaurantName, businessHoursText: businessHours });
	// businessHours = businessHours.replace('Tues', 'Tue').replace('Weds', 'Wed').replace('Thurs', 'Thu');
	// let businessHoursArr = businessHours.split('/');
	// businessHoursArr = businessHoursArr.map(async (businessHour) => {
	// 	businessHour = businessHour.replace(/\s/g, '');
	// 	const separator = businessHour.search(/\d/)
	// 	const weekdays = businessHour.slice(0, separator);
	// 	const hours = businessHour.slice(separator);
	// 	console.log('\x1b[36m%s\x1b[0m', 'Before');
	// 	console.log(weekdays);
	// 	console.log(hours);
	// 	console.log('\x1b[35m%s\x1b[0m', 'After');
	// 	const [open, close] = hours.split('-');
	// 	let openTime = transformHourToNumber(open);
	// 	let closeTime = transformHourToNumber(close);
	// 	if (closeTime < openTime) { closeTime += 720; }
	// 	let businessHourList = [];
	// 	weekdays.split(',').map((weekday) => {
	// 		if (weekday.indexOf('-') === -1) {
	// 			const day = weekdayMap[weekday];
	// 			businessHourList.push(Object.assign({}, { restaurantId: restaurant._id, day, openTime, closeTime }))
	// 		} else {
	// 			const [dayFrom, dayTo] = weekday.split('-').map((day) => (weekdayMap[day]));
	// 			for (let i = dayFrom; i <= dayTo; i++) {
	// 				businessHourList.push(Object.assign({}, { restaurantId: restaurant._id, day: i, openTime, closeTime }))
	// 			}
	// 		}
	// 	});
	// 	return await BusinessHour.createMany(businessHourList);
	// });
};
