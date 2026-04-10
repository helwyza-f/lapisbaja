# Dockerfile untuk Next.js dengan output standalone
FROM node:20-alpine
WORKDIR /app

# Copy standalone build from GitHub Action
COPY .next/standalone ./
COPY .next/static ./.next/static
COPY public ./public
COPY .env .

EXPOSE 3000
# server.js is created by Next.js standalone output
CMD ["node", "server.js"]