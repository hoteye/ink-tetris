#!/usr/bin/env node

/**
 * 真实重现你日志中的场景
 *
 * 日志显示：
 * [LOCK BLOCK] Locking block type: O Position: [ 2, 4 ]
 * 这意味着O方块最终锁定在[2,4]，没有下落就直接锁定了！
 */

import { blankMatrix, INVISIBLE_ROWS } from '../dist/core/constants.js';
import { Block } from '../dist/core/Block.js';
import { want, mergeBlockToMatrix } from '../dist/core/utils.js';

function printBoard(matrix, title = '', highlightRow = -1) {
  if (title) console.log(`\n${title}`);
  console.log('─'.repeat(55));

  for (let row = 0; row < 6; row++) {
    const cells = matrix[row].map(cell => cell ? '█' : '·').join(' ');
    const marker = row < INVISIBLE_ROWS ? '(不可见)' : '(可见)  ';
    const highlight = row === highlightRow ? ' ← 关键行' : '';
    console.log(`行 ${row}: ${cells} ${marker}${highlight}`);
  }

  console.log('─'.repeat(55));
}

console.log('═'.repeat(60));
console.log('真实场景重现：O方块在[2,4]位置直接锁定');
console.log('═'.repeat(60));

// 创建特殊棋盘：让O方块一生成就无法下落
let matrix = blankMatrix.map(row => [...row]);

// 关键：在第3行的正下方（第4行）填满方块
// 这样O方块在[2,4]生成时，占据行2-3，列4-5
// 如果行3下方（行4）的列4-5有方块，O方块就无法下落
for (let col = 0; col < 10; col++) {
  matrix[3][col] = 1;  // 第3行填满
}

// 清空4-5列，让O方块能生成但立即被堵住
matrix[3][4] = 0;
matrix[3][5] = 0;

// 第4行也填满，堵住O方块的下落路径
for (let col = 0; col < 10; col++) {
  matrix[4][col] = 1;
}

printBoard(matrix, '【初始棋盘】第3-4行几乎全满，只留4-5列可以放O方块', 3);

console.log('\n说明：');
console.log('  - 第3行（最后一个不可见行）填满，但4-5列是空的');
console.log('  - 第4行（第一个可见行）全部填满');
console.log('  - O方块会卡在这个狭小空间');

console.log('\n\n【步骤1】O方块在默认位置[2,4]生成');
const oBlock = new Block({ type: 'O' });
console.log(`O方块位置: [${oBlock.xy[0]}, ${oBlock.xy[1]}]`);
console.log('O方块形状:');
console.log('  行2: █ █  (列4-5)');
console.log('  行3: █ █  (列4-5)');

const canPlace = want(oBlock, matrix);
console.log(`\n能否放置？ ${canPlace ? '✓ 可以' : '✗ 不可以'}`);

if (canPlace) {
  console.log('✓ O方块成功生成在[2,4]');

  // 尝试下落
  const nextBlock = oBlock.fall();
  const canFall = want(nextBlock, matrix);

  console.log(`\n尝试向下移动到[3,4]...`);
  console.log(`能否下落？ ${canFall ? '✓ 可以' : '✗ 不可以'}`);

  if (!canFall) {
    console.log('\n❌ 无法下落！');
    console.log('原因：下一个位置[3,4]会让O方块的底部到达第4行');
    console.log('      而第4行已经被占满了');
    console.log('\n⚠️  O方块立即锁定在生成位置 [2,4]');

    // 锁定方块
    matrix = mergeBlockToMatrix(oBlock, matrix);

    printBoard(matrix, '\n【O方块锁定后】位置[2,4]，完全在不可见区域');

    console.log('\n这就是日志中显示的：');
    console.log('  [LOCK BLOCK] Locking block type: O Position: [ 2, 4 ]');
    console.log('             生成 ↑          锁定 ↑');
    console.log('                    ↓');
    console.log('              没有移动过！');
  }
}

// 尝试生成下一个方块
console.log('\n\n【步骤2】尝试生成下一个方块');

// 假设下一个也是O方块（最坏情况）
const nextOBlock = new Block({ type: 'O' });
console.log(`下一个O方块也在[2,4]生成`);

const canPlaceNext = want(nextOBlock, matrix);
console.log(`能否放置？ ${canPlaceNext ? '✓ 可以' : '✗ 不可以'}`);

if (!canPlaceNext) {
  console.log('\n❌ 碰撞！之前的O方块还占据着[2,4]');

  // 分析碰撞位置
  const { xy, shape } = nextOBlock;
  let visibleCollisions = [];
  let invisibleCollisions = [];

  for (let k1 = 0; k1 < shape.length; k1++) {
    for (let k2 = 0; k2 < shape[k1].length; k2++) {
      if (shape[k1][k2]) {
        const row = xy[0] + k1;
        const col = xy[1] + k2;
        if (matrix[row][col]) {
          if (row >= INVISIBLE_ROWS) {
            visibleCollisions.push([row, col]);
          } else {
            invisibleCollisions.push([row, col]);
          }
        }
      }
    }
  }

  console.log('\n碰撞详情：');
  console.log(`  不可见区域碰撞: ${invisibleCollisions.length} 个位置`);
  invisibleCollisions.forEach(([r, c]) => {
    console.log(`    - [${r}, ${c}]`);
  });
  console.log(`  可见区域碰撞: ${visibleCollisions.length} 个位置`);
  visibleCollisions.forEach(([r, c]) => {
    console.log(`    - [${r}, ${c}]`);
  });

  console.log('\n\n' + '═'.repeat(60));
  console.log('游戏结束判定');
  console.log('═'.repeat(60));

  if (visibleCollisions.length > 0) {
    console.log('\n❌ 游戏结束 - 新方块与可见区域的方块碰撞');
    console.log('   这是正确的失败条件');
  } else {
    console.log('\n✅ 游戏继续 - 碰撞仅发生在不可见区域');
    console.log('\n【Bug所在】');
    console.log('  旧代码会在这里判定游戏结束，因为：');
    console.log('  1. want()返回false（新方块无法放置）');
    console.log('  2. 立即触发 gameOver = true');
    console.log('  3. 但实际上碰撞只在不可见区域！');
    console.log('\n【修复后】');
    console.log('  新代码会检查碰撞位置：');
    console.log('  1. want()返回false');
    console.log('  2. 检查碰撞是否在可见区域（row >= 4）');
    console.log('  3. 否，只在行2-3（不可见区）');
    console.log('  4. 游戏继续！');
  }
}

console.log('\n\n' + '═'.repeat(60));
console.log('总结：为什么O方块会在[2,4]锁定？');
console.log('═'.repeat(60));
console.log('\n1. 游戏进行到后期，方块堆积很高');
console.log('2. 第3行（最后的不可见行）几乎被填满');
console.log('3. 第4行（第一个可见行）也被填满');
console.log('4. O方块在[2,4]生成，占据行2-3，列4-5');
console.log('5. O方块尝试下落，但下方（第4行）被堵住');
console.log('6. O方块立即锁定在生成位置[2,4]');
console.log('7. 下一个方块生成时，发现[2,4]被占用');
console.log('8. 旧代码：立即判定游戏结束 ❌');
console.log('9. 新代码：检查碰撞位置，不在可见区域，继续游戏 ✅');
console.log('\n这就是"顶部还未到顶就判负"的完整过程！');
console.log('═'.repeat(60));
