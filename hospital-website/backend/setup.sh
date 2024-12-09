#!/bin/bash

echo "🏥 Starting Hospital Website Backend Setup for Ubuntu..."

# Update package lists
echo "Updating package lists..."
sudo apt update && sudo apt upgrade -y

# Install PostgreSQL
echo "Installing PostgreSQL..."
sudo apt install -y postgresql postgresql-contrib

# Start PostgreSQL service
echo "Starting PostgreSQL service..."
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Wait for PostgreSQL to start
sleep 3

# Create database and user
echo "Setting up database..."
sudo -u postgres psql << EOF
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

# Install Python 3.11
echo "Installing Python 3.11..."
sudo apt install -y software-properties-common
sudo add-apt-repository -y ppa:deadsnakes/ppa
sudo apt update
sudo apt install -y python3.11 python3.11-venv python3.11-dev

# Install pip for Python 3.11
echo "Installing pip..."
curl -sS https://bootstrap.pypa.io/get-pip.py | sudo python3.11

# Create and activate a virtual environment
echo "Creating Python virtual environment..."
python3.11 -m venv venv
source ./venv/bin/activate

# Verify we're in the virtual environment
which python
which pip

# Ensure pip is up to date
echo "Upgrading pip..."
python -m pip install --upgrade pip

# Install dependencies with verbose output
echo "Installing Python dependencies..."
python -m pip install -r requirements.txt --verbose

# Install any required system dependencies for Python packages
echo "Installing system dependencies..."
sudo apt install -y build-essential libpq-dev

# Verify installations
echo "Verifying installations..."
python -c "import sqlalchemy; print(f'SQLAlchemy version: {sqlalchemy.__version__}')"
python -c "import fastapi; print(f'FastAPI version: {fastapi.__version__}')"

# Use Python with virtual environment for database operations
echo "Initializing database..."
python init_db.py

echo "Seeding database with sample data..."
python seed_db.py

echo "Verifying database connection..."
python verify_db.py

echo "Starting the server..."
python -m uvicorn main:app --reload --port 8000