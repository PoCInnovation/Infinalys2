#!/usr/bin/env python3

import csv

from datetime import date, timedelta

STOCKS_PATH = "../../saves/stocks"
TSV_PATH = "../../saves/tsv"

DATE = 0
OPEN = 1
HIGH = 2
LOW = 3
CLOSE = 4
ADJ_CLOSE = 5
VOLUME = 6

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

def list_to_tsv(stock_symbol: str, interval: str):
    stocks_path = f'{STOCKS_PATH}/{stock_symbol}_{interval}.csv'
    tsv_path = f'{TSV_PATH}/{stock_symbol}_{interval}.tsv'

    with open (stocks_path, 'r', newline='') as csvin, open(tsv_path, 'w') as tsvout:
        tsv_write = csv.writer(tsvout, delimiter='\t')
        string = csv_to_list(csvin)
        for row in string:
            if row[DATE] == 'NULL' or row[OPEN] == 'NULL':
                continue
            tsv_write.writerow(row)
        csvin.close()
        tsvout.close()
    return (0)
