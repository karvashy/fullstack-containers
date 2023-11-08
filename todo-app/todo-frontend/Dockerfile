FROM node:16 AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

ENV REACT_APP_BACKEND_URL="http://localhost:3000" CI=true

RUN  npm run test

RUN npm run build

FROM nginx:1.20-alpine
COPY --from=build /usr/src/app/build /usr/share/nginx/html
