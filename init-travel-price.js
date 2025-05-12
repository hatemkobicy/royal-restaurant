import pg from 'pg';
const { Pool } = pg;

// Create a connection to the PostgreSQL database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function main() {
  console.log('Starting to add travel price columns...');

  try {
    // Start a transaction
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Check if travel_price column already exists
      const checkColumnResult = await client.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'menu_items' AND column_name = 'travel_price'
      `);
      
      if (checkColumnResult.rows.length === 0) {
        console.log('Adding travel_price column...');
        await client.query(`
          ALTER TABLE menu_items 
          ADD COLUMN travel_price DOUBLE PRECISION
        `);
      } else {
        console.log('travel_price column already exists');
      }
      
      // Check if travel_price_color column already exists
      const checkColorColumnResult = await client.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'menu_items' AND column_name = 'travel_price_color'
      `);
      
      if (checkColorColumnResult.rows.length === 0) {
        console.log('Adding travel_price_color column...');
        await client.query(`
          ALTER TABLE menu_items 
          ADD COLUMN travel_price_color TEXT DEFAULT '#FF5722'
        `);
      } else {
        console.log('travel_price_color column already exists');
      }
      
      await client.query('COMMIT');
      console.log('Migration completed successfully');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    // Close the pool
    await pool.end();
  }
}

main().catch(console.error);