from node:16
workdir /usr/src/app
copy --chown=node:node . .
run npm install
env DEBUG=todo-backend:*
user node
cmd npm run dev
