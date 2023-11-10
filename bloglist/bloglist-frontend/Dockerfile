FROM node:16 as build

WORKDIR /usr/src/app

COPY . .

RUN npm ci 
ENV REACT_APP_BACKEND_URL="http://localhost:8080/api" CI=true

RUN npm run test

RUN npm run build 

FROM nginx:1.20-alpine
COPY --from=build /usr/src/app/build /usr/share/nginx/html
