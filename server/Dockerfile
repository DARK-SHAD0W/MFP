FROM node:25.6.1-alpine3.23

WORKDIR /app

COPY ./package.json ./package.json
RUN npm i

COPY ./src ./src
COPY ./tsconfig.json ./tsconfig.json

EXPOSE 3000

CMD npm run dev