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


def download_stocks(symbol: str = None, dl_path: str = None, proxies_path: str = None, interval_arg: str = None):
    """Fetches stocks csv's on yahoo finance.
    Args:
        symbol: Symbol of the stock to be downloaded
        dl_path: Filepath to indicate where to store the downloaded stocks.
        proxies_path: Filepath to indicate the proxies to take
        interval_arg: Interval of the stock to be downloaded
    """

    stock_path = f'{dl_path}/{symbol}.csv'
    if os.path.isfile(stock_path) == True:
        return stock_path
    if proxies_path is not None:
        proxies = _get_proxies(proxies_path)

    stock_name = os.path.join(dl_path, symbol + '.csv')

    if proxies_path is not None:
        proxy = rchoice(proxies)
        print(f'Downloading {symbol} on proxy {proxy} ...')
        stock = yf.download(symbol, proxy=proxy, period='max', interval = interval_arg)
    else:
        print(f'Downloading {symbol} on proxy 0.0.0.0 ...')
        stock = yf.download(symbol, period='max', interval = interval_arg)

    if stock.shape[0] > 2:
        stock.to_csv(stock_name)
        print(f'Successfully Downloaded stock {symbol} !')
        return stock_path
    else:
        print(f'Couldn\'t download stock {symbol}')
        return None
