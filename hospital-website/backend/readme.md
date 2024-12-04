# Hospital Website Backend Setup

## All in one setup (macOS with ZSH)

```bash
chmod +x ./setup_mac_zsh.sh && ./setup_mac_zsh.sh
```


## PostgreSQL Database Setup

1. Install PostgreSQL:
   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install postgresql postgresql-contrib

   # macOS with Homebrew
   brew install postgresql@17

   # If using ZSH need to add to PATH (.zshrc)
   export PATH="/opt/homebrew/opt/postgresql@17/bin:$PATH"
   
   # If using Bash need to add to PATH (.bash_profile)
   export PATH="/opt/homebrew/opt/postgresql@17/bin:$PATH"
   ```

2. Start PostgreSQL service:
   ```bash
   # Ubuntu/Debian
   sudo service postgresql start

   # macOS
   brew services start postgresql@17
   ```

3. Create the databases:
   ```bash
   # Connect to PostgreSQL as the default user
   psql postgres

   # In PostgreSQL prompt, create databases
   CREATE USER myuser WITH PASSWORD 'mypassword' CREATEDB; ### Change depend on how you set up your user and use this for .env file
   CREATE DATABASE hospital_db OWNER myuser;
   CREATE DATABASE hospital_test_db OWNER myuser;
   GRANT ALL PRIVILEGES ON DATABASE hospital_db TO myuser;
   GRANT ALL PRIVILEGES ON DATABASE hospital_test_db TO myuser;
   
   # Exit PostgreSQL prompt
   \q
   ```

4. Create a .env file in the backend directory:
   ```bash
   DB_USER=myuser ### Change depend on how you set up your user
   DB_PASSWORD=mypassword ### Change depend on how you set up your user
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=hospital_db
   SECRET_KEY=your-secret-key
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   REFRESH_TOKEN_EXPIRE_DAYS=30
   ```

5. Verify connection to database:
   ```bash
   python verify_db.py
   ```

6. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

7. Initialize the database:
   ```bash
   python init_db.py
   ```

8. Generate sample data (optional):
   ```bash
   python seed_db.py
   ```

9. Run the server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

## Development

- The API will be available at `http://localhost:8000`
- API documentation at `http://localhost:8000/docs`
- Alternative API docs at `http://localhost:8000/redoc`

## Testing (set up to test up to 80% coverage)

Run tests with:
```bash
python run_tests.py
```