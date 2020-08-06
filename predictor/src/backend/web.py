#!/usr/bin/env python3

from flask import Flask, jsonify, request, send_file, render_template
from sklearn.preprocessing import StandardScaler
from joblib import load

from flask_wtf import FlaskForm
from wtforms import SelectField

import tensorflow
import numpy
import math

import sys
sys.path.insert(1, '../ai')

from main import generate_model_on_stock
from predict import predict_one_interval
from list_to_tsv import list_to_tsv
from data_utils import normalize_data

app = Flask(__name__)

app.config['SECRET_KEY'] = 'secret'

HOST = "0.0.0.0"
PORT = 8080
DEBUG = True

MODELS_PATH = "../../saves/models"
TSV_PATH = "../../saves/tsv"
NB_INDICATORS = 15

class Form(FlaskForm):
    interval = SelectField('interval', choices=['1m', '2m', '5m', '15m', '30m', '60m', '90m','1h', '1d', '5d', '1wk', '1mo', '3mo'])

def prepare_prediction(array: numpy.array):
    scaler = StandardScaler()
    array = normalize_data(array, array, scaler, NB_INDICATORS + 1)[0]
    open_data = array[len(array) - 1]
    open_data[1] = open_data[4]
    open_data = numpy.delete(open_data, 4, 0)

    return (open_data)

def get_interval():
    interval = None
    if request.args.get("interval") is None:
        interval = "1mo"
    else:
        interval = str(request.args["interval"])
    return (interval)

def prediction_ia(stock_symbol, interval, model_path):
    print('here')
    stocks_data = generate_model_on_stock(stock_symbol, interval)
    scaler = load(f'{model_path}/std_scaler.bin')
    model = tensorflow.keras.models.load_model(model_path)

    prediction = predict_one_interval(
        model,
        numpy.array(prepare_prediction(stocks_data)),
        scaler
    )
    return (prediction)

def get_info(stock_symbol, interval):
    model_path = f'{MODELS_PATH}/model_{stock_symbol}_{interval}'

    prediction = prediction_ia(stock_symbol, interval, model_path)

    prediction_list = [0, 0, 0, 0, 0, 0]
    prediction_list[4] = prediction[0]

    list_to_tsv(stock_symbol, interval, prediction_list)

@app.route("/", methods=["GET", "POST"])
def backend():
    interval = get_interval()
    form = Form()
    if request.args.get('stock') is not None:
        stock_symbol = str(request.args['stock'])
        get_info(stock_symbol, interval)
        return (send_file(f'{TSV_PATH}/{stock_symbol}_{interval}.tsv', as_attachment=True))
    try:
        stock_symbol = request.form.get('Stock')
        interval = request.form.get('interval')
        get_info(stock_symbol, interval)
        return (send_file(f'{TSV_PATH}/{stock_symbol}_{interval}.tsv', as_attachment=True))
    except:
        return render_template('index.html', form=form)

if __name__ == "__main__":
    app.run(host=HOST, debug=DEBUG)
