from node:16
workdir /usr/src/app
copy --chown=node:node . .
run npm ci
env DEBUG=todo-backend:*
user node
cmd npm start
