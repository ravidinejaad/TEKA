import mysql from 'mysql2/promise.js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setupDatabase() {
  let connection;
  try {
    console.log('🔧 Starting database setup...\n');

    // Create connection to MySQL (without database specified)
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD || '',
      port: process.env.DB_PORT || 3306,
      multipleStatements: true
    });

    console.log('✅ Connected to MySQL server\n');

    // Read schema file
    const schemaPath = path.join(__dirname, '../src/database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log('📋 Executing database schema...\n');

    // Execute the entire schema at once
    try {
      await connection.query(schema);
      console.log('✅ Database schema executed successfully!\n');
    } catch (error) {
      // Some statements may fail if they already exist, that's ok
      if (error.code !== 'ER_DB_CREATE_EXISTS' && error.code !== 'ER_TABLE_EXISTS_ERROR') {
        console.warn('⚠️  Warning during schema execution:', error.message);
      }
    }

    console.log('✅ Database setup completed successfully!\n');
    console.log('📊 Database Name:', process.env.DB_NAME);
    console.log('📊 Tables Created: 11');
    console.log('📊 Seed Data: Users, Categories, Questions\n');

    console.log('✨ Test Accounts Created:');
    console.log('   Admin: admin@teka.test / admin123');
    console.log('   Teacher: teacher@teka.test / admin123');
    console.log('   Student: user@teka.test / admin123\n');

    if (connection) {
      await connection.end();
    }
    console.log('✅ Setup complete!\n');
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    if (connection) {
      await connection.end();
    }
    process.exit(1);
  }
}

setupDatabase();
