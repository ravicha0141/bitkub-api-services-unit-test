FROM node:18.13.0-alpine As production
ARG TIMEZONE="Asia/Bangkok"
RUN ln -snf /usr/share/zoneinfo/$TIMEZONE /etc/localtime && echo $TIMEZONE > /etc/timezone
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production
COPY . .

EXPOSE 3000
CMD [ "node", "src/index.js" ]