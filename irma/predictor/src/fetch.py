from random import choice as rchoice
import os
import yfinance as yf


def _get_proxies(path: str) -> list:
    """Convert a file to a line by line list equivalent

    Arg:
        path: filepath to read and convert to list

    Example:
        >>> _get_proxies('./proxies.txt')
        ... ['192.162.1.1', '192.172.98.13', '192.183.32.11']
    """
    with open(path, 'r') as file:
        proxies = [row.strip('\n') for row in file]
        return proxies


def download_stocks(companies_path: str, dl_path: str, proxies_path: str = None, max_dl: int = 0):
    """Fetches stocks csv's on yahoo finance.

    Args:
        companies_path: Represents the filepath to the file listing the
            companies name (ticker name). It's waiting for a csv, and
            will read the first column.
        dl_path: Filepath to indicate where to store the downloaded stocks.
        proxies_path: Filepath to indicate the proxies to take
        max_dl: Maximun number of files to download, 0 if there is no limit

    Example:

        This example will download at most 100 csv stock files on yahoo
        finance and store them in `./store/`.

        >>> download_stocks('./companies/list.csv', './store', max_dl=100)
    """
    assert max_dl >= 0, 'Argument max_dl must be >= 0.'

    if proxies_path is not None:
        proxies = _get_proxies(proxies_path)

    downloads = 0
    with open(companies_path, 'r') as file:
        file.readline()
        for i, row in enumerate(file):

            symbol = row.split(',')[0].strip('\n')
            stock_name = os.path.join(dl_path, symbol + '.csv')

            if os.path.exists(stock_name):
                continue

            if proxies_path is not None:
                proxy = rchoice(proxies)
                print(f'{i} - Downloading {symbol} on proxy {proxy} ...')
                stock = yf.download(symbol, proxy=proxy)
            else:
                print(f'{i} - Downloading {symbol} on proxy 0.0.0.0 ...')
                stock = yf.download(symbol)

            if stock.shape[0] > 2:
                stock.to_csv(stock_name)
                downloads += 1
            else:
                print(f'Couldn\'t download stock {symbol}')

            if max_dl != 0 and downloads - 1 == max_dl:
                break

        print(f'Downloaded {downloads} stocks.')
