#FROM node:20

#WORKDIR /app

# Copia solo el package.json (sin lock)
#COPY package.json ./

# Instala las dependencias (siempre limpias)
#RUN npm install

# Luego copia todo el proyecto
#COPY . .

# Exponer el puerto si aplica
#EXPOSE 3000

#CMD ["npm", "run", "start"]

# Dockerfile (auth-service)

FROM node:20
WORKDIR /app

COPY package*.json ./

RUN npm config set registry https://registry.npmmirror.com

RUN npm install

COPY . .

EXPOSE 3000
CMD ["npm", "run", "start"]
