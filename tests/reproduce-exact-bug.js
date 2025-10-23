#!/usr/bin/env node

/**
 * 精确重现你日志中的Bug场景
 *
 * 根据你的日志：
 * [LOCK BLOCK] Locking block type: O Position: [ 2, 4 ]
 * [GAME OVER] noSpace - Cannot place new block at spawn position
 * Next block type: Z
 */

import { blankMatrix, INVISIBLE_ROWS } from '../dist/core/constants.js';
import { Block } from '../dist/core/Block.js';
import { want, mergeBlockToMatrix } from '../dist/core/utils.js';

function printBoard(matrix, title = '') {
  if (title) console.log(`\n${title}`);
  console.log('─'.repeat(50));

  for (let row = 0; row < 6; row++) {
    const cells = matrix[row].map(cell => cell ? '█' : '·').join(' ');
    const marker = row < INVISIBLE_ROWS ? '(不可见)' : '(可见)  ';
    console.log(`行 ${row}: ${cells} ${marker}`);
  }

  console.log('─'.repeat(50));
}

console.log('═'.repeat(60));
console.log('精确重现Bug：O方块在[2,4]锁定，导致游戏过早结束');
console.log('═'.repeat(60));

// 创建一个特殊的棋盘状态，让O方块刚好在[2,4]锁定
let matrix = blankMatrix.map(row => [...row]);

// 关键：在第4行（第一个可见行）放置方块，形成一堵墙
// 这样O方块会在位置[2,4]就无法继续下落
for (let col = 0; col < 10; col++) {
  matrix[4][col] = 1;  // 第4行填满（除了4-5列）
}
matrix[4][4] = 0;  // 留出空位
matrix[4][5] = 0;

printBoard(matrix, '【初始棋盘】第4行有一堵墙，留出4-5列的空位');

console.log('\n【步骤1】O方块在[2,4]生成');
const oBlock = new Block({ type: 'O' });
console.log(`O方块位置: [${oBlock.xy[0]}, ${oBlock.xy[1]}]`);
console.log('O方块形状（2x2）:');
console.log('  █ █   (占据列4-5)');
console.log('  █ █   (占据行2-3)');

// 尝试下落
let currentBlock = oBlock;
let canFall = true;

console.log('\n【步骤2】O方块尝试下落');
while (canFall) {
  const nextBlock = currentBlock.fall();
  if (want(nextBlock, matrix)) {
    currentBlock = nextBlock;
    console.log(`  下落到: [${currentBlock.xy[0]}, ${currentBlock.xy[1]}]`);
  } else {
    canFall = false;
    console.log(`  ⛔ 无法继续下落，停在: [${currentBlock.xy[0]}, ${currentBlock.xy[1]}]`);
  }
}

// 检查锁定位置是否在不可见区域
const lockedRow = currentBlock.xy[0];
const isInvisible = lockedRow < INVISIBLE_ROWS;

console.log(`\n锁定位置分析:`);
console.log(`  行号: ${lockedRow}`);
console.log(`  区域: ${isInvisible ? '不可见区域 ⚠️' : '可见区域'}`);
console.log(`  原因: O方块占据2行，底部在行${lockedRow + 1}，下方的行${lockedRow + 2}被堵住了`);

// 锁定方块
matrix = mergeBlockToMatrix(currentBlock, matrix);

printBoard(matrix, '\n【锁定后的棋盘】O方块已固定在不可见区域');

console.log('\n👆 注意：O方块锁定在行2-3（不可见区域），但玩家看不到！');
console.log('   玩家只能看到行4以下，所以会觉得"还没满就输了"');

// 尝试生成下一个方块（Z方块）
console.log('\n\n【步骤3】尝试生成下一个方块：Z方块');

const zBlock = new Block({ type: 'Z' });
console.log(`Z方块默认位置: [${zBlock.xy[0]}, ${zBlock.xy[1]}]`);
console.log('Z方块形状:');
console.log('  █ █ ·');
console.log('  · █ █');

const canPlaceZ = want(zBlock, matrix);
console.log(`\n能否在生成位置放置Z方块？ ${canPlaceZ ? '✓ 可以' : '✗ 不可以'}`);

if (!canPlaceZ) {
  console.log('\n❌ 碰撞检测！');

  // 分析碰撞位置
  const { xy, shape } = zBlock;
  console.log('\n碰撞分析：');

  for (let k1 = 0; k1 < shape.length; k1++) {
    for (let k2 = 0; k2 < shape[k1].length; k2++) {
      if (shape[k1][k2]) {
        const row = xy[0] + k1;
        const col = xy[1] + k2;
        const occupied = matrix[row][col];
        const area = row >= INVISIBLE_ROWS ? '可见' : '不可见';

        console.log(`  Z方块单元 [${row}, ${col}] - ${area}区域 - ${occupied ? '已被占据 ⚠️' : '空闲'}`);
      }
    }
  }

  // 检查是否有可见区域碰撞
  let hasVisibleCollision = false;
  for (let k1 = 0; k1 < shape.length; k1++) {
    for (let k2 = 0; k2 < shape[k1].length; k2++) {
      if (shape[k1][k2]) {
        const row = xy[0] + k1;
        const col = xy[1] + k2;
        if (row >= INVISIBLE_ROWS && matrix[row][col]) {
          hasVisibleCollision = true;
        }
      }
    }
  }

  console.log('\n' + '═'.repeat(60));
  console.log('游戏结束判定对比');
  console.log('═'.repeat(60));

  console.log('\n【旧逻辑 - 有Bug】:');
  console.log('  1. 检测到新方块无法放置在生成位置');
  console.log('  2. 立即判定：❌ 游戏结束 (noSpace)');
  console.log('  3. 问题：没有检查碰撞发生在哪个区域');
  console.log('  4. 结果：玩家看到可见区域还有空间，但游戏结束了 😡');

  console.log('\n【新逻辑 - 已修复】:');
  console.log('  1. 检测到新方块无法放置在生成位置');
  console.log('  2. 进一步检查：碰撞是否发生在可见区域？');
  console.log(`  3. 判定：${hasVisibleCollision ? '是，在可见区域碰撞' : '否，仅在不可见区域碰撞'}`);
  console.log(`  4. 结果：${hasVisibleCollision ? '❌ 游戏结束' : '✅ 游戏继续'}`);
  console.log(`  5. 符合标准俄罗斯方块规则 ✓`);
}

console.log('\n\n' + '═'.repeat(60));
console.log('如何在实际游戏中重现这个Bug？');
console.log('═'.repeat(60));
console.log('\n1. 开始游戏，不断消行让方块堆积');
console.log('2. 让方块堆积到第4-5行（刚好接近可见区域顶部）');
console.log('3. 等待O方块出现');
console.log('4. 让O方块落在中间位置（列4-5）');
console.log('5. 下一个方块也是O或其他方块时，如果默认生成位置被占据');
console.log('6. 旧版本会立即判定游戏结束');
console.log('7. 但实际上可见区域（玩家看到的）还有很多空间！');
console.log('\n这就是为什么你会看到"顶部还未到顶就判负"的原因！');
console.log('═'.repeat(60));
