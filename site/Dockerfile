FROM node:latest

ENV APP_DIR /var/www/app
RUN mkdir -p $APP_DIR
WORKDIR ${APP_DIR}

COPY . .
RUN npm install
RUN ls -la
RUN npm run build
CMD ["npm", "run", "serve"]
