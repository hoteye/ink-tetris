#!/usr/bin/env node

/**
 * Postuninstall script for ink-tetris
 * Removes the configuration directory at ~/.ink-tetris
 *
 * This script runs automatically when npm uninstall is executed
 */

import fs from 'fs';
import path from 'path';
import os from 'os';

const CONFIG_DIR = path.join(os.homedir(), '.ink-tetris');

if (fs.existsSync(CONFIG_DIR)) {
  try {
    fs.rmSync(CONFIG_DIR, { recursive: true, force: true });
  } catch (error) {
    // Silently fail - don't disrupt the uninstall process
  }
}
