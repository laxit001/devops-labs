# Container image for ShopEasy Lite
FROM node:24-alpine

WORKDIR /app

# Install dependencies first so this layer is reused when only code changes
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy the application code
COPY server.js ./
COPY src ./src

# The CI pipeline passes the commit SHA here, so the running app can report it
ARG APP_VERSION=dev
ENV APP_VERSION=$APP_VERSION \
    PORT=3000

EXPOSE 3000

# Run as the unprivileged "node" user that the base image provides
USER node

CMD ["node", "server.js"]
