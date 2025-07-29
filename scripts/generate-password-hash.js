#!/usr/bin/env node

const crypto = require('crypto');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter the password you want to hash: ', (password) => {
  const hash = crypto.createHash('sha256').update(password).digest('hex');
  console.log('\n--- Password Hash Generated ---');
  console.log('Password:', password);
  console.log('SHA-256 Hash:', hash);
  console.log('\nReplace the PASSWORD_HASH constant in lib/auth.ts with this hash.');
  console.log('Example:');
  console.log(`const PASSWORD_HASH = "${hash}";`);
  rl.close();
});
