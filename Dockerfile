# Stage 1: Build the Angular application
# Use a specific Node.js version for consistency
FROM node:12-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package.json package-lock.json ./

# Install dependencies strictly
RUN npm ci

# Copy the rest of the application source code
COPY . .

# Build the application for production
# The output will be in the /app/dist/ folder
RUN npm run build -- --configuration production

# Stage 2: Serve the application using Nginx
# Use the official lightweight Nginx alpine image
FROM nginx:stable-alpine

# Copy the custom nginx configuration
# We will create this file in the next step
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the build output from the first stage
# Angular 17+: output is in dist/your-app-name/browser
# Angular 16 and earlier: output is in dist/your-app-name (no /browser subfolder)
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 8005 to the outside world
EXPOSE 8005

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]