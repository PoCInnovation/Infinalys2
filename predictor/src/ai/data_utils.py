# Numpy and Maths
import numpy
import math

#import sys
#numpy.set_printoptions(threshold=sys.maxsize)

# Tensorflow
import tensorflow

def delete_nans_in_data(array):
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
    return (array)

def init_data(array):
    open_data = delete_nans_in_data(array)
    open_data = numpy.delete(open_data, 3, 1)
    close_data = open_data[:, [0, 1, 2, 3, 4]]
    close_data = numpy.delete(close_data, 0, 0)
    open_data = numpy.delete(open_data, len(open_data) - 1, 0)
    return (open_data, close_data)


def normalize_data(x_array, y_array, scaler):
    x_array = scaler.fit_transform(x_array)
    y_array = scaler.fit_transform(y_array)
    return (x_array, y_array)

def denormalize_data(x_array, y_array, scaler):
    x_array = scaler.inverse_transform(x_array)
    y_array = scaler.inverse_transform(y_array)
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