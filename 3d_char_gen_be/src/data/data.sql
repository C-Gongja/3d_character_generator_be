-- users
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  role VARCHAR(50) DEFAULT 'user',
  name VARCHAR(100) NOT NULL,
  username VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- customGroups
CREATE TABLE IF NOT EXISTS customGroups (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  position INT NOT NULL,
	startingAssetId INT,
  FOREIGN KEY (startingAssetId) REFERENCES customAssets (id) ON DELETE SET NULL
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

-- userCustom
CREATE TABLE IF NOT EXISTS userCustom (
	id SERIAL PRIMARY KEY,
	userid INT NOT NULL,
	bio TEXT,
	gender VARCHAR(20),
	serialNum VARCHAR(50),
	location VARCHAR(100),
  birthday DATE,
	head INT,
	eyes INT,
	eyebrows INT,
	nose INT,
	mouth INT,
	ears INT,
	hair INT,
	top INT,
	bottom INT,
	shoes INT,
	CONSTRAINT fk_user FOREIGN KEY (userid) REFERENCES users (id) ON DELETE CASCADE
);