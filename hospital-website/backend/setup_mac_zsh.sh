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

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Initialize and seed database
echo "Initializing database..."
python init_db.py

echo "Seeding database with sample data..."
python seed_db.py

echo "Verifying database connection..."
python verify_db.py

echo "Starting the server..."
uvicorn main:app --reload --port 8000