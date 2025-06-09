FROM node:20

WORKDIR /app

COPY package*.json ./

RUN apt-get update && apt-get install -y libvips-dev \
 && npm install --include=optional

COPY . .

EXPOSE 3000
CMD ["npm", "start"]
