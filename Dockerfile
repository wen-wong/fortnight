FROM node:16

# Working Dir
WORKDIR /usr/src/app

# Copy Package Json Files
COPY package*.json ./

# Install Prettier (For our package's build function)
RUN npm install prettier -g

# Install Files
RUN npm install

# Copy Source Files
COPY . .

# Build
RUN npm run build

# Expose the API Port
EXPOSE 1337

CMD ["node", "build/server.js"]
