# Use an official Node runtime as the base image
FROM node:14-alpine

# Set the working directory in the container to /app
WORKDIR /app

# Copy the package.json and package-lock.json files from your local filesystem to the filesystem of the container at the working directory
COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install

# Bundle the app source inside the Docker image
# If you are building your code for production, run `npm ci --only=production`
COPY . .

# Your app binds to port 3000 so you'll use the EXPOSE instruction to have it mapped by the docker daemon
EXPOSE 80

# Define the command to run your app using CMD which defines your runtime
CMD [ "npm", "run", "start" ]