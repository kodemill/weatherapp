FROM node:6.3

RUN useradd --user-group --create-home --shell /bin/false weatherapp && \
  npm i -g npm
ENV HOME=/home/weatherapp

COPY package.json $HOME/app
RUN chown -R weahterapp:weatherapp $HOME/*

USER weatherapp
WORKDIR $HOME/app
RUN npm i && \
  npm cache clean
RUN curl http://bulk.openweathermap.org/sample/city.list.json.gz | \
  gunzip -c > city.list.json

USER root
COPY . $HOME/app
RUN chown -R weahterapp:weatherapp $HOME/*

USER weatherapp

CMD ["node", "dist"]
