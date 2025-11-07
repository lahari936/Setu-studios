// Script to restore the original orange theme
// Run this with: node restore-original-theme.js

const fs = require('fs');
const path = require('path');

console.log('🔄 Restoring original orange theme...');

try {
  // Check if backup exists
  const backupPath = path.join(__dirname, 'src', 'index.css.backup');
  const currentPath = path.join(__dirname, 'src', 'index.css');
  
  if (fs.existsSync(backupPath)) {
    // Restore from backup
    fs.copyFileSync(backupPath, currentPath);
    console.log('✅ Original theme restored successfully!');
    console.log('📝 The orange theme is now active.');
    console.log('🚀 Please refresh your browser to see the changes.');
  } else {
    console.log('❌ Backup file not found. Cannot restore original theme.');
    console.log('💡 The current soft theme is the new default.');
  }
} catch (error) {
  console.error('❌ Error restoring theme:', error.message);
}
