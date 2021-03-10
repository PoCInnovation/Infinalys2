FROM python:3.8

RUN pip3 install gunicorn flask tensorflow python-csv pandas matplotlib stockstats yfinance Flask-WTF scikit-learn==0.22.2 flask-cors

WORKDIR /app

COPY clean_stocks_data.sh /app/

COPY saves /app/saves/

COPY assets /app/assets/

COPY src /app/src/

EXPOSE 5000

WORKDIR /app/src/backend/

ENTRYPOINT [ "gunicorn","--bind","0.0.0.0:5000","wsgi:app" ]