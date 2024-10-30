FROM node:latest

WORKDIR /nodejs-docker-aws-ecs

COPY package.json .

RUN --mount=type=cache,target=/root/.npm \
    npm install

COPY . .

EXPOSE 3000

CMD ["node", "app.js"]