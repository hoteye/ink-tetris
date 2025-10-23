#!/usr/bin/env node

/**
 * 重现游戏结束判定 Bug
 *
 * 这个脚本演示了导致过早游戏结束的场景：
 * 1. 方块堆积到接近不可见区域的边界
 * 2. O方块在不可见区域（第2-3行）锁定
 * 3. 下一个O方块也尝试在[2,4]生成
 * 4. 旧逻辑会立即判定游戏结束（错误！）
 * 5. 新逻辑检查碰撞是否在可见区域，这里不是，所以继续游戏（正确！）
 */

import { blankMatrix, INVISIBLE_ROWS, BOARD_WIDTH } from '../dist/core/constants.js';
import { Block } from '../dist/core/Block.js';
import { want, mergeBlockToMatrix } from '../dist/core/utils.js';

// 创建空矩阵
function createEmptyMatrix() {
  return blankMatrix.map((row) => [...row]);
}

// 打印棋盘状态
function printBoard(matrix, highlightRows = []) {
  console.log('\n棋盘状态（前8行，包含不可见区域）：');
  console.log('─'.repeat(50));

  for (let row = 0; row < 8; row++) {
    const rowData = matrix[row];
    const cells = rowData.map(cell => cell ? '█' : '·').join(' ');
    const marker = row < INVISIBLE_ROWS ? '(不可见)' : '(可见)  ';
    const highlight = highlightRows.includes(row) ? ' ← 注意这行' : '';

    console.log(`行 ${row}: ${cells} ${marker}${highlight}`);
  }

  console.log('─'.repeat(50));
  console.log(`不可见区域: 行 0-${INVISIBLE_ROWS - 1}`);
  console.log(`可见区域:   行 ${INVISIBLE_ROWS}-19\n`);
}

console.log('═'.repeat(60));
console.log('重现场景：O方块在不可见区域锁定，导致过早游戏结束');
console.log('═'.repeat(60));

// 步骤1：创建一个堆积较高的棋盘
console.log('\n【步骤1】创建堆积较高的棋盘');
console.log('模拟游戏进行到中后期，方块已经堆积到第5行');

let matrix = createEmptyMatrix();

// 在第5-19行填充方块（留一些空隙）
for (let row = 5; row < 20; row++) {
  for (let col = 0; col < BOARD_WIDTH; col++) {
    // 留一些空隙，避免消行
    if (col < 3 || col > 6) {
      matrix[row][col] = 1;
    }
  }
}

printBoard(matrix);

// 步骤2：第一个O方块在默认位置[2,4]生成
console.log('\n【步骤2】第一个O方块在位置 [2,4] 生成');
console.log('O方块占据：行2-3，列4-5（完全在不可见区域）');

const block1 = new Block({ type: 'O' });
console.log(`O方块坐标: [${block1.xy[0]}, ${block1.xy[1]}]`);
console.log(`O方块形状:`);
console.log('  █ █');
console.log('  █ █');

// 检查能否放置
const canPlace1 = want(block1, matrix);
console.log(`\n能否放置？ ${canPlace1 ? '✓ 可以' : '✗ 不可以'}`);

if (canPlace1) {
  console.log('O方块开始下落...');

  // 模拟下落：尝试向下移动，直到无法移动
  let currentBlock = block1;
  let fallDistance = 0;

  while (true) {
    const nextBlock = currentBlock.fall();
    if (!want(nextBlock, matrix)) {
      break;
    }
    currentBlock = nextBlock;
    fallDistance++;
  }

  console.log(`下落了 ${fallDistance} 格`);
  console.log(`最终位置: [${currentBlock.xy[0]}, ${currentBlock.xy[1]}]`);

  // 判断是否在不可见区域锁定
  const lockedInInvisible = currentBlock.xy[0] < INVISIBLE_ROWS;
  console.log(`锁定位置: ${lockedInInvisible ? '不可见区域 ⚠️' : '可见区域'}`);

  // 合并方块到矩阵
  matrix = mergeBlockToMatrix(currentBlock, matrix);

  console.log('\n锁定后的棋盘：');
  printBoard(matrix, [currentBlock.xy[0], currentBlock.xy[0] + 1]);
}

// 步骤3：尝试生成第二个O方块
console.log('\n【步骤3】尝试生成第二个O方块');
console.log('新的O方块也会在 [2,4] 生成（默认位置）');

const block2 = new Block({ type: 'O' });
console.log(`第二个O方块坐标: [${block2.xy[0]}, ${block2.xy[1]}]`);

const canPlace2 = want(block2, matrix);
console.log(`\n能否放置在生成位置？ ${canPlace2 ? '✓ 可以' : '✗ 不可以'}`);

if (!canPlace2) {
  console.log('\n⚠️  碰撞检测到冲突！');
  console.log('位置 [2,4] 和 [3,5] 已被之前的O方块占据');

  // 检查碰撞发生在哪个区域
  const { xy, shape } = block2;
  let collisionDetails = [];

  for (let k1 = 0; k1 < shape.length; k1++) {
    for (let k2 = 0; k2 < shape[k1].length; k2++) {
      if (shape[k1][k2]) {
        const row = xy[0] + k1;
        const col = xy[1] + k2;
        if (matrix[row][col]) {
          collisionDetails.push({
            row,
            col,
            isVisible: row >= INVISIBLE_ROWS
          });
        }
      }
    }
  }

  console.log('\n碰撞详情：');
  collisionDetails.forEach(({ row, col, isVisible }) => {
    console.log(`  - 位置 [${row}, ${col}] ${isVisible ? '(可见区域)' : '(不可见区域)'}`);
  });

  const hasVisibleCollision = collisionDetails.some(d => d.isVisible);

  console.log('\n═'.repeat(60));
  console.log('判定结果：');
  console.log('═'.repeat(60));

  if (hasVisibleCollision) {
    console.log('❌ 游戏结束 - 碰撞发生在可见区域');
    console.log('这是正确的失败判定');
  } else {
    console.log('✅ 游戏继续 - 碰撞仅在不可见区域');
    console.log('');
    console.log('【旧逻辑（Bug）】');
    console.log('  ❌ 检测到碰撞 → 立即判定游戏结束');
    console.log('  ❌ 没有区分碰撞发生在哪个区域');
    console.log('  ❌ 结果：玩家觉得"还没堆满就输了"');
    console.log('');
    console.log('【新逻辑（修复后）】');
    console.log('  ✓ 检测到碰撞');
    console.log('  ✓ 检查碰撞位置：不可见区域（行0-3）');
    console.log('  ✓ 不可见区域的碰撞不算失败');
    console.log('  ✓ 结果：游戏继续，符合标准俄罗斯方块规则');
  }
}

console.log('\n═'.repeat(60));
console.log('总结');
console.log('═'.repeat(60));
console.log('');
console.log('这就是为什么会"顶部还未到顶就判负"的原因：');
console.log('');
console.log('1. 不可见区域（行0-3）是用来生成和过渡方块的');
console.log('2. 当方块堆积较高时，新方块可能在不可见区域就锁定了');
console.log('3. 下一个方块生成时，可能与不可见区域的方块重叠');
console.log('4. 旧代码会立即判定失败，但这是错误的');
console.log('5. 正确做法：只有碰撞发生在可见区域（行4+）才算失败');
console.log('');
console.log('修复后，游戏只在真正"堆到顶"时才结束！');
console.log('═'.repeat(60));
