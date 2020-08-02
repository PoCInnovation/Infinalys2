import React from "react";
import PropTypes from "prop-types";
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";
import { ChartCanvas, Chart } from "react-stockcharts";
import {
	CandlestickSeries,
	BollingerSeries,
	LineSeries,
} from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import {
	MouseCoordinateX,
	MouseCoordinateY,
	CurrentCoordinate,
} from "react-stockcharts/lib/coordinates";
import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import { OHLCTooltip, MovingAverageTooltip, BollingerBandTooltip } from "react-stockcharts/lib/tooltip";
import { ema, sma, bollingerBand } from "react-stockcharts/lib/indicator";
import { fitWidth } from "react-stockcharts/lib/helper";
import { last } from "react-stockcharts/lib/utils";

const bbStroke = {
	top: "#964B00",
	middle: "#000000",
	bottom: "#964B00",
};

const bbFill = "#4682B4";

class CandleStickChartWithBollingerBandOverlay extends React.Component {
	render() {
		const ema20 = ema()
			.options({
				windowSize: 20, // optional will default to 10
				sourcePath: "close", // optional will default to close as the source
			})
			.skipUndefined(true) // defaults to true
			.merge((d, c) => {d.ema20 = c;}) // Required, if not provided, log a error
			.accessor(d => d.ema20) // Required, if not provided, log an error during calculation
			.stroke("blue"); // Optional

		const sma20 = sma()
			.options({ windowSize: 20 })
			.merge((d, c) => {d.sma20 = c;})
			.accessor(d => d.sma20);

		const ema50 = ema()
			.options({ windowSize: 50 })
			.merge((d, c) => {d.ema50 = c;})
			.accessor(d => d.ema50);

		const bb = bollingerBand()
			.merge((d, c) => {d.bb = c;})
			.accessor(d => d.bb);

		const { type, data: initial_data, width, ratio, Boll, EMA_20, EMA_50 ,SMA_20 } = this.props;

		const calculatedData = ema20(sma20(ema50(bb(initial_data)))); // const calculatedData = ema20(sma20(ema50(smaVolume50(bb(initialData)))));
		const xScaleProvider = discontinuousTimeScaleProvider
			.inputDateAccessor(d => d.date);
		const {
			data,
			xScale,
			xAccessor,
			displayXAccessor,
		} = xScaleProvider(calculatedData);
		const start = xAccessor(last(data));
		const end = xAccessor(data[Math.max(0, data.length - 150)]);
		const xExtents = [start, end];
		
		let boolinger;
		if (Boll) {
			boolinger = <BollingerSeries yAccessor={d => d.bb} stroke={bbStroke} fill={bbFill} />
		} else {
			boolinger = <div></div>
		}
		let ema_20;
		let ema_20_cord;
		if (EMA_20) {
			ema_20 = <LineSeries yAccessor={ema20.accessor()} stroke={ema20.stroke()}/>
			ema_20_cord = <CurrentCoordinate yAccessor={ema20.accessor()} fill={ema20.stroke()} />
		} else {
			ema_20 = <div></div>
			ema_20_cord = <div></div>
		}
		let ema_50;
		let ema_50_cord;
		if (EMA_50) {
			ema_50 = <LineSeries yAccessor={ema50.accessor()} stroke={ema50.stroke()}/>
			ema_50_cord = <CurrentCoordinate yAccessor={ema50.accessor()} fill={ema50.stroke()} />
		} else {
			ema_50 = <div></div>
			ema_50_cord = <div></div>
		}
		let sma_20;
		let sma_20_cord;
		if (SMA_20) {
			sma_20 = <LineSeries yAccessor={sma20.accessor()} stroke={sma20.stroke()}/>
			sma_20_cord = <CurrentCoordinate yAccessor={sma20.accessor()} fill={sma20.stroke()} />
		} else {
			sma_20 = <div></div>
			sma_20_cord = <div></div>
		}
		return (
			<ChartCanvas height={400}
				width={width}
				ratio={ratio}
				margin={{ left: 70, right: 70, top: 10, bottom: 30 }}
				type={type}
				seriesName="MSFT"
				data={data}
				xScale={xScale}
				xAccessor={xAccessor}
				displayXAccessor={displayXAccessor}
				xExtents={xExtents}
			>
				<Chart id={1}
					yExtents = {[d => [d.high, d.low], bb.accessor()]}
					onContextMenu={(...rest) => { console.log("chart - context menu", rest); }}
				>
					<XAxis axisAt="bottom" orient="bottom"/>
					<YAxis axisAt="right" orient="right" ticks={5}
						onDoubleClick={(...rest) => { console.log("yAxis - double click", rest); }}
						onContextMenu={(...rest) => { console.log("yAxis - context menu", rest); }}
					/>
					<MouseCoordinateX
						at="bottom"
						orient="bottom"
						displayFormat={timeFormat("%Y-%m-%d")} />
					<MouseCoordinateY
						at="right"
						orient="right"
						displayFormat={format(".2f")} />
					<OHLCTooltip origin={[-40, 0]}/>
					<CandlestickSeries />
					{boolinger}
					{ema_20}
					{ema_20_cord}
					{ema_50}
					{ema_50_cord}
					{sma_20}
					{sma_20_cord}
					<BollingerBandTooltip
						origin={[-38, 60]}
						yAccessor={d => d.bb}
						options={bb.options()} />
					
					
					<MovingAverageTooltip
						onClick={e => console.log(e)}
						origin={[-38, 15]}
						options={[
							{
								yAccessor: sma20.accessor(),
								type: sma20.type(),
								stroke: sma20.stroke(),
								windowSize: sma20.options().windowSize,
							},]}/>
					<MovingAverageTooltip
						onClick={e => console.log(e)}
						origin={[-38, 15]}
						options={[
							{
								yAccessor: sma20.accessor(),
								type: sma20.type(),
								stroke: sma20.stroke(),
								windowSize: sma20.options().windowSize,
							},
							{
								yAccessor: ema20.accessor(),
								type: ema20.type(),
								stroke: ema20.stroke(),
								windowSize: ema20.options().windowSize,
							},
							{
								yAccessor: ema50.accessor(),
								type: ema50.type(),
								stroke: ema50.stroke(),
								windowSize: ema50.options().windowSize,
							},
						]}
					/>
				</Chart>
			</ChartCanvas>
		);
	}
}

CandleStickChartWithBollingerBandOverlay.propTypes = {
	SMA_20: PropTypes.bool.isRequired,
	EMA_20: PropTypes.bool.isRequired,
	EMA_50: PropTypes.bool.isRequired,
	Boll: PropTypes.bool.isRequired,
	data: PropTypes.array.isRequired,
	width: PropTypes.number.isRequired,
	ratio: PropTypes.number.isRequired,
	type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

CandleStickChartWithBollingerBandOverlay.defaultProps = {
	SMA_20: Boolean,
	EMA_20: Boolean,
	EMA_50: Boolean,
	Boll: Boolean,
	type: "svg",
};
CandleStickChartWithBollingerBandOverlay = fitWidth(CandleStickChartWithBollingerBandOverlay);

export default CandleStickChartWithBollingerBandOverlay;
