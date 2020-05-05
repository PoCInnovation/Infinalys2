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

EPOCHS = 10
DATA_SAMPLE = 1000
DATA_VAL = 100
DATA_TRAIN = DATA_SAMPLE - DATA_VAL

def init_data(stocks_path):
    dirs = os.listdir(stocks_path)
    file = dirs[2]
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
    return (open_data, close_data)

def create_model():
    model = tensorflow.keras.models.Sequential()
    model.add(tensorflow.keras.layers.Dense(5, input_shape=(1,)))
    model.add(tensorflow.keras.layers.Dense(1, input_shape=(1,)))

    ##input_layer = tensorflow.keras.layers.Input((1, ))
    ##dense1_layer = tensorflow.keras.layers.Dense(units=1, input_shape=(1,))
    ##output = dense1_layer(input_layer)
    ##model = tensorflow.keras.Model(inputs=input_layer, outputs=output)
    return (model)

def print_predict(predict, real):
    #printing predict
    matplotlib.pyplot.plot(predict, 'r', real, 'b:')
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
    predict = model.predict(close_data[DATA_SAMPLE - DATA_VAL: DATA_SAMPLE])
    real = close_data[DATA_SAMPLE - DATA_VAL:DATA_SAMPLE]
    print(real)
    print("\n\n")
    print(predict)
    print_predict(predict, real)
