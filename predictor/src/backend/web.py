#!/usr/bin/env python3

from flask import Flask, jsonify, request, send_file, render_template
from flask_cors import CORS, cross_origin
from sklearn.preprocessing import StandardScaler
from joblib import load

from flask_wtf import FlaskForm
from flask_cors import CORS, cross_origin
from wtforms import SelectField

import tensorflow
import numpy
import math

import sys
sys.path.insert(1, '../ai')

from main import generate_model_on_stock
from predict import predict_one_interval, predict_multiple_intervals
from list_to_tsv import list_to_tsv
from data_utils import normalize_data, delete_nans_in_data
from predict import custom_loss_function

app = Flask(__name__)
cors = CORS(app)

cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

app.config['SECRET_KEY'] = 'secret'
app.config['CORS_HEADER'] = 'Content-Type'

HOST = "0.0.0.0"
PORT = 8080
DEBUG = True

MODELS_PATH = "../../saves/models"
STOCKS_PATH = "../../saves/stocks"
TSV_PATH = "../../saves/tsv"
NB_INDICATORS = 15

class Form(FlaskForm):
    interval = SelectField('interval', choices=['1m', '2m', '5m', '15m', '30m', '60m', '90m','1h', '1d', '5d', '1wk', '1mo', '3mo'])
    nb_interval = SelectField('nb_interval', choices=[1, 2, 3])

def get_nb_interval():
    nb_interval = None
    if request.args.get("nb_interval") is None:
        nb_interval = 1
    else:
        nb_interval = str(request.args["nb_interval"])
    return (nb_interval)

def get_interval():
    interval = None
    if request.args.get("interval") is None:
        interval = "1mo"
    else:
        interval = str(request.args["interval"])
    return (interval)

def prediction_ia(stock_symbol, interval, model_path, nb_interval):
    stocks_data = generate_model_on_stock(stock_symbol, interval)
    scaler = load(f'{model_path}/std_scaler.bin')
    model = tensorflow.keras.models.load_model(model_path)
    new_scaler = StandardScaler()

    stocks = delete_nans_in_data(stocks_data)
    stocks = new_scaler.fit_transform(stocks)
    stock = stocks[len(stocks) - 1]

    stock_path = f'{STOCKS_PATH}/{stock_symbol}_{interval}.csv'

    predict_multiple_intervals(model, stock, scaler, stock_path, interval, nb_interval)

def get_info(stock_symbol, interval, nb_interval):
    model_path = f'{MODELS_PATH}/model_{stock_symbol}_{interval}'

    prediction_ia(stock_symbol, interval, model_path, nb_interval)

    list_to_tsv(stock_symbol, interval)

@cross_origin()
@app.route("/", methods=["GET", "POST"])
@cross_origin()
def backend():
    interval = get_interval()
    nb_interval = get_nb_interval()
    form = Form()
    if request.args.get('stock') is not None:
        stock_symbol = str(request.args['stock'])
        get_info(stock_symbol, interval, int(nb_interval))
        return (send_file(f'{TSV_PATH}/{stock_symbol}_{interval}.tsv', as_attachment=True))
    try:
        stock_symbol = request.form.get('Stock')
        interval = request.form.get('interval')
        nb_interval = request.form.get('nb_interval')
        get_info(stock_symbol, interval, int(nb_interval))
        return (send_file(f'{TSV_PATH}/{stock_symbol}_{interval}.tsv', as_attachment=True))
    except:
        return render_template('index.html', form=form)

if __name__ == "__main__":
    app.run(host=HOST, debug=DEBUG)