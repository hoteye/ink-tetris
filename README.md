# Ink Tetris

A feature-rich Tetris game for the terminal, built with [Ink](https://github.com/vadimdemedes/ink) and inspired by [react-tetris](https://github.com/chvin/react-tetris).

## Features

✨ **Authentic Tetris Experience**
- 7 classic tetromino shapes (I, O, T, S, Z, J, L)
- Accurate collision detection
- Wall kicks and rotation system (SRS-inspired)
- Line clearing with cascading effects
- Progressive difficulty (6 speed levels)

🎮 **Gameplay**
- Soft drop and hard drop mechanics
- Next piece preview
- Score tracking with multipliers
- Lines cleared counter
- Level progression (increases every 20 lines)
- Pause functionality

🎨 **Visual Design**
- Colorful blocks matching classic Tetris
- Clean terminal UI with borders
- Real-time game state display
- Responsive controls

## Installation

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Start the game
npm start
```

## How to Play

### Controls

- **←/→** : Move left/right
- **↑** : Rotate piece clockwise
- **↓** : Soft drop (move down faster)
- **Space** : Hard drop (instant drop to bottom)
- **P** : Pause/unpause game
- **R** : Start/restart game
- **Q** : Quit game

### Scoring

- **Single line**: 100 points
- **Double lines**: 300 points
- **Triple lines**: 700 points
- **Tetris (4 lines)**: 1500 points
- **Lock bonus**: 10 + (level × 2) points per piece

### Speed Levels

The game features 6 speed levels that progressively increase as you clear more lines:

| Level | Speed (ms) | Lines Required |
|-------|-----------|----------------|
| 1     | 800       | 0              |
| 2     | 650       | 20             |
| 3     | 500       | 40             |
| 4     | 370       | 60             |
| 5     | 250       | 80             |
| 6     | 160       | 100            |

## Project Structure

```
src/
├── core/
│   ├── constants.ts       # Game constants (shapes, speeds, scoring)
│   ├── Block.ts           # Block class with rotation logic
│   ├── utils.ts           # Collision detection, line clearing
│   └── useGameState.ts    # Game state management hook
├── components/
│   ├── GameBoard.tsx      # Main game board display
│   ├── NextBlock.tsx      # Next piece preview
│   ├── GameInfo.tsx       # Score, lines, level display
│   └── Controls.tsx       # Controls help panel
├── App.tsx                # Main application component
└── index.tsx              # Entry point
```

## Technical Highlights

### Game Logic (inspired by react-tetris)

1. **Block Representation**: Each tetromino is represented as a 2D matrix with rotation state tracking
2. **Collision Detection**: Checks boundaries and existing blocks before allowing moves
3. **SRS-like Rotation**: Implements rotation with offset corrections for natural gameplay
4. **Precise Timing**: Uses speed-based intervals that decrease with level progression
5. **State Management**: React hooks-based state management instead of Redux

### Differences from react-tetris

- Uses **React Hooks** instead of Redux for simpler state management
- Designed for **terminal rendering** with Ink instead of browser DOM
- Simplified music/sound system (terminal limitations)
- No localStorage persistence (can be added)
- Focus on core gameplay mechanics

## Comparison with Original react-tetris

| Feature | react-tetris | ink-tetris |
|---------|-------------|------------|
| UI Framework | React DOM | Ink (React for CLI) |
| State Management | Redux + Immutable.js | React Hooks |
| Block Rotation | SRS with origin offsets | Same algorithm |
| Speed System | 6 levels (800-160ms) | ✓ Same |
| Scoring | Points + multipliers | ✓ Same |
| Line Clearing | Full row detection | ✓ Same |
| Music/Sound | Yes (Web Audio) | Not implemented |
| Persistence | localStorage | Not implemented |
| Mobile Support | Touch controls | N/A (terminal-only) |

## Credits

- Game logic inspired by [react-tetris](https://github.com/chvin/react-tetris) by @chvin
- Built with [Ink](https://github.com/vadimdemedes/ink) by @vadimdemedes
- Original Tetris created by Alexey Pajitnov

## License

ISC

## Future Improvements

- [ ] Add localStorage for high score persistence
- [ ] Add ghost piece (preview of landing position)
- [ ] Add hold piece functionality
- [ ] Add combo detection and bonuses
- [ ] Add T-spin detection
- [ ] Add customizable key bindings
- [ ] Add different game modes (Marathon, Sprint, Ultra)
