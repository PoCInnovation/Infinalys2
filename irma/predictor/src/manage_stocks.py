import os
import pandas
import numpy
from stockstats import StockDataFrame

INDICATORS = ['change', 'boll_ub', 'boll_lb', 'rsi_6']

def add_indicator(array, values):
    bools = []
    for i in range(array.shape[0]):
        bools.append(values[i])
    array = numpy.array(array)
    array.resize((array.shape[0], array.shape[1] + 1))
    for i in range(array.shape[0]):
        array[i][array.shape[1] - 1] = bools[i]
    return array

def manage_stocks(stock_path: str):
    stock = pandas.read_csv(stock_path)
    stock_stats = StockDataFrame.retype(stock)
    array = stock.to_numpy()
    for i in range(len(INDICATORS)):
        array = add_indicator(array, stock_stats.get(INDICATORS[i]).to_numpy())
    return array