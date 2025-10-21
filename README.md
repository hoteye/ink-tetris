# Ink Tetris

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

## Controls

- **Left/Right Arrow** : Move left/right
- **Up Arrow** : Rotate piece
- **Down Arrow** : Soft drop
- **Space** : Hard drop
- **P** : Pause
- **R** : Start/Restart
- **Q** : Quit

## Features

- 7 classic tetromino shapes
- 6 speed levels (increases every 20 lines)
- Next piece preview
- Score and level tracking
- Pause functionality

## Credits

Inspired by [react-tetris](https://github.com/chvin/react-tetris) by @chvin

## License

ISC
