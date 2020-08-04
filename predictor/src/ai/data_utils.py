# Numpy and Maths
import numpy
import math
# Tensorflow
import tensorflow

def init_data(array):
    close_data = []
    length = len(array)
    i = 0
    while i != length:
        if i >= len(array):
            i += 1
            continue
        if math.isnan(numpy.min(array[i])) is True:
            array = numpy.delete(array, i, axis=0)
            i -= 1
        i += 1
    for i in range(len(array)):
        close_data.append(array[i][4])
    close_data = numpy.asarray(close_data)
    array = numpy.delete(array, 4, 1)
    return (array, close_data)


def normalize_data(x_array, y_array, scaler, nb_indicators):
    x_array = numpy.reshape(x_array, (-1, nb_indicators - 1))
    x_array = scaler.fit_transform(x_array)

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

def split_data(open_data: numpy.array, close_data: numpy.array):
    x_train = open_data[0 : int(len(open_data) * 0.9)]
    y_train = close_data[0 : int(len(close_data) * 0.9)]
    x_test = open_data[int(len(open_data) * 0.9) : len(open_data)]
    y_test = close_data[int(len(close_data) * 0.9) : len(close_data)]
    return x_train, y_train, x_test, y_test

def shuffle_data(x_train: numpy.array, y_train: numpy.array):

    dataset = tensorflow.data.Dataset.from_tensor_slices((x_train, y_train))
    dataset = dataset.shuffle(len(y_train), reshuffle_each_iteration=True)
    (shuffle_open_data, shuffle_close_data) = list(zip(*list(dataset.as_numpy_iterator())))
    return numpy.array(shuffle_open_data), numpy.array(shuffle_close_data)