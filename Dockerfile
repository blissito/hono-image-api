FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY index.js ./
COPY src/ ./src/

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]