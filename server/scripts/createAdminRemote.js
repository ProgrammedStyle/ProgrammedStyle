const readline = require('readline');
const https = require('https');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => {
    rl.question(query, resolve);
  });
}

async function createRemoteAdmin() {
  console.log('\n=== Create Remote Admin User ===\n');
  
  // Get API URL
  const apiUrl = await question('Enter your API URL (e.g., https://api.programmedstyle.com): ');
  
  // Get admin details
  const name = await question('Enter admin name: ');
  const email = await question('Enter admin email: ');
  const password = await question('Enter admin password (min 8 characters): ');
  
  // Get setup secret (optional)
  const setupSecret = await question('Enter setup secret (press Enter to skip if not required): ');
  
  // Validate input
  if (!name || !email || !password) {
    console.log('\n✗ All fields are required!');
    process.exit(1);
  }

  if (password.length < 8) {
    console.log('\n✗ Password must be at least 8 characters long!');
    process.exit(1);
  }

  // Prepare request data
  const postData = JSON.stringify({
    name,
    email,
    password,
    ...(setupSecret && { setupSecret })
  });

  // Parse URL
  const url = new URL(`${apiUrl.replace(/\/$/, '')}/api/auth/create-admin`);
  
  const options = {
    hostname: url.hostname,
    port: url.port || 443,
    path: url.pathname,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
      ...(setupSecret && { 'x-setup-secret': setupSecret })
    }
  };

  console.log('\nCreating admin user...');

  const req = https.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        
        if (res.statusCode === 201 || response.success) {
          console.log('\n✓ Admin user created successfully!');
          console.log('\n=== Admin Credentials ===');
          console.log(`Name: ${name}`);
          console.log(`Email: ${email}`);
          console.log(`Role: admin`);
          console.log('\n⚠️  Please save these credentials securely!');
          console.log(`\nYou can now login at: ${apiUrl.replace('/api', '')}/admin/login`);
        } else {
          console.log('\n✗ Error:', response.error || response.message || data);
        }
      } catch (error) {
        console.log('\n✗ Error parsing response:', data);
      }
      
      rl.close();
      process.exit(0);
    });
  });

  req.on('error', (error) => {
    console.error('\n✗ Request error:', error.message);
    rl.close();
    process.exit(1);
  });

  req.write(postData);
  req.end();
}

// Run the script
createRemoteAdmin();

