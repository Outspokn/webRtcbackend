FROM node:21

RUN mkdir /app
WORKDIR /app 

COPY package*.json ./

RUN npm install

RUN npm add sharp

COPY . .

# run in dev mode
CMD ["npm", "start"]
