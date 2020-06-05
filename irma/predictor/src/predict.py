# Matplotlib
import matplotlib.pyplot
# Tensorflow
import tensorflow
import datetime
# Numpy and Pandas
import numpy
import pandas
# Ohter import
import sys
import os

from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split

EPOCHS = 10
DATA_SAMPLE = 100

def init_data(array):
    open_data = []
    close_data = []
    for i in range(DATA_SAMPLE):
        open_data.append(array[i][1])
        close_data.append(array[i][4])
    open_data = numpy.asarray(open_data)
    close_data = numpy.asarray(close_data)
    return (open_data, close_data)

def normalize_data(x_array, y_array, scaler):
    x_array = numpy.reshape(x_array, (-1, 1))
    x_array = scaler.fit_transform(x_array)
    x_array = numpy.ndarray.flatten(x_array)

    y_array = numpy.reshape(y_array, (-1, 1))
    y_array = scaler.fit_transform(y_array)
    y_array = numpy.ndarray.flatten(y_array)
    return (x_array, y_array)

def denormalize_data(x_array, y_array, scaler):
    x_array = numpy.reshape(x_array, (-1, 1))
    x_array = scaler.inverse_transform(x_array)
    x_array = numpy.ndarray.flatten(x_array)

    y_array = numpy.reshape(y_array, (-1, 1))
    y_array = scaler.inverse_transform(y_array)
    y_array = numpy.ndarray.flatten(y_array)
    return (x_array, y_array)

def create_model():
    model = tensorflow.keras.models.Sequential()
    model.add(tensorflow.keras.layers.Dense(20, input_shape=(1,)))
    model.add(tensorflow.keras.layers.Dense(20, input_shape=(1,)))
    model.add(tensorflow.keras.layers.Dense(1, input_shape=(1,)))
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
    predicted_data = model.predict(x_test)

    predicted_data, real_data = denormalize_data(predicted_data, y_test, scaler)
    x_test, x_test = denormalize_data(x_test, x_test, scaler)
    print_predict(predicted_data, real_data, x_test)

def predict_on_stocks(array: numpy.array, store_path: str, models_path: str):
    scaler = StandardScaler()
    open_data, close_data = init_data(array)

    open_data, close_data = normalize_data(open_data, close_data, scaler)
    x_train, x_test, y_train, y_test = train_test_split(
        open_data, close_data, test_size=0.10, random_state=42
    )

    model, tensorboard_callback = create_model()
    model.fit(x_train, y_train, epochs=EPOCHS, callbacks=[tensorboard_callback])

    test_prediction(model, x_test, y_test, scaler)

