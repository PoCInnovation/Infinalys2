#!/usr/bin/env python3

from flask import Flask, jsonify, request, send_file
from sklearn.preprocessing import StandardScaler
from joblib import load

import tensorflow
import numpy
import math

from main import generate_model_on_stock
from predict import predict_one_interval
from list_to_tsv import list_to_tsv
from data_utils import normalize_data

app = Flask(__name__)

HOST = "0.0.0.0"
PORT = 8080
DEBUG = True

MODELS_PATH = "../models"
TSV_PATH = "../tsv"
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
    return (numpy.array(stocks_data))

def get_interval():
    interval = None
    if request.args.get("interval") is None:
        interval = "1mo"
    else:
        interval = str(request.args["interval"])
    return (interval)

@app.route("/", methods=["GET"])
def backend():
    interval = get_interval()

    if request.args.get('stock') is not None and request.args.get('interval') is not None:
        stock_symbol = str(request.args['stock'])
        model_path = f'{MODELS_PATH}/model_{stock_symbol}_{interval}'

        stocks_data = generate_model_on_stock(stock_symbol, interval)
        scaler = load(f'{model_path}/std_scaler.bin')
        model = tensorflow.keras.models.load_model(model_path)

        prediction = predict_one_interval(
            model,
            numpy.array(prepare_prediction(stocks_data)),
            scaler
        )

        stocks_data = transform_nan(
            numpy.delete(
                stocks_data, numpy.s_[7:NB_INDICATORS - 1], axis=1
            )
        ).tolist()

        prediction_list = [0, 0, 0, 0, 0, 0]
        prediction_list[4] = prediction[0]

        list_to_tsv(stock_symbol, interval, prediction_list)
        return (send_file(f'{TSV_PATH}/{stock_symbol}_{interval}.tsv', as_attachment=True))
    else:
        return jsonify('Please enter a stock symbol and an interval in the URL')

if __name__ == "__main__":
    app.run(host=HOST, debug=DEBUG)
