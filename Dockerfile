# Use the official Node.js image as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev  # Use --omit=dev for production, remove if running locally

# Copy the entire project into the container
COPY . .

# Expose the port your Node.js app runs on
EXPOSE 3000

# Set the default command to run the server
CMD ["node", "app.js"]
