import fs from 'fs';
import path from 'path';

// Function to recursively search for files containing util._extend
function findAndReplaceInFiles(dir: string, searchText: string, replaceText: string) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      findAndReplaceInFiles(filePath, searchText, replaceText);
    } else if (stats.isFile() && 
              (file.endsWith('.js') || file.endsWith('.ts') || file.endsWith('.tsx'))) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        if (content.includes(searchText)) {
          console.log(`Found deprecated API in: ${filePath}`);
          const updatedContent = content.replace(new RegExp(searchText, 'g'), replaceText);
          fs.writeFileSync(filePath, updatedContent, 'utf8');
          console.log(`Updated: ${filePath}`);
        }
      } catch (err) {
        console.error(`Error processing ${filePath}:`, err);
      }
    }
  });
}

// Run this function from your project root
// findAndReplaceInFiles('./src', 'util\\._extend', 'Object.assign'); 