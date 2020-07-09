#!/usr/bin/env python3
import warnings
warnings.simplefilter(action='ignore', category=FutureWarning)
import os
import sys
import json
import pandas

from pprint import pprint

from fetch import download_stocks
from manage_stocks import manage_stocks
from predict import predict_on_stocks

PROXIES_PATH = "../assets/proxy_list.txt"
PREDICTIONS_PATH = "./predictions"
MODELS_PATH = "./models"
STOCKS_PATH = "./stocks"
RESULT_PATH = "/tmp"
USAGE = "\nInfinalys: A.I. to make predictions on stocks\n\nUSAGE\n\t./main.py (stock) (interval)\n\tstock: stock symbol to be downloaded\n\tinterval: interval of the stock to be downloaded\n\nEXAMPLE\n\t./main.py APPL 1d "

def create_results(stocks_path: str, preds_path: str, results_path: str):
    dirs = os.listdir(stocks_path)
    for file in dirs:
        stock_filepath = os.path.join(stocks_path, file)
        preds_filepath = os.path.join(preds_path, file)
        stock = pandas.read_csv(stock_filepath, squeeze=True)
        preds = pandas.read_csv(preds_filepath, squeeze=True)

        result = {
            'stocks': {
                'Date': list(stock['Date']),
                'Open': list(stock['Open']),
                'High': list(stock['High']),
                'Low': list(stock['Low']),
                'Close': list(stock['Close']),
                'Volume': list(stock['Volume']),
            },
            'predictions': {
                'Mean': list(preds['Mean']),
                'Volume': list(preds['Volume']),
            }
        }
        file_name = os.path.splitext(file)[0] + '.json'
        result_path = os.path.join(results_path, file_name)
        with open(result_path, 'w') as fp:
            json.dump(result, fp)

def error_handling_arguments(argv: list):
    if len(sys.argv) != 3:
        print(USAGE)
        return True
    if sys.argv[2] != "1d" and sys.argv[2] != "5d" and sys.argv[2] != "1mo":
        print("Argument interval_arg must be either \'1d\', either \'5d\', either \'1mo\'")
        return True
    return False

def main():
    if error_handling_arguments(sys.argv) == True:
        return
    stock_path = download_stocks(sys.argv[1], STOCKS_PATH, None, sys.argv[2])
    if stock_path is None:
        return
    stocks = manage_stocks(stock_path)
    predict_on_stocks(stocks, PREDICTIONS_PATH, MODELS_PATH)
    # create_results(STOCKS_PATH, PREDICTIONS_PATH, RESULT_PATH)

if __name__ == "__main__":
    main()
