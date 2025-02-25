FROM node:latest

WORKDIR /nodejs-docker-aws-ecs

COPY package.json package-lock.json ./

RUN --mount=type=cache,target=/root/.npm \
    npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/server.js"]