#!/bin/bash

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
while ! nc -z db 5432; do
  sleep 0.1
done
echo "PostgreSQL is ready!"

# Initialize the database
echo "Initializing database..."
python init_db.py

# Seed the database
echo "Seeding database..."
python seed_db.py

# Start the application
echo "Starting the application..."
exec uvicorn main:app --host 0.0.0.0 --port 8000
