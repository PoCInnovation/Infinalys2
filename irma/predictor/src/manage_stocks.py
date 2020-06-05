import os
import pandas
import numpy
from stockstats import StockDataFrame

INDICATORS = ['change', 'boll_ub', 'boll_lb']

def add_indicator(array, values):
    bools = []
    for i in range(array.shape[0]):
        bools.append(values[i])
    array = numpy.array(array)
    array.resize((array.shape[0], array.shape[1] + 1))
    for i in range(array.shape[0]):
        array[i][array.shape[1] - 1] = bools[i]
    return array

def manage_stocks(stocks_path: str):
    file = os.listdir(stocks_path)[1]
    stock = pandas.read_csv(os.path.join(stocks_path, file))
    stock_stats = StockDataFrame.retype(stock)
    array = stock.to_numpy()
    for i in range(len(INDICATORS)):
        array = add_indicator(array, stock_stats.get(INDICATORS[i]).to_numpy())
    numpy.set_printoptions(formatter={'float': '{: 0.5f}'.format})
    return array