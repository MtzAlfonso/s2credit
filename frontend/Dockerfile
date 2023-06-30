FROM node:18

WORKDIR /usr/src/app

COPY package.json .

RUN yarn

COPY . .

EXPOSE 5173

CMD ["yarn", "dev"]
