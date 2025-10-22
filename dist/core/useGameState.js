import { useState, useCallback, useEffect, useRef } from 'react';
import { Block } from './Block.js';
import { getNextType, want, mergeBlockToMatrix, clearFullLines, isOver, calculatePoints, } from './utils.js';
import { blankMatrix, speeds, eachLines, maxPoint } from './constants.js';
import { getAudioService } from '../audio/audioService.js';
export function useGameState() {
    const [state, setState] = useState({
        matrix: blankMatrix.map((row) => [...row]),
        currentBlock: null,
        nextBlockType: getNextType(),
        score: 0,
        lines: 0,
        speedLevel: 1,
        isPaused: false,
        isGameOver: false,
        gameOverReason: null,
        isStarted: false,
        soundEnabled: true,
    });
    const fallIntervalRef = useRef(null);
    const audioService = getAudioService({ enabled: state.soundEnabled });
    // 开始游戏
    const startGame = useCallback(() => {
        const firstType = state.nextBlockType;
        const nextType = getNextType();
        setState({
            matrix: blankMatrix.map((row) => [...row]),
            currentBlock: new Block({ type: firstType }),
            nextBlockType: nextType,
            score: 0,
            lines: 0,
            speedLevel: 1,
            isPaused: false,
            isGameOver: false,
            gameOverReason: null,
            isStarted: true,
            soundEnabled: state.soundEnabled,
        });
        // Start background music
        audioService.playBackgroundMusic(120);
    }, [state.nextBlockType, state.soundEnabled, audioService]);
    // 暂停/继续
    const togglePause = useCallback(() => {
        setState((prev) => ({
            ...prev,
            isPaused: !prev.isPaused,
        }));
        audioService.playPause();
    }, [audioService]);
    // 切换声音
    const toggleSound = useCallback(() => {
        setState((prev) => ({
            ...prev,
            soundEnabled: !prev.soundEnabled,
        }));
        audioService.setConfig({ enabled: !state.soundEnabled });
    }, [state.soundEnabled, audioService]);
    // 锁定方块并生成新方块
    const lockBlock = useCallback(() => {
        setState((prev) => {
            if (!prev.currentBlock || prev.isGameOver || prev.isPaused) {
                return prev;
            }
            // 合并方块到矩阵
            let newMatrix = mergeBlockToMatrix(prev.currentBlock, prev.matrix);
            // 消除完整的行
            const { matrix: clearedMatrix, cleared } = clearFullLines(newMatrix);
            newMatrix = clearedMatrix;
            // 计算分数
            const points = calculatePoints(cleared, prev.speedLevel);
            const newScore = Math.min(prev.score + points + 10 + prev.speedLevel * 2, maxPoint);
            const newLines = prev.lines + cleared;
            // 计算新速度等级
            const newSpeedLevel = Math.min(Math.floor(newLines / eachLines) + 1, 6);
            // 生成新方块
            const nextBlock = new Block({ type: prev.nextBlockType });
            const nextNextType = getNextType();
            // 检查游戏是否结束，并记录失败原因
            let gameOverReason = null;
            let gameOver = false;
            if (isOver(newMatrix)) {
                // 方块堆积到顶部
                gameOverReason = 'topBlocked';
                gameOver = true;
            }
            else if (!want(nextBlock, newMatrix)) {
                // 新方块无法放置
                gameOverReason = 'noSpace';
                gameOver = true;
            }
            // 播放音效
            if (gameOver) {
                audioService.playGameOver();
            }
            else if (cleared > 0) {
                audioService.playLineCleared();
            }
            else {
                audioService.playBlockPlaced();
            }
            // 更新音乐速度（根据等级调整）
            const tempos = [120, 130, 140, 150, 160, 170];
            audioService.updateMusicTempo(tempos[newSpeedLevel - 1]);
            return {
                ...prev,
                matrix: newMatrix,
                currentBlock: gameOver ? null : nextBlock,
                nextBlockType: nextNextType,
                score: newScore,
                lines: newLines,
                speedLevel: newSpeedLevel,
                isGameOver: gameOver,
                gameOverReason,
            };
        });
    }, [audioService]);
    // 移动方块
    const moveBlock = useCallback((direction) => {
        setState((prev) => {
            if (!prev.currentBlock || prev.isGameOver || prev.isPaused || !prev.isStarted) {
                return prev;
            }
            let nextBlock;
            switch (direction) {
                case 'left':
                    nextBlock = prev.currentBlock.left();
                    break;
                case 'right':
                    nextBlock = prev.currentBlock.right();
                    break;
                case 'down':
                    nextBlock = prev.currentBlock.fall();
                    break;
                case 'rotate':
                    nextBlock = prev.currentBlock.rotate();
                    break;
            }
            // 检查是否可以移动
            if (want(nextBlock, prev.matrix)) {
                return { ...prev, currentBlock: nextBlock };
            }
            // 如果是向下移动且碰撞，锁定方块
            if (direction === 'down') {
                // 延迟锁定，在下一个 tick 执行
                setTimeout(lockBlock, 0);
            }
            return prev;
        });
    }, [lockBlock]);
    // 硬下落
    const hardDrop = useCallback(() => {
        setState((prev) => {
            if (!prev.currentBlock || prev.isGameOver || prev.isPaused || !prev.isStarted) {
                return prev;
            }
            let currentBlock = prev.currentBlock;
            let dropDistance = 0;
            // 找到最底部位置
            while (true) {
                const nextBlock = currentBlock.fall();
                if (!want(nextBlock, prev.matrix)) {
                    break;
                }
                currentBlock = nextBlock;
                dropDistance++;
            }
            // 立即锁定
            setTimeout(lockBlock, 0);
            return { ...prev, currentBlock };
        });
    }, [lockBlock]);
    // 自动下落
    useEffect(() => {
        if (!state.isStarted || state.isPaused || state.isGameOver || !state.currentBlock) {
            if (fallIntervalRef.current) {
                clearInterval(fallIntervalRef.current);
                fallIntervalRef.current = null;
            }
            return;
        }
        const speed = speeds[state.speedLevel - 1];
        fallIntervalRef.current = setInterval(() => {
            moveBlock('down');
        }, speed);
        return () => {
            if (fallIntervalRef.current) {
                clearInterval(fallIntervalRef.current);
            }
        };
    }, [state.isStarted, state.isPaused, state.isGameOver, state.speedLevel, state.currentBlock, moveBlock]);
    return {
        state,
        startGame,
        togglePause,
        moveBlock,
        hardDrop,
        toggleSound,
    };
}
