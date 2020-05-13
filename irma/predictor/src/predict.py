# Matplotlib
import matplotlib.pyplot
# Tensorflow
import tensorflow
# Numpy and Pandas
import numpy
import pandas
# Ohter import
import sys
import os

from sklearn.preprocessing import StandardScaler

EPOCHS = 1
DATA_SAMPLE = 1000
DATA_VAL = 50

def init_data(stocks_path):
    dirs = os.listdir(stocks_path)
    file = dirs[1]
    data = pandas.read_csv(os.path.join(stocks_path, file)).to_numpy()
    open_data = []
    close_data = []
    for i in range(DATA_SAMPLE):
        open_data.append(data[i][1])
    for i in range(DATA_SAMPLE):
        close_data.append(data[i][1])
    open_data = numpy.asarray(open_data)
    close_data = numpy.asarray(close_data)
    return (open_data, close_data)

def normalize_data(open_data, close_data):
    open_data = numpy.divide(numpy.subtract(open_data, (
        numpy.sum(open_data) / DATA_SAMPLE)), numpy.nanstd(open_data))
    close_data = numpy.divide(numpy.subtract(close_data, (
        numpy.sum(close_data) / DATA_SAMPLE)), numpy.nanstd(close_data))
    return (open_data, close_data)

def create_model():
    input_layer = tensorflow.keras.layers.Input((1, ))
    dense1_layer = tensorflow.keras.layers.Dense(units=1,input_shape=(1,))
    output = dense1_layer(input_layer)
    model = tensorflow.keras.Model(inputs=input_layer,outputs=output)
    return (model)

def print_predict(predict, real):
    #printing predict
    matplotlib.pyplot.plot(predict, 'r')
    matplotlib.pyplot.plot(real, 'b:')
    matplotlib.pyplot.title("Predict")
    matplotlib.pyplot.show()

def predict_on_stocks(stocks_path: str, store_path: str, models_path: str):
    open_data, close_data = init_data(stocks_path)
    open_data, close_data = normalize_data(open_data, close_data)

    model = create_model()
    #model.summary()
    model.compile(
        loss="mean_squared_error",
        optimizer=tensorflow.keras.optimizers.Adam(0.1),
    )
    history = model.fit(open_data[0:DATA_SAMPLE - DATA_VAL], close_data[0:DATA_SAMPLE - DATA_VAL], epochs=EPOCHS)
    predict = model.predict(open_data[DATA_SAMPLE - DATA_VAL:DATA_SAMPLE])
    real = close_data[DATA_SAMPLE - DATA_VAL:DATA_SAMPLE]
    print_predict(predict, real)
