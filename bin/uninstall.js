#!/usr/bin/env node

/**
 * Uninstall script for ink-tetris
 * Removes the configuration directory at ~/.ink-tetris
 *
 * Can be run as:
 * 1. Manual command: ink-tetris-uninstall
 * 2. Automatic postuninstall hook: npm uninstall -g ink-tetris
 */

import fs from 'fs';
import path from 'path';
import os from 'os';

const CONFIG_DIR = path.join(os.homedir(), '.ink-tetris');
const isAutomaticUninstall = process.argv[1]?.includes('npm');

// Only show header for manual uninstall
if (!isAutomaticUninstall) {
  console.log('🎮 Ink Tetris Uninstall');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

if (fs.existsSync(CONFIG_DIR)) {
  try {
    fs.rmSync(CONFIG_DIR, { recursive: true, force: true });
    if (!isAutomaticUninstall) {
      console.log('✅ Configuration cleaned up');
      console.log(`   Removed: ${CONFIG_DIR}`);
    }
  } catch (error) {
    if (!isAutomaticUninstall) {
      console.error('❌ Error cleaning configuration:', error);
    }
    // Don't exit with error on automatic uninstall
    if (!isAutomaticUninstall) {
      process.exit(1);
    }
  }
} else {
  if (!isAutomaticUninstall) {
    console.log('✅ No configuration found to remove');
  }
}

if (!isAutomaticUninstall) {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Thank you for playing Ink Tetris! 👋');
}
