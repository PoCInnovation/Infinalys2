#!/usr/bin/env python3

import csv

def list_to_tsv(data: list):
    with open ('output.tsv', 'w', newline='') as f_output:
        tsv_output = csv.writer(f_output, delimiter='\t')
        tsv_output.writerow(data)
    return (data)
