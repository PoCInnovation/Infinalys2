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

from sklearn.preprocessing import StandardScaler
from joblib import dump
from sklearn.model_selection import train_test_split

from data_utils import *

EPOCHS = 20
NB_INDICATORS = 15

def create_model(model_path):
    model = tensorflow.keras.models.Sequential()
    model.add(tensorflow.keras.layers.Dense(256))
    model.add(tensorflow.keras.layers.Dense(128))
    model.add(tensorflow.keras.layers.Dense(64))
    model.add(tensorflow.keras.layers.Dense(1))

    model.compile(
        loss="mean_squared_error",
        optimizer=tensorflow.keras.optimizers.Adam(lr=1e-3, decay=1e-4),
    )

    #Checkpoint model
    checkpoint_callback = tensorflow.keras.callbacks.ModelCheckpoint(
        model_path, monitor='val_loss', mode='min', save_best_only=True,
        verbose=1, save_weights_only=False, save_freq='epoch'
    )

    return (model, checkpoint_callback)

def print_predict(predict, real, x_test, interval):
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
    x_test = denormalize_data(x_test, x_test, scaler)
    print_predict(predicted_data, real_data, x_test, interval)

def predict_one_interval(model, open_data, scaler):
    open_data = numpy.reshape(open_data, newshape=(1, NB_INDICATORS - 1))
    close_data = model.predict(open_data)
    (close_data, close_data) = denormalize_data(close_data, close_data, scaler)
    return numpy.array(close_data)

def predict_on_stocks(array: numpy.array, model_path: str, interval: str):
    scaler = StandardScaler()
    open_data, close_data = init_data(array)

    open_data, close_data = normalize_data(open_data, close_data, scaler, NB_INDICATORS)
    (x_train, y_train, x_test, y_test) = split_data(open_data, close_data)
    (x_train, y_train) = shuffle_data(x_train, y_train)

    (model, checkpoint_callback) = create_model(model_path)
    model.fit(
        x_train, y_train, validation_data=(x_test, y_test), batch_size=64,
        epochs=EPOCHS, callbacks=[checkpoint_callback]
    )

    #test_model(model, x_test, y_test, scaler, interval)

    dump(scaler, f'{model_path}/std_scaler.bin', compress=True)
