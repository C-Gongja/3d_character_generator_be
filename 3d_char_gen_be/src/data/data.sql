-- users
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  role VARCHAR(50) DEFAULT 'user',
  name VARCHAR(100) NOT NULL,
  username VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  bio TEXT,
	gender VARCHAR(20),
	serialNum VARCHAR(50),
	location VARCHAR(100),
  birthday DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- customGroups
CREATE TABLE IF NOT EXISTS customGroups (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  position INT NOT NULL,
	startingAssetId INT,
  FOREIGN KEY (startingAssetId) REFERENCES customAssets (id) ON DELETE CASCADE
);

-- customAssets
CREATE TABLE IF NOT EXISTS customAssets (
  id SERIAL PRIMARY KEY, 
  name VARCHAR(255) NOT NULL,
  thumbnail VARCHAR(255),
  url VARCHAR(255),
  groupId INT NOT NULL,
  FOREIGN KEY (groupId) REFERENCES customGroups (id) ON DELETE CASCADE
);