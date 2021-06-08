FROM       node:14-alpine

WORKDIR    /usr/reporting-tool-backend

# Copy and install production packages
COPY       package*.json ./
COPY       production.env ./
COPY       tsconfig.json ./
COPY       tsconfig.paths.json ./
COPY       src ./src
RUN        npm install
RUN        npm run build:prod

# Non root user
USER       node

ENV        NODE_ENV="production"
EXPOSE     8080 
# Running port is configured through API_PORT env variable
ENTRYPOINT ["npm"]
CMD        ["start"]
