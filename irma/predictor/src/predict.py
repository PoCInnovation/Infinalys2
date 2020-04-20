import os
import sys
import numpy as np
import pandas as pd
from tensorflow import keras

from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM
from tensorflow.keras.layers import Dense
from tensorflow.keras.layers import Dropout
from tensorflow.keras.layers import RepeatVector
from tensorflow.keras.layers import TimeDistributed

EPOCHS = 1
LOOKBACK = 20
PREDICT = 4
LOADING = (',-\'', '---', '\'-,', ' | ')
LEN_LOADING = len(LOADING)


def print_advancement(file: str, curr: int, total: int):
    """Prints an advancement info of the predict_on_stocks function"""

    print('\r\x1b[2K', end='')
    print(f'[{LOADING[curr % LEN_LOADING]}]', end='')
    current_percent = round((curr / total) * 20)
    advancement = '\033[0;37;44m \033[0;0;0m' * \
        current_percent + '_' * (20 - current_percent)
    print(f'{advancement}| ', end='')
    print(f'Predicting on file {file} ...', end='', flush=True)


def filter_data(raw_data: np.ndarray) -> np.ndarray:
    """Filters a stocks np array to keep wanted parameters"""

    # shape[0] is the mean of [open, high, low, close, adj_close]
    # and shape[1] is the volumes
    shape = (len(raw_data), 2)
    data = np.ndarray(shape)

    for i in range(len(raw_data)):
        row = raw_data[i]
        mean = (row[1] + row[2] + row[3] + row[4] + row[5]) / 5
        data[i] = np.array((mean, row[6]))

    return data


def normalize_data(data: np.ndarray) -> np.ndarray:
    """Normalizes the stocks data."""

    data = np.swapaxes(data, 0, 1)
    for i in range(len(data)):
        data[i] = (data[i] - min(data[i])) / (max(data[i]) - min(data[i]))
    data = np.swapaxes(data, 0, 1)
    return data


def get_model(n_steps_in: int, n_steps_out: int, n_features: int):
    """Defines LSTM model"""

    model = Sequential()
    model.add(LSTM(200, activation='relu', input_shape=(n_steps_in, n_features)))
    model.add(RepeatVector(n_steps_out))
    model.add(Dropout(0.3))
    model.add(LSTM(200, activation='relu', return_sequences=True))
    model.add(TimeDistributed(Dense(n_features)))
    model.compile(optimizer='adam', loss='mse')
    return model


def split_sequences(sequences, n_steps_in, n_steps_out):
    X, y = list(), list()
    for i in range(len(sequences)):
        end_ix = i + n_steps_in
        out_end_ix = end_ix + n_steps_out
        if out_end_ix > len(sequences):
            break
        seq_x, seq_y = sequences[i:end_ix, :], sequences[end_ix:out_end_ix, :]
        X.append(seq_x)
        y.append(seq_y)
    return np.array(X), np.array(y)


def predict_on_stocks(stocks_path: str, store_path: str, models_path: str):
    """Write predictions of stocks_path files to store_path

    Args:
        stocks_path: Path where the known stocks are stored (dataset)
        store_path: Path where to store the predictions
        models_path: Path where to store the trained models

    Example:
        >>> predict_on_stocks('./stocks', './predictions', './models')
    """

    import logging
    # removes any tf warining
    logging.disable(logging.WARNING)
    os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"

    dirs = os.listdir(stocks_path)
    nb_predictions = len(dirs)

    n_steps_in, n_steps_out = LOOKBACK, PREDICT
    n_features = 2

    for i, file in enumerate(dirs):
        print_advancement(os.path.join(stocks_path, file), i, nb_predictions)

        data = pd.read_csv(os.path.join(stocks_path, file)).to_numpy()
        data = filter_data(data)
        data = normalize_data(data)
        x_train, y_train = split_sequences(data, n_steps_in, n_steps_out)

        model = get_model(n_steps_in, n_steps_out, n_features)
        model.compile(optimizer='adam', loss='mse')

        model.fit(x=x_train, y=y_train,
                  epochs=EPOCHS,
                  verbose=0)

        model_name = os.path.join(
            models_path, os.path.splitext(file)[0] + '.h5')
        model.save(model_name)

        # model = keras.models.load_model(model_name)

        x_input = x_train[-1]
        x_input = x_input.reshape((1, n_steps_in, n_features))
        yhat = model.predict(x_input, verbose=0)

        predpath = os.path.join(store_path, file)
        np.savetxt(predpath, yhat[0], delimiter=',', header='Mean,Volume', comments='')

        if i == len(dirs) - 1:
            print_advancement(os.path.join(
                stocks_path, file), i + 1, nb_predictions)
