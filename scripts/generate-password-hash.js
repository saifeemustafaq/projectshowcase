#!/usr/bin/env node

const crypto = require('crypto');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔐 Password Hash Generator');
console.log('===========================\n');
console.log('This tool generates SHA-256 hashes for passwords.');
console.log('For setting the admin password in the database, use "npm run reset-password" instead.\n');

rl.question('Enter the password you want to hash: ', (password) => {
  const hash = crypto.createHash('sha256').update(password).digest('hex');
  console.log('\n--- Password Hash Generated ---');
  console.log('Password:', password);
  console.log('SHA-256 Hash:', hash);
  console.log('\n📝 Note: This tool only generates hashes.');
  console.log('To update the admin password in the database, run:');
  console.log('npm run reset-password');
  rl.close();
});
