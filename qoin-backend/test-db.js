const { Client } = require('pg');

const connectionString = "postgresql://postgres.ksurtvmoljvhtweukdbs:Masuk257620@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres?sslmode=no-verify";

const client = new Client({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

console.log("Connecting...");
client.connect()
  .then(() => {
    console.log("Connected successfully!");
    return client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
  })
  .then(res => {
    console.log("Tables in database:", res.rows.map(r => r.table_name));
    return client.end();
  })
  .catch(err => {
    console.error("Connection error:", err);
    process.exit(1);
  });
