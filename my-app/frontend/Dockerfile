# Use a base image suitable for your frontend technology (e.g., node:alpine for Node.js)
FROM node:alpine

# Set working directory
WORKDIR /app

# Copy your frontend application code
COPY . .

# Install dependencies (if any)
RUN npm install

# Expose the port used by your frontend application (adjust if needed)
EXPOSE 3000

# Start the frontend application (adjust the command based on your framework)
CMD [ "npm", "start" ]
