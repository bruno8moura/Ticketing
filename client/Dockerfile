FROM node:alpine

RUN mkdir -p /home/node/client/node_modules && chown -R node:node /home/node/client

WORKDIR /home/node/client

COPY --chown=node:node . .

USER node

RUN npm install

CMD [ "npm", "run", "dev" ]
