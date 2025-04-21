// startup.js - A simple script to check environment setup before starting the app
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.error('\x1b[31mError: .env file not found!\x1b[0m');
  console.log('Creating a default .env file based on the template...');
  
  // Create default .env file
  const envContent = `# MongoDB Connection
MONGODB_URI=mongodb+srv://admin:AmjuBfihm8vtX8tq@test.gmqrn.mongodb.net/?retryWrites=true&w=majority&appName=test

# Server Configuration
PORT=5008

# JWT Secret for Authentication
JWT_SECRET=sensitivv-secure-jwt-secret-key

# App Configuration
API_URL=http://localhost:5008/api`;
  
  fs.writeFileSync(envPath, envContent);
  console.log('\x1b[32mDefault .env file created successfully!\x1b[0m');
}

// Check if required dependencies are installed
try {
  // Read package.json
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json')));
  const requiredDeps = [
    'react-native-config', 
    'mongodb', 
    'express', 
    'dotenv', 
    'bcrypt', 
    'jsonwebtoken'
  ];
  
  const missingDeps = [];
  requiredDeps.forEach(dep => {
    if (!packageJson.dependencies[dep]) {
      missingDeps.push(dep);
    }
  });
  
  if (missingDeps.length > 0) {
    console.log('\x1b[33mWarning: Missing required dependencies: ' + missingDeps.join(', ') + '\x1b[0m');
    console.log('Installing missing dependencies...');
    
    // Install missing dependencies
    execSync(`npm install ${missingDeps.join(' ')} --save`, { stdio: 'inherit' });
    console.log('\x1b[32mDependencies installed successfully!\x1b[0m');
  }
  
  // Start the application
  console.log('\x1b[36mStarting Sensitivv application...\x1b[0m');
  execSync('npm run dev', { stdio: 'inherit' });
  
} catch (error) {
  console.error('\x1b[31mError starting the application:\x1b[0m', error);
}