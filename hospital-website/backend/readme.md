To install dependencies:
```
pip install -r requirements.txt
```

To initialize the database:
```
python init_db.py
```

To generate sample data:
```
python generate_sample_data.py

Create .env file and add the following:
```
SECRET_KEY=your-generated-key-here
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=30
```

For the SECRET_KEY, you can use the following command:
```
openssl rand -hex 32
```

To run the server:
```
python main.py
```



