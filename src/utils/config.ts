import fs from 'fs';
import path from 'path';
import os from 'os';

// 配置文件路径
const CONFIG_DIR = path.join(os.homedir(), '.ink-tetris');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

export interface GameConfig {
  language?: string;
  // 后续可添加其他配置，如音量、难度等
  [key: string]: any;
}

/**
 * 确保配置目录存在
 */
function ensureConfigDir(): void {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
}

/**
 * 读取配置文件
 */
export function loadConfig(): GameConfig {
  try {
    ensureConfigDir();
    if (fs.existsSync(CONFIG_FILE)) {
      const data = fs.readFileSync(CONFIG_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading config:', error);
  }
  return {};
}

/**
 * 保存配置文件
 */
export function saveConfig(config: GameConfig): void {
  try {
    ensureConfigDir();
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
  } catch (error) {
    console.error('Error saving config:', error);
  }
}

/**
 * 清除所有配置（用于卸载）
 */
export function clearConfig(): void {
  try {
    if (fs.existsSync(CONFIG_DIR)) {
      fs.rmSync(CONFIG_DIR, { recursive: true, force: true });
      console.log(`Configuration directory cleared: ${CONFIG_DIR}`);
    }
  } catch (error) {
    console.error('Error clearing config:', error);
  }
}

/**
 * 获取配置目录路径（用于向用户显示）
 */
export function getConfigDir(): string {
  return CONFIG_DIR;
}
