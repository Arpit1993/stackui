# Build step #1: build the React front end
FROM node:lts-alpine as build-step
WORKDIR .
ENV PATH /node_modules/.bin:$PATH
COPY ./  ./
RUN yarn install
RUN yarn run build

# Build step #2: build an Caddy container
FROM caddy:alpine
EXPOSE 80
EXPOSE 443
COPY --from=build-step /app/build /usr/share/caddy