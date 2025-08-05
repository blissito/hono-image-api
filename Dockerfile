FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code and static files
COPY index.js ./
COPY src/ ./src/
COPY static/ ./static/

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]