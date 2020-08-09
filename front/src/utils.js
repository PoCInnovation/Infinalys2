import { tsvParse} from "d3-dsv";
import { timeParse } from "d3-time-format";

var parseDate = timeParse("%Y-%m-%d");

function parseData(parse) {
	return function(d) {
		d.date = parseDate(d.Date);
		// var curentday = new Date()
		// if (curentday < d.date) {
		// 	console.log(curentday)
		// 	console.log(d.date)
		// }
		d.open = +d.Open;
		d.high = +d.High;
		d.low = +d.Low;
		d.close = +d.Close;
		d.volume = +d.Volume;
		if (d.volume === 0) {
			console.log(d)
		}
		return d;
	};
}


//https://cdn.rawgit.com/rrag/react-stockcharts/master/docs/data/MSFT.tsv 
//http://0.0.0.0:5000/?stock=AAPL&interval=3mo

export function getData(trade, day) {
	var str = ""

	if (trade === "SBUX") {
		if (day === "1d") {
			str = "http://0.0.0.0:5000/?stock=SBUX&interval=1d"
		}
		if (day === "1wk") {
			str = "http://0.0.0.0:5000/?stock=SBUX&interval=1wk"
		}
		if (day === "1mo") {
			str = "http://0.0.0.0:5000/?stock=SBUX&interval=1mo"
		}
	}

	if (trade === "GOOGL") {
		if (day === "1d") {
			str = "http://0.0.0.0:5000/?stock=GOOGL&interval=1d"
		}
		if (day === "1wk") {
			str = "http://0.0.0.0:5000/?stock=GOOGL&interval=1wk"
		}
		if (day === "1mo") {
			str = "http://0.0.0.0:5000/?stock=GOOGL&interval=1mo"
		}
	}

	if (trade === "AMZN") {
		if (day === "1d") {
			str = "http://0.0.0.0:5000/?stock=AMZN&interval=1d"
		}
		if (day === "1wk") {
			str = "http://0.0.0.0:5000/?stock=AMZN&interval=1wk"
		}
		if (day === "1mo") {
			str = "http://0.0.0.0:5000/?stock=AMZN&interval=1mo"
		}
	}
	
	if (trade === "^FCHI") {
		if (day === "1d") {
			str = "http://0.0.0.0:5000/?stock=^FCHI&interval=1d"
		}
		if (day === "1wk") {
			str = "http://0.0.0.0:5000/?stock=^FCHI&interval=1wk"
		}
		if (day === "1mo") {
			str = "http://0.0.0.0:5000/?stock=^FCHI&interval=1mo"
		}
	}

	const promiseMSFT = fetch(str)
		.then(response => response.text())
		.then(data => tsvParse(data, parseData(parseDate)))
	return promiseMSFT;
}
