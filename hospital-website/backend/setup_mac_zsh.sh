#!/bin/bash

echo "🏥 Starting Hospital Website Backend Setup for macOS..."

# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    echo "Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
else
    echo "Homebrew already installed ✓"
fi

# Install PostgreSQL
echo "Installing PostgreSQL..."
brew install postgresql@17

# Add PostgreSQL to PATH
echo 'export PATH="/opt/homebrew/opt/postgresql@17/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Start PostgreSQL service
echo "Starting PostgreSQL service..."
brew services start postgresql@17

# Wait for PostgreSQL to start
sleep 3

# Create database and user
echo "Setting up database..."
psql postgres << EOF
CREATE USER myuser WITH PASSWORD 'mypassword' CREATEDB;
CREATE DATABASE hospital_db OWNER myuser;
CREATE DATABASE hospital_test_db OWNER myuser;
GRANT ALL PRIVILEGES ON DATABASE hospital_db TO myuser;
GRANT ALL PRIVILEGES ON DATABASE hospital_test_db TO myuser;
EOF

# Create .env file
echo "Creating .env file..."
cat > .env << EOF
DB_USER=myuser
DB_PASSWORD=mypassword
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hospital_db
SECRET_KEY=$(openssl rand -hex 32)
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=30
EOF

# Install Python 3.11 using Homebrew (Some dependencies are incompatible with Python 3.12 or later)
echo "Installing Python 3.11..."
brew install python@3.11

# Add Python 3.11 to PATH and make it the default
echo 'export PATH="/opt/homebrew/opt/python@3.11/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Ensure pip is using Python 3.11
echo "Setting up Python 3.11 environment..."
python3.11 -m pip install --upgrade pip

# Install Python dependencies using Python 3.11
echo "Installing Python dependencies..."
python3.11 -m pip install -r requirements.txt

# Use Python 3.11 for database operations
echo "Initializing database..."
python3.11 init_db.py

echo "Seeding database with sample data..."
python3.11 seed_db.py

echo "Verifying database connection..."
python3.11 verify_db.py

echo "Starting the server..."
python3.11 -m uvicorn main:app --reload --port 8000