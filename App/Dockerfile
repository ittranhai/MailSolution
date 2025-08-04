# Stage 1: Compile and Build angular codebase

# Use official node image as the base image
FROM node:20.9.0 as build

# Set the working directory
WORKDIR /app

RUN npm cache clean --force

# Add the source code to app
# COPY ["Webs/BackOffice/", "/usr/local/app/"]
COPY App/ .

# Install all the dependencies
RUN npm install 

# Generate the build of the application
RUN npm run build --prod


# Stage 2: Serve app with nginx server

# Use official nginx image as the base image
FROM nginx:latest

# Copy the build output to replace the default nginx contents.
COPY --from=build /app/dist/app/browser /usr/share/nginx/html
# Expose port 80
EXPOSE 80