# Infinalys2

Infinalys2 is the successor of the [Infinalys project](https://github.com/PoCFrance/Infinalys) which was an IA model to predict the evolution of stock markets.

## Installation

### In the `predictor` folder, install the python modules:
```bash
pip install --user yfinance pandas stockstats tensorflow matplotlib
```
### In the `front` folder, install the node modules:
```bash
cd front
npm install
npm start
```

## Overview

In the `src` folder and run `main.py`
```
./main.py <stock> <interval>
OR
python3 main.py <stock> <interval>
```

**stock**: stock symbol to be downloaded
**interval**: interval of the stock to be downloaded (1d, 5d, 1wk, 1mo, 3mo)

### Examples
```
./main.py APPL 1d
./main.py OIL 5d
./main.py AMZN 1mo
```

### Customisation

In the `companies.csv` you got a list of the Best 506 companies in the trading market.  
You can copy in this file somme companies and put them into the file `companies_test` to evaluate them.  
The result of the fetch of `companies_test` is put into the `stock` file

## Built With

* [yahoo-finance-api](https://github.com/topics/yahoo-finance-api) - Fetch framework used
* [stock-stats](https://github.com/jealous/stockstats) - Stocks indicators calculator
* [stockCharts](https://github.com/rrag/react-stockcharts) - chart lib in react
* [materialUI](https://material-ui.com/) - graphical framework in react


## Authors

 - [Alexandre Chétrit](https://github.com/chetrit)
 - [Coline Seguret](https://github.com/Cleopha)
 - [Grégoire Brasseur](https://github.com/lerimeur)
