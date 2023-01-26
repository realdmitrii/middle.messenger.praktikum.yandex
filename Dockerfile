FROM node:16.17.1

WORKDIR /var/www

COPY . /var/www/

RUN mkdir -p /var/www \
  && cd /var/www \
  && npm install \
  && npm run build 

EXPOSE 3000

CMD node server.js