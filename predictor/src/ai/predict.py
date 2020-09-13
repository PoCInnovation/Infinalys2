# Ohter import
import sys
import os
# Matplotlib
import matplotlib.pyplot
# Tensorflow
import tensorflow
import datetime
# Numpy and Pandas
import numpy
import pandas
import math
# Csv file manipulatons
import csv
#import time

from sklearn.preprocessing import StandardScaler
from joblib import dump
from sklearn.model_selection import train_test_split
from data_utils import normalize_data, denormalize_data, init_data, split_data, shuffle_data
from datetime import date, time, timedelta
from manage_stocks import add_indicator, add_indicators_to_predict
from stockstats import StockDataFrame

EPOCHS = 35
NB_INDICATORS = 15
TIME_BY_INTERVAL = numpy.array([
        ('1m', timedelta(minutes=1)),
        ('2m', timedelta(minutes=2)),
        ('5m', timedelta(minutes=5)),
        ('15m', timedelta(minutes=15)),
        ('30m', timedelta(minutes=30)),
        ('60m', timedelta(minutes=60)),
        ('90m', timedelta(minutes=90)),
        ('1h', timedelta(hours=1)),
        ('1d', timedelta(days=1)),
        ('5d', timedelta(days=5)),
        ('1wk', timedelta(weeks=1)),
        ('1mo', timedelta(weeks=4)),
        ('3mo', timedelta(weeks=12))
])

def custom_loss_function(y_actual, y_predicted):
    #print('y_actual:', y_actual)
    #print('y_predicted', y_predicted)
    #tensorflow.print('y_actual', y_actual)
    #tensorflow.print('y_predicted', y_predicted)
    #time.sleep(1)
    custom_loss_value=tensorflow.keras.backend.mean(tensorflow.keras.backend.sum(tensorflow.keras.backend.square((y_actual - y_predicted)/10)))
    return custom_loss_value

def create_model(model_path):
    model = tensorflow.keras.models.Sequential()
    model.add(tensorflow.keras.layers.Dense(256))
    model.add(tensorflow.keras.layers.Dense(128))
    model.add(tensorflow.keras.layers.Dense(64))
    model.add(tensorflow.keras.layers.Dense(6))

    model.compile(
        loss=tensorflow.keras.losses.MeanSquaredError(),
        optimizer=tensorflow.keras.optimizers.Adam(lr=1e-3, decay=1e-4),
    )

    #Checkpoint model
    checkpoint_callback = tensorflow.keras.callbacks.ModelCheckpoint(
        model_path, monitor='val_loss', mode='min', save_best_only=True,
        verbose=1, save_weights_only=False, save_freq='epoch'
    )

    return (model, checkpoint_callback)

def print_predict(predict, real, interval):
    """printing predict"""
    matplotlib.pyplot.plot(predict, 'r')
    matplotlib.pyplot.plot(real, 'b')
    matplotlib.pyplot.title('Predict')
    matplotlib.pyplot.xlabel(f'interval {interval}')
    matplotlib.pyplot.ylabel('Close Price')
    matplotlib.pyplot.show()

def test_model(model, x_test, y_test, scaler, interval):
    predicted_data = model.predict(x_test)
    predicted_data, real_data = denormalize_data(predicted_data, y_test, scaler)
    print_predict(predicted_data, real_data, interval)

def predict_one_interval(model, open_data, scaler):
    open_data = numpy.reshape(open_data, (-1, NB_INDICATORS))

    close_data = model.predict(open_data)
    close_data = scaler.inverse_transform(close_data)
    return close_data

def get_time_to_add(nb_calls, interval):
    #TODO use magic array ""
    add_time = 0

    for intervals in TIME_BY_INTERVAL:
        if (intervals[0] == interval):
            add_time = intervals[1] + datetime.timedelta(days=nb_calls)
    return (datetime.date.today() + add_time)

def write_predict(stock_path, close_data, interval):
    write_predict.nb_calls += 1

    time_to_add = get_time_to_add(write_predict.nb_calls, interval)

    with open(stock_path, 'a+') as file:
        writer = csv.DictWriter(file, fieldnames=['Date', 'Open', 'High', 'Low', 'Close', 'Adj Close', 'Volume'])
        data_to_write = {
            'Date' : time_to_add.strftime("%Y-%m-%d"),
            'Open' : close_data[0],
            'High' : close_data[1],
            'Low' : close_data[2],
            'Close' : close_data[3],
            'Adj Close' : close_data[4],
            'Volume' : close_data[5]
        }
        writer.writerow(data_to_write)
write_predict.nb_calls = 0

def predict_multiple_intervals(model, open_data, scaler, stock_path, interval, nb_intervals):
    if nb_intervals is 0:
        return numpy.empty((0, NB_INDICATORS))

    open_data = numpy.reshape(open_data, (-1, NB_INDICATORS))

    close_data = model.predict(open_data)
    data_to_write = scaler.inverse_transform(close_data)
    data_to_write = numpy.ndarray.flatten(data_to_write)
    data_to_write[0] = (numpy.ndarray.flatten(scaler.inverse_transform(open_data[0][0:6])))[3]

    write_predict(stock_path, data_to_write, interval)
    close_data = add_indicators_to_predict(stock_path)

    close_data = numpy.reshape(close_data, (-1, NB_INDICATORS))
    close_data = numpy.ndarray.flatten(StandardScaler().fit_transform(close_data))

    return numpy.vstack(
        (close_data,
        predict_multiple_intervals(model, close_data, scaler, stock_path, interval, nb_intervals - 1))
    )

def predict_on_stocks(array: numpy.array, model_path: str, interval: str, stock_path: str):
    scaler = StandardScaler()
    open_data, close_data = init_data(array)

    open_data, close_data = normalize_data(open_data, close_data, scaler)

    (x_train, y_train, x_test, y_test) = split_data(open_data, close_data)
    (x_train, y_train) = shuffle_data(x_train, y_train)

    (model, checkpoint_callback) = create_model(model_path)
    model.fit(
        x_train, y_train, validation_data=(x_test, y_test), batch_size=64,
        epochs=EPOCHS, callbacks=[checkpoint_callback]
    )

    #test_model(model, x_test, y_test, scaler, interval)
    #print('x_test: ', scaler.inverse_transform(x_test[len(x_test) - 1][0:6]))
    #toto = predict_multiple_intervals(model, x_test[len(x_test) - 1], scaler, stock_path, '1mo', 3)
    #print(toto)

    dump(scaler, f'{model_path}/std_scaler.bin', compress=True)
