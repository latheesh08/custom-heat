# Start from an Alpine image with the Node version installed
FROM node:10.16.3-alpine as build-env

# Update the package repository
RUN apk add --no-cache git

# Copy the local package files to the container's workspace.

RUN mkdir /opt/website

COPY package.json /opt/website

# To handle 'not get uid/gid'
RUN npm config set unsafe-perm true

# Build the application using the npm install & ng build

RUN cd /opt/website && npm install && npm install -g @angular/cli

COPY . /opt/website

RUN cd /opt/website && ng build --prod --deployUrl="/website/"

RUN cd /opt/website && mv dist /dist

# Distributed image
FROM nginx:alpine 

MAINTAINER keerthiraja@commusoft.co.uk

RUN apk add --no-cache ca-certificates

# Copy Build Code file
WORKDIR /usr/share/nginx/html/website

COPY --from=build-env /dist /usr/share/nginx/html/website

COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
