#!/usr/bin/env node

/**
 * Uninstall script for ink-tetris
 * Removes the configuration directory at ~/.ink-tetris
 */

import fs from 'fs';
import path from 'path';
import os from 'os';

const CONFIG_DIR = path.join(os.homedir(), '.ink-tetris');

console.log('🎮 Ink Tetris Uninstall');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

if (fs.existsSync(CONFIG_DIR)) {
  try {
    fs.rmSync(CONFIG_DIR, { recursive: true, force: true });
    console.log('✅ Configuration cleaned up');
    console.log(`   Removed: ${CONFIG_DIR}`);
  } catch (error) {
    console.error('❌ Error cleaning configuration:', error);
    process.exit(1);
  }
} else {
  console.log('✅ No configuration found to remove');
}

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('Thank you for playing Ink Tetris! 👋');
