import bcrypt

def get_password_hash(password: str) -> str:
    # Convert the password to bytes
    password_bytes = password.encode('utf-8')
    # Generate salt and hash the password
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    # Return the hash as a string
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    # Convert passwords to bytes
    plain_password_bytes = plain_password.encode('utf-8')
    hashed_password_bytes = hashed_password.encode('utf-8')
    # Verify the password
    return bcrypt.checkpw(plain_password_bytes, hashed_password_bytes)