CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role VARCHAR(10) DEFAULT 'user',
  status VARCHAR(10) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_unique ON users(email);
