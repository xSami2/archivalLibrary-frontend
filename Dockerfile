# Stage 1: Build the React app using Node.js and npm
FROM node:17-alpine as builder

WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json .

# Install dependencies using npm
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the app using Nginx
FROM nginx:1.19.0

# Set the working directory to the default Nginx HTML directory
WORKDIR /usr/share/nginx/html

# Remove default Nginx files
RUN rm -rf ./*

# Copy the build output from the previous stage to the Nginx HTML directory
COPY --from=builder /app/dist .

# Run Nginx in the foreground
ENTRYPOINT ["nginx", "-g", "daemon off;"]
