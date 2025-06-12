# Dockerfile (auth-service)

FROM node:20
WORKDIR /app

COPY package*.json ./

# Agrega esto justo antes del npm install
RUN npm config set registry https://registry.npmmirror.com

RUN npm install

COPY . .

EXPOSE 3000
CMD ["npm", "run", "start"]
