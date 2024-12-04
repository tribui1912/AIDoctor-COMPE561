#!/bin/zsh

echo "🏥 Starting Hospital Website Backend Setup for macOS..."

# Check if Homebrew is installed
if (( ! $+commands[brew] )); then
    echo "Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
else
    echo "Homebrew already installed ✓"
fi

# Install PostgreSQL
echo "Installing PostgreSQL..."
brew install postgresql@17

# Add PostgreSQL to PATH (safely)
if ! grep -q 'postgresql@17/bin' ~/.zshrc; then
    echo 'export PATH="/opt/homebrew/opt/postgresql@17/bin:$PATH"' >> ~/.zshrc
fi

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

# Install Python 3.11
echo "Installing Python 3.11..."
brew install python@3.11

# Add Python 3.11 to PATH (safely)
if ! grep -q 'python@3.11/bin' ~/.zshrc; then
    echo 'export PATH="/opt/homebrew/opt/python@3.11/bin:$PATH"' >> ~/.zshrc
fi

# Export the PATH updates for the current session
export PATH="/opt/homebrew/opt/postgresql@17/bin:$PATH"
export PATH="/opt/homebrew/opt/python@3.11/bin:$PATH"

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