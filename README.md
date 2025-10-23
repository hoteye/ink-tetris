# Ink Tetris

[![npm version](https://badge.fury.io/js/ink-tetris.svg)](https://badge.fury.io/js/ink-tetris)
[![npm downloads](https://img.shields.io/npm/dm/ink-tetris.svg)](https://www.npmjs.com/package/ink-tetris)
[![license](https://img.shields.io/npm/l/ink-tetris.svg)](https://github.com/hoteye/ink-tetris/blob/master/LICENSE)

A terminal-based Tetris game built with [Ink](https://github.com/vadimdemedes/ink).

## Installation

### Via npm (Recommended)

```bash
# Global install
npm install -g ink-tetris

# Run anywhere
ink-tetris
```

### Or run directly with npx

```bash
npx ink-tetris
```

### From source

```bash
git clone https://github.com/hoteye/ink-tetris.git
cd ink-tetris
npm install
npm run build
npm start
```

## Gameplay

![Ink Tetris Game Screen](https://raw.githubusercontent.com/hoteye/ink-tetris/master/screenshot.png)

## Controls

- **Left/Right Arrow** : Move left/right
- **Up Arrow** : Rotate piece
- **Down Arrow** : Soft drop
- **Space** : Hard drop
- **P** : Pause
- **R** : Start/Restart
- **I** : Show scoring rules
- **L** : Change language
- **Q** : Quit

## Features

- 7 classic tetromino shapes
- 6 speed levels (increases every 20 lines)
- Next piece preview
- Score and level tracking
- Pause functionality
- Built-in internationalization (English, 中文, 日本語, 한국어, Français, Español)

## Credits

Inspired by [react-tetris](https://github.com/chvin/react-tetris) by @chvin

## License

ISC
