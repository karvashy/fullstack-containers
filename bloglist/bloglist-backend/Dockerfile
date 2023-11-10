from node:16
workdir /usr/src/app
copy --chown=node:node . .
run npm ci 
env DEBUG=bloglist-backend:*
user node
cmd npm start
