#!/usr/bin/env python3

import csv

STOCKS_PATH = "../stocks"
TSV_PATH = "../tsv"

def list_to_tsv(stock_symbol, interval, predict: list):
    stocks_path = f'{STOCKS_PATH}/{stock_symbol}_{interval}.csv'
    tsv_path = f'{TSV_PATH}/{stock_symbol}_{interval}.tsv'
    with open (stocks_path, 'r', newline='') as csvin, open(tsv_path, 'w') as tsvout:
        csv_read = csv.reader(csvin)
        tsv_write = csv.writer(tsvout, delimiter='\t')

        for row in csv_read:
            tsv_write.writerow(row)

        tsv_write.writerow(predict)
        csvin.close()
        tsvout.close()
    return (0)
