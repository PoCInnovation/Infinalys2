# Numpy and Maths
import numpy
import math
# Tensorflow
import tensorflow

# Globals
DATA_SAMPLE = 2122
NB_INDICATORS = 10

def erase_nan(array):
    size = 0
    i = -1
    while 1:
        i += 1
        if math.isnan(array[i][NB_INDICATORS - 1]) is True:
            size += 1
        else:
            break
    return size

def init_data(array):
    close_data = []
    size = erase_nan(array)
    for i in range(DATA_SAMPLE):
        close_data.append(array[i + size][4])
    close_data = numpy.asarray(close_data)
    array = array[size : DATA_SAMPLE + size]
    array = numpy.delete(array, 4, 1)
    return (array, close_data)

def normalize_data(x_array, y_array, scaler):
    x_array = numpy.reshape(x_array, (-1, NB_INDICATORS - 1))
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
    x_train = open_data[0 : int(DATA_SAMPLE * 0.8)]
    y_train = close_data[0 : int(DATA_SAMPLE * 0.8)]
    x_test = open_data[int(DATA_SAMPLE * 0.8) : DATA_SAMPLE]
    y_test = close_data[int(DATA_SAMPLE * 0.8) : DATA_SAMPLE]
    return x_train, y_train, x_test, y_test

def shuffle_data(x_train: numpy.array, y_train: numpy.array):

    dataset = tensorflow.data.Dataset.from_tensor_slices((x_train, y_train))
    dataset = dataset.shuffle(DATA_SAMPLE, reshuffle_each_iteration=True)
    (shuffle_open_data, shuffle_close_data) = list(zip(*list(dataset.as_numpy_iterator())))
    return numpy.array(shuffle_open_data), numpy.array(shuffle_close_data)