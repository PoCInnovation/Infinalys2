import os
import pandas
import numpy
from stockstats import StockDataFrame

def manage_stocks(stocks_path: str):
    file = os.listdir(stocks_path)[1]
    stock = pandas.read_csv(os.path.join(stocks_path, file))
    stock_numpy_array = stock.to_numpy()
    stock_stats = StockDataFrame.retype(stock)
