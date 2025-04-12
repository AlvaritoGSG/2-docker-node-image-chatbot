# Usar una imagen de oficial de Node.js como base
FROM node:22

# Establecer el directorio de trabajo (en la imagen) dentro el contenedor
WORKDIR /app
# Copiar el package.json y package-lock.json al contenedor
COPY package*.json ./

# Instalar las dependencias de la aplicación
RUN npm install
# Copiar el resto de los archivos de la aplicación al contenedor
COPY . .
# Exponer el puerto en el que la aplicación escuchará
EXPOSE 3000
# Comando para iniciar la aplicación
CMD ["node", "./src/chatbot.js"]


# Para construir la imagen, ejecuta el siguiente comando en la terminal:
# sin etiqueta o tag por defecto usa y asigna latest (implícitamente)
# docker build -t nombre-de-la-imagen:etiqueta-tag .
# docker build -t nombre-de-la-imagen:etiqueta-tag ./dockerfile

# Para ejecutar el contenedor, usa el siguiente comando:
# docker run nombre-de-la-imagen:etiqueta-tag
# Para ejecutar el contenedor en segundo plano (detached mode), usa el siguiente comando:
# docker run -d -p 3000:3000 nombre-de-la-imagen:etiqueta-tag