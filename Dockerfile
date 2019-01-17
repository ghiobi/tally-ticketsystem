FROM node:10-alpine

LABEL maintainer="Kevin Zhang <kev.zhang95@gmail.com>"

# Install Adonis CLI
RUN npm i -g @adonisjs/cli

# Change work directory
WORKDIR . /app

# Set node_env fron .env
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

# Dependencies, cache installed modules.
COPY package*.json ./
RUN npm install

# Copies all files except those specified in .dockerignore
COPY . .

# Run App
CMD [ "npm", "start" ]
CMD [ "npm", "run", "front:dev" ]