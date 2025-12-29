-- Create test database
CREATE DATABASE IF NOT EXISTS fitstreak_test;
GRANT ALL PRIVILEGES ON fitstreak_test.* TO 'fitstreak'@'%';
FLUSH PRIVILEGES;
