import { tsvParse} from "d3-dsv";
import { timeParse } from "d3-time-format";

function parseData(parse) {
	return function(d) {
		d.date = parse(d.date);
		d.open = +d.open;
		d.high = +d.high;
		d.low = +d.low;
		d.close = +d.close;
		d.volume = +d.volume;
		console.log(d)
		return d;
	};
}

const parseDate = timeParse("%Y-%m-%d");

//https://cdn.rawgit.com/rrag/react-stockcharts/master/docs/data/MSFT.tsv 
//http://0.0.0.0:5000/?stock=AAPL&interval=3mo

export function getData(value) {
	// console.log("ICI")
	// console.log(value)
	var str = "https://cdn.rawgit.com/rrag/react-stockcharts/master/docs/data/MSFT.tsv"
	if (value === "TEST") {
		str = "https://cdn.rawgit.com/rrag/react-stockcharts/master/docs/data/MSFT.tsv"
	}
	if (value === "TESLA") {
		// str = "https://cdn.rawgit.com/rrag/react-stockcharts/master/docs/data/MSFT.tsv"
		str = "http://0.0.0.0:5000/?stock=TESLA"
	}
	if (value === "APPL") {
		str = "http://0.0.0.0:5000/?stock=AAPL"
	}
	// console.log(str)
	const promiseMSFT = fetch(str)
		.then(response => response.text())
		.then(data => tsvParse(data, parseData(parseDate)))
	return promiseMSFT;
}
