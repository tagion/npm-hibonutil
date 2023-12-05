FROM node:latest

ARG GITBOT_TOKEN

WORKDIR /usr/src/app

COPY . .

RUN npm install

EXPOSE 3000

ENV NODE_ENV=production

RUN bash hibonutil-install.sh ${GITBOT_TOKEN}

CMD ["npm", "run", "start"]
