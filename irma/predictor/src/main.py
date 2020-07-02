#!/usr/bin/env python3
import warnings
warnings.simplefilter(action='ignore', category=FutureWarning)
import os
import sys
import json
import pandas
from fetch import download_stocks
from manage_stocks import manage_stocks
from predict import predict_on_stocks

COMPANIES_PATH = "../assets/companies.csv"
TEST_COMPANIES_PATH = "../assets/companies_test.csv"
PROXIES_PATH = "../assets/proxy_list.txt"
PREDICTIONS_PATH = "./predictions"
MODELS_PATH = "./models"
STOCKS_PATH = "./stocks"
RESULT_PATH = "/tmp"

from pprint import pprint
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

def main():
    if len(sys.argv) == 2 and sys.argv[1] != "1d" and sys.argv[1] != "5d" and sys.argv[1] != "1mo":
        print("Argument interval_arg must be either \'1d\', either \'5d\', either \'1mo\'")
        return
    download_stocks(
        TEST_COMPANIES_PATH,
        STOCKS_PATH,
        max_dl = 100,
        interval_arg = "1d" if (len(sys.argv) != 2 or (sys.argv[1] != "5d" and sys.argv[1] != "1mo")) else sys.argv[1]
    )
    stocks = manage_stocks(STOCKS_PATH)
    predict_on_stocks(stocks, PREDICTIONS_PATH, MODELS_PATH)
    # create_results(STOCKS_PATH, PREDICTIONS_PATH, RESULT_PATH)

if __name__ == "__main__":
    main()
