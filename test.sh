#!/bin/bash

echo "Generating .env file..."

echo "# environment variables" > .env
echo "AUTH=\"http://localhost:3000\"" >> .env
echo "AUTH_SECRET=\"$(openssl rand -base64 32)\"" >> .env
echo "DATABASE_URL=\"file:dev.db\"" >> .env

echo "Creating database..."
touch prisma/dev.db
npx prisma migrate dev --name init

echo "Installing dependencies..."
npm install

echo "Building..."
npm run build

echo "Starting server..."
npm run start
