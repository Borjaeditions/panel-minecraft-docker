FROM node:20

# 🔧 Instala dependencias necesarias para sharp
RUN apt-get update && apt-get install -y \
    build-essential \
    libvips-dev \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install --include=optional

COPY . .

EXPOSE 3000
CMD ["npm", "start"]
