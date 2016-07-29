FROM node:6.3

RUN useradd --user-group --create-home --shell /bin/false weatherapp

ENV HOME=/home/weatherapp

COPY package.json $HOME/app/
RUN chown -R weatherapp:weatherapp $HOME/*

USER weatherapp
WORKDIR $HOME/app
RUN npm install
RUN curl http://bulk.openweathermap.org/sample/city.list.json.gz | \
  gunzip -c > city.list.json

USER root
COPY . $HOME/app
RUN chown -R weatherapp:weatherapp $HOME/*
USER weatherapp

CMD ["node", "dist"]
