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
numpy.set_printoptions(threshold=sys.maxsize)
import pandas
import math

from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split

from data_utils import *

EPOCHS = 20
NB_INDICATORS = 15
BATCH_SIZE = 9

def create_model(x_train):
    model = tensorflow.keras.models.Sequential()

    model.add(tensorflow.keras.layers.LSTM(256))
    model.add(tensorflow.keras.layers.Dropout(0.2))
    model.add(tensorflow.keras.layers.Dense(256))
    model.add(tensorflow.keras.layers.Dense(128))
    model.add(tensorflow.keras.layers.Dense(64))
    model.add(tensorflow.keras.layers.Dense(1))
    model.compile(
        loss="mean_squared_error",
        optimizer=tensorflow.keras.optimizers.Adam(0.1),
    )
    #TenserBoard
    log_dir = "logs/fit/" + datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
    tensorboard_callback = tensorflow.keras.callbacks.TensorBoard(log_dir=log_dir, histogram_freq=1)
    #EndTenserBoard
    return (model, tensorboard_callback)

def print_predict(predict, real, x_test):
    """printing predict"""
    '''use x_test in plot if you want the comparative plot'''
    matplotlib.pyplot.plot(predict, 'r')
    matplotlib.pyplot.plot(real, 'b')
    matplotlib.pyplot.title('Predict')
    matplotlib.pyplot.xlabel('Days')
    matplotlib.pyplot.ylabel('Close Price')
    matplotlib.pyplot.show()

def test_prediction(model, x_test, y_test, scaler):
    print(x_test.shape, y_test.shape)
    predicted_data = model.predict(x_test)
    print(predicted_data.shape)
    (x_test, y_test) = unbatch_data(x_test, y_test)
    predicted_data, real_data = denormalize_data(predicted_data, y_test, scaler)
    x_test, x_test = denormalize_data(x_test, x_test, scaler)
    print(predicted_data.shape, real_data.shape, x_test.shape)
    print_predict(predicted_data, real_data, x_test)


def predict_on_stocks(array: numpy.array, store_path: str, models_path: str):
    scaler = StandardScaler()
    open_data, close_data = init_data(array)

    open_data, close_data = normalize_data(open_data, close_data, scaler)

    (x_train, y_train, x_test, y_test) = split_data(open_data, close_data)
    #(x_train, y_train) = shuffle_data(x_train, y_train)
    (x_train, y_train) = batch_data(x_train, y_train)
    (x_test, y_test) = batch_data(x_test, y_test)

    #print('ints:', len(x_train), len(x_test))
    #x_train = numpy.reshape(x_train, (int(len(x_train) / 2), BATCH_SIZE, NB_INDICATORS - 1))
    #x_test = numpy.reshape(x_test, (int(len(x_test) / 2), BATCH_SIZE, NB_INDICATORS - 1))
    #print('shapes:', x_train.shape, x_test.shape)
    #y_train = numpy.reshape(y_train, (-1, BATCH_SIZE))
    #y_test = numpy.reshape(y_test, (-1, BATCH_SIZE))

    print(x_train.shape, y_train.shape, x_test.shape, y_test.shape)
    '''in this function, the model takes NB_INDICATORS - 1 columns
    and try to predict one data (in this spot the close price of the daily candle)'''
    model, tensorboard_callback = create_model(x_train)
    model.fit(x_train, y_train, batch_size=9, epochs=EPOCHS, callbacks=[tensorboard_callback])
    test_prediction(model, x_test, y_test, scaler)