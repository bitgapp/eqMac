FROM node:latest

ADD . .
RUN npm install
RUN npm run build:ssr
CMD ["npm", "run", "serve:ssr"]
