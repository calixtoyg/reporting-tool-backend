FROM       node:14-alpine

WORKDIR    /usr/reporting-tool-backend

# Copy and install production packages
COPY       build build/
COPY       package*.json ./
COPY       production.env ./
RUN        npm ci --production

# Non root user
USER       node

ENV        NODE_ENV="production"
EXPOSE     8080 
# Running port is configured through API_PORT env variable
ENTRYPOINT ["npm"]
CMD        ["start"]
