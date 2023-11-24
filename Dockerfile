FROM ubuntu:22.04

ARG GITBOT_TOKEN

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y curl gnupg
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

COPY . .

RUN npm install

EXPOSE 3000

ENV NODE_ENV=production

RUN bash hibonutil-install.sh ${GITBOT_TOKEN}

CMD ["npm", "run", "start"]
