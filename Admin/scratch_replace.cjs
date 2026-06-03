const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Replace backtick instances
      content = content.replace(/`http:\/\/localhost:5000/g, '`${import.meta.env.VITE_API_BASE_URL}');
      
      // Replace single quote instances
      content = content.replace(/'http:\/\/localhost:5000(.*?)'/g, '`${import.meta.env.VITE_API_BASE_URL}$1`');
      
      // Replace double quote instances
      content = content.replace(/"http:\/\/localhost:5000(.*?)"/g, '`${import.meta.env.VITE_API_BASE_URL}$1`');

      fs.writeFileSync(fullPath, content);
    }
  }
}

replaceInDir(srcDir);
console.log('Replaced all hardcoded URLs.');
