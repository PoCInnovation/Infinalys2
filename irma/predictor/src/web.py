#!/usr/bin/env python3

from flask import Flask, jsonify, request, send_file
import tensorflow
import numpy
import math

from main import *
from predict import *
from data_utils import *
from list_to_tsv import *

app = Flask(__name__)

HOST = "0.0.0.0"
PORT = 8080
DEBUG = True

MODELS_PATH = "../models"
NB_INDICATORS = 15

def prepare_prediction(array: numpy.array):
    scaler = StandardScaler()
    array = normalize_data(array, array, scaler, NB_INDICATORS + 1)[0]
    open_data = array[len(array) - 1]
    open_data[1] = open_data[4]
    open_data = numpy.delete(open_data, 4, 0)
    return (open_data)

def transform_nan(stocks_data: numpy.array):
    stocks_data = stocks_data.tolist()
    for y in range(len(stocks_data)):
        for i in range(len(stocks_data[y])):
            if math.isnan(stocks_data[y][i]):
                stocks_data[y][i] = None
    return (stocks_data)

def get_interval():
    interval = None
    if request.args.get("interval") is None:
        interval = "1mo"
    else:
        interval = str(request.args["interval"])
    return (interval)

@app.route("/", methods=["GET"])
def hello():
    stock_symbol = None
    model = None
    interval = get_interval()

    if request.args.get("stock") is not None:
        stock_symbol = str(request.args["stock"])
        model_path = f'{MODELS_PATH}/model_{stock_symbol}_{interval}'

        (stocks_data, scaler) = generate_model_on_stock(stock_symbol, interval)
        to_predict_data = numpy.array(prepare_prediction(stocks_data))
        stocks_data = numpy.array(stocks_data)

        model = tensorflow.keras.models.load_model(model_path)
        predict = predict_one_interval(model, to_predict_data, scaler).tolist()

        stocks_data = numpy.delete(stocks_data, numpy.s_[7:NB_INDICATORS - 1], axis=1)
        stocks_data = numpy.array(transform_nan(stocks_data))
        stocks_data = stocks_data.tolist() + predict

        list_to_tsv(stocks_data)
        return (send_file("output.tsv", as_attachment=True))
    else:
        return jsonify('Please enter a stock symbol and an interval in the URL')

if __name__ == "__main__":
    app.run(host=HOST, debug=DEBUG)
