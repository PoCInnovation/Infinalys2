FROM python:3
RUN pip install gunicorn flask tensorflow python-csv pandas matplotlib stockstats yfinance Flask-WTF
RUN pip install scikit-learn==0.22.2
WORKDIR /app
COPY predictor /app/
EXPOSE 5000
WORKDIR /app/src
ENTRYPOINT [ "gunicorn","--bind","0.0.0.0:5000","wsgi:app" ]