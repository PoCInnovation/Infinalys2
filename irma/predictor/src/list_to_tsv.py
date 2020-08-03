#!/usr/bin/env python3

import csv
from datetime import date, timedelta

STOCKS_PATH = "../stocks"
TSV_PATH = "../tsv"

def csv_to_list(csvin):
    string = csvin.read() + '\n'
    string = list(string.split('\n'))
    for line in range(len(string)):
        string[line] = list(string[line].split(','))
        for i in range(len(string[line])):
            if i == 5:
                string[line][i] = string[line][i + 1]
                string[line].pop(5)
                break
            if string[line][i] == '':
                string[line][i] = 'NULL'
    return(string)

def list_to_tsv(stock_symbol, interval, predict: list):
    stocks_path = f'{STOCKS_PATH}/{stock_symbol}_{interval}.csv'
    tsv_path = f'{TSV_PATH}/{stock_symbol}_{interval}.tsv'
    with open (stocks_path, 'r', newline='') as csvin, open(tsv_path, 'w') as tsvout:
        csv_read = csv.reader(csvin)
        tsv_write = csv.writer(tsvout, delimiter='\t')

        string = csv_to_list(csvin)

        predict[0] = date.today() + timedelta(days=1)
        for row in string:
            if row[0] == 'NULL':
                continue
            tsv_write.writerow(row)

        tsv_write.writerow(predict)
        csvin.close()
        tsvout.close()
    return (0)
