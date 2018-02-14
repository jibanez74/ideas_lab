# base image
FROM node:8.9.4-alpine

# working directory
WORKDIR /home/node/

# copy package files
COPY package*.json ./

# installing dependencies for app
RUN npm install

# copy files from app
COPY . .

# opening port on container, will use port 80 on host machine
EXPOSE 5000

CMD npm start