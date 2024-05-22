# Use the official Node.js 18 image.
# If you need a different version, replace '18' with the version you require.
FROM node:20

# Create a directory to hold the application code inside the image.
# This is the working directory for your application.
WORKDIR /usr/src/app

# Install your application's dependencies.
# The wildcard is used to ensure both package.json AND package-lock.json are copied.
# It also ensures npm ci can be run if a package-lock.json exists.
COPY package.json ./
COPY package-lock.json* ./
RUN npm ci --only=production

# Bundle your app's source code inside the Docker image.
COPY . .

# The command to run your application.
CMD [ "node", "index.js" ]

# Expose the port your app runs on.
EXPOSE 8080
