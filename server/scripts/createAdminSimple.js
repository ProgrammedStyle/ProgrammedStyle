const https = require('https');

// ========================================
// CONFIGURATION - Edit these values:
// ========================================
const API_URL = 'https://api.programmedstyle.com';
const ADMIN_NAME = 'Admin User';
const ADMIN_EMAIL = 'admin@programmedstyle.com';
const ADMIN_PASSWORD = 'YourSecurePassword123!'; // Change this!
const SETUP_SECRET = ''; // Add your setup secret here if you added ADMIN_SETUP_SECRET to Render
// ========================================

const postData = JSON.stringify({
  name: ADMIN_NAME,
  email: ADMIN_EMAIL,
  password: ADMIN_PASSWORD,
  ...(SETUP_SECRET && { setupSecret: SETUP_SECRET })
});

const url = new URL(`${API_URL}/api/auth/create-admin`);

const options = {
  hostname: url.hostname,
  port: url.port || 443,
  path: url.pathname,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
    ...(SETUP_SECRET && { 'x-setup-secret': SETUP_SECRET })
  }
};

console.log('Creating admin user...');
console.log(`API: ${API_URL}/api/auth/create-admin`);
console.log(`Email: ${ADMIN_EMAIL}\n`);

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      
      if (res.statusCode === 201 || response.success) {
        console.log('✓ Admin user created successfully!\n');
        console.log('=== Admin Credentials ===');
        console.log(`Name: ${ADMIN_NAME}`);
        console.log(`Email: ${ADMIN_EMAIL}`);
        console.log(`Password: ${ADMIN_PASSWORD}`);
        console.log(`Role: admin\n`);
        console.log('⚠️  Please save these credentials securely!');
        console.log(`\nLogin at: ${API_URL.replace('api.', '')}/admin/login`);
      } else {
        console.log('✗ Error:', response.error || response.message || data);
        if (response.error && response.error.includes('setup secret')) {
          console.log('\n💡 Tip: Either add ADMIN_SETUP_SECRET to your Render environment variables,');
          console.log('   or temporarily disable the security check in server/routes/auth.js');
        }
      }
    } catch (error) {
      console.log('✗ Error parsing response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('✗ Request error:', error.message);
  process.exit(1);
});

req.write(postData);
req.end();

