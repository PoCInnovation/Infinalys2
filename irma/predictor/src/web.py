#!/usr/bin/env python3

from flask import Flask, jsonify, request
import tensorflow
import numpy
import math
import simplejson as json

from main import *
from predict import *
from data_utils import *

app = Flask(__name__)

HOST = "0.0.0.0"
PORT = 8080
DEBUG = True

MODELS_PATH = "../models"
NB_INDICATORS = 15

# print("\033[34;01m", array.shape, "\033[00m\n")
# print("\033[34;01m", open_data, "\033[00m\n")

def reshape_data(array: numpy.array, scaler):
    (data, data_t) = normalize_data(array, array, scaler, NB_INDICATORS + 1)
    open_data = data[len(data) - 1]
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

@app.route("/", methods=["GET", "POST"])
def hello():
    finance = ""
    model = 0
    duration = "1mo"

    if request.args.get("finance") is not None:
        try:
            scaler = StandardScaler()
            finance = str(request.args["finance"])
            duration = str(request.args["duration"])
            model_path = f'{MODELS_PATH}/model_{finance}_{duration}'

            stocks_data = generate_model_on_stock(finance, duration)
            stocks = reshape_data(stocks_data, scaler)
            stocks_data = transform_nan(stocks_data)

            model = tensorflow.keras.models.load_model(model_path)
            predict = predict_one_interval(model, stocks, scaler, duration)

            predict = predict.tolist()
            stocks_data = stocks_data + predict
        except:
            return ("Error")
    return jsonify(stocks_data)

if __name__ == "__main__":
    app.run(host=HOST, debug=DEBUG)
