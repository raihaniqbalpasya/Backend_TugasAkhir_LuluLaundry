FROM node:19-alpine3.16 as node

# install node dependencies
COPY ./package.json /var/www/html/
COPY ./package-lock.json /var/www/html/
RUN npm install

# copy all the files
COPY . /var/www/html/

EXPOSE 3000
CMD ["node","./server/index.js"]