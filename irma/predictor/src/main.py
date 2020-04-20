#!/usr/bin/env python3
import os
import json
import pandas as pd
from fetch import download_stocks
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
        stock = pd.read_csv(stock_filepath, squeeze=True)
        preds = pd.read_csv(preds_filepath, squeeze=True)

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


if __name__ == "__main__":
    download_stocks(TEST_COMPANIES_PATH, STOCKS_PATH, max_dl=100)
    predict_on_stocks(STOCKS_PATH, PREDICTIONS_PATH, MODELS_PATH)
    create_results(STOCKS_PATH, PREDICTIONS_PATH, RESULT_PATH)
