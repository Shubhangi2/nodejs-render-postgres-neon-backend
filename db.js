const { Pool } = require('pg')

// Use the pooling connection string provided by Neon
const connectionString = 'postgresql://neondb_owner:npg_U1xwSW4LRBMl@ep-floral-flower-a5ezqsko-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require'

const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: true  // Neon requires SSL
  }
})

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('Database connected successfully');
    
    // Check if table exists before creating it
    const tableExists = await pool.query(
      "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'notes')"
    );
    
    if (!tableExists.rows[0].exists) {
      await pool.query('CREATE TABLE notes(id SERIAL PRIMARY KEY, title VARCHAR(200), content VARCHAR(1000), createdAt VARCHAR(30), updatedAt VARCHAR(30))')
      console.log('notes table created successfully');
    } else {
      console.log('notes table already exists');
    }
    
    client.release();
  } catch (err) {
    console.error('Database connection error:', err.message);
  }
};

testConnection();

module.exports = pool;