const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupBuckets() {
  const bucketName = "merchant-media";

  // Create bucket if it doesn't exist
  const { data, error } = await supabase.storage.createBucket(bucketName, {
    public: true,
  });

  if (error) {
    if (error.message.includes("already exists")) {
      console.log(`Bucket ${bucketName} already exists.`);
    } else {
      console.error("Error creating bucket:", error);
    }
  } else {
    console.log(`Bucket ${bucketName} created successfully.`);
  }

  // Set the bucket to be public if possible
  const { data: updateData, error: updateError } = await supabase.storage.updateBucket(bucketName, {
    public: true,
  });

  if (updateError) {
    console.error("Error updating bucket to public:", updateError);
  } else {
    console.log(`Bucket ${bucketName} is now public.`);
  }
}

setupBuckets();
