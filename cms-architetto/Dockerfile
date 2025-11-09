FROM node:20-alpine AS builder
WORKDIR /usr/src/app

# Install deps
COPY package.json package-lock.json* ./
RUN npm ci --production=false

# Copy source
COPY . .

# Build admin
RUN npm run build

FROM node:20-alpine AS runtime
WORKDIR /usr/src/app

# Install only production deps
COPY package.json package-lock.json* ./
RUN npm ci --production

# Copy built files and app
COPY --from=builder /usr/src/app .

ENV NODE_ENV=production

EXPOSE 1337

CMD ["npm", "run", "start"]
