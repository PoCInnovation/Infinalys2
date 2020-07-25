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
MODELS_PATH = "../models"
STOCKS_PATH = "../stocks"
USAGE = "\nInfinalys: A.I. to make predictions on stocks\n\nUSAGE\n\t./main.py (stock) (interval)\n\tstock: stock symbol to be downloaded\n\tinterval: interval of the stock to be downloaded\n\nEXAMPLE\n\t./main.py APPL 1d "

def error_handling_arguments(argv: list):
    if len(sys.argv) != 3:
        print(USAGE)
        return True
    if sys.argv[2] != "1d" and sys.argv[2] != "5d" and sys.argv[2] != "1mo":
        print("Argument interval_arg must be either \'1d\', either \'5d\', either \'1mo\'")
        return True
    return False

def generate_model_on_stock(stock_symbol: str, interval: str):
    stock_path = download_stocks(stock_symbol, STOCKS_PATH, None, interval)
    if stock_path is None:
        return (None)
    stock_data = manage_stocks(stock_path)

    model_path = f'{MODELS_PATH}/model_{stock_symbol}_{interval}'
    if os.path.isdir(model_path) is False:
        predict_on_stocks(stock_data, model_path, interval)

    return (stock_data)

def main():
    if error_handling_arguments(sys.argv) == True:
        return
    generate_model_on_stock(sys.argv[1], sys.argv[2])

if __name__ == "__main__":
    main()
