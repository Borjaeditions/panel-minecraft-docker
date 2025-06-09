FROM node:20

# Instala dependencias del sistema requeridas por sharp
RUN apt-get update && apt-get install -y libvips-dev

WORKDIR /app
COPY package*.json ./
RUN npm install --include=optional
COPY . .

EXPOSE 3000
CMD ["npm", "start"]
