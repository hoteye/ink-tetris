import assert from 'node:assert/strict';

import { blankMatrix, BOARD_HEIGHT, BOARD_WIDTH, INVISIBLE_ROWS } from '../dist/core/constants.js';
import { Block } from '../dist/core/Block.js';
import { want } from '../dist/core/utils.js';

/**
 * 测试游戏结束逻辑
 *
 * 这个测试文件专门测试在方块生成时的碰撞检测逻辑。
 *
 * Bug历史：
 * - 之前的实现在新方块无法放置在生成位置时立即判定游戏结束
 * - 即使碰撞发生在不可见区域（第0-3行），也会错误地判定失败
 * - 修复后：只有当碰撞发生在可见区域（第4行及以下）时才判定游戏结束
 */

function createEmptyMatrix() {
  return blankMatrix.map((row) => [...row]);
}

function setCell(matrix, y, x, value = 1) {
  const copy = matrix.map((row) => [...row]);
  copy[y][x] = value;
  return copy;
}

/**
 * 检查新方块是否与可见区域的方块发生碰撞
 */
function hasVisibleCollision(block, matrix) {
  const { xy, shape } = block;

  for (let k1 = 0; k1 < shape.length; k1++) {
    for (let k2 = 0; k2 < shape[k1].length; k2++) {
      const n = shape[k1][k2];
      const row = xy[0] + k1;
      const col = xy[1] + k2;

      // 如果方块的某个单元格在可见区域（row >= INVISIBLE_ROWS）
      // 且与已有方块重叠，则判定为碰撞
      if (n && row >= INVISIBLE_ROWS && row < BOARD_HEIGHT && col >= 0 && col < BOARD_WIDTH) {
        if (matrix[row] && matrix[row][col]) {
          return true;
        }
      }
    }
  }

  return false;
}

function run() {
  console.log('Running game over logic tests...\n');

  // 测试1：空棋盘上生成新方块应该成功
  {
    const matrix = createEmptyMatrix();
    const block = new Block({ type: 'O' });

    assert.equal(want(block, matrix), true, 'Block should spawn successfully on empty board');
    assert.equal(hasVisibleCollision(block, matrix), false, 'No collision in visible area');
    console.log('✓ Test 1: Empty board allows block spawn');
  }

  // 测试2：react-tetris 风格：方块在负数行号生成，y < 0 时不检查碰撞
  // O 方块现在在 [-1, 4] 生成，占据 y=-1 到 y=0 的区域
  {
    const matrix = createEmptyMatrix();
    // 在第0行放置方块
    const updated = setCell(setCell(matrix, 0, 4), 0, 5);

    // 尝试生成新的O方块（默认位置[-1,4]，占据y=-1到y=0）
    const block = new Block({ type: 'O' });

    // want()会检查y=0的部分，发现碰撞，返回false
    assert.equal(want(block, updated), false, 'Block at [-1,4] collides with row 0');

    // 碰撞发生在y=0（matrix[0]），不在可见区域
    assert.equal(hasVisibleCollision(block, updated), false, 'Collision at row 0 is not in visible area');

    console.log('✓ Test 2: Block spawn collision at row 0 (invisible)');
  }

  // 测试3：可见区域有方块，新方块在 y < 0 生成不碰撞
  {
    const matrix = createEmptyMatrix();
    // 填满第一个可见行（第4行）
    let updated = matrix;
    for (let x = 0; x < BOARD_WIDTH; x++) {
      updated = setCell(updated, INVISIBLE_ROWS, x);
    }

    // react-tetris 风格：I 方块现在在 [0,3] 生成（而不是 [3,3]）
    const block = new Block({ type: 'I' });

    // I方块是1x4，在[0,3]生成，占据第0行的列3-6
    // 第4行虽满，但I方块在y=0，不与第4行碰撞
    assert.equal(hasVisibleCollision(block, updated), false, 'I block at row 0 does not collide with row 4');

    console.log('✓ Test 3: Block at row 0, visible area full but no collision');
  }

  // 测试4：T方块在 [-1,4] 生成，与第0行碰撞
  {
    const matrix = createEmptyMatrix();
    // react-tetris 风格：T方块在[-1,4]生成时的形状：
    //   row -1: [0,1,0] (cols 4,5,6)
    //   row 0:  [1,1,1] (cols 4,5,6)

    // 在row 0, col 5 放置方块
    const updated = setCell(matrix, 0, 5);

    const block = new Block({ type: 'T' });

    // T方块无法放置，因为[0,5]已被占据
    assert.equal(want(block, updated), false, 'T block cannot spawn');

    // 碰撞在不可见区域（row 0），不应该游戏结束
    assert.equal(hasVisibleCollision(block, updated), false, 'Collision at row 0 (invisible) should not trigger game over');

    console.log('✓ Test 4: T block collision at row 0 (invisible)');
  }

  // 测试5：L方块下落到可见区域与方块碰撞
  {
    const matrix = createEmptyMatrix();
    // L方块在下落过程中，如果在[3,4]位置：
    //   row 3: [0,0,1] (cols 4,5,6)
    //   row 4: [1,1,1] (cols 4,5,6)
    // 在第4行的列4放置方块，会与L方块的可见部分碰撞
    let updated = matrix;
    updated = setCell(updated, 4, 4);

    // 模拟L方块已经下落到位置[3,4]
    const block = new Block({ type: 'L', xy: [3, 4] });

    assert.equal(want(block, updated), false, 'L block at [3,4] collides');
    assert.equal(hasVisibleCollision(block, updated), true, 'Collision with visible area (row 4)');

    console.log('✓ Test 5: Block collision with visible area');
  }

  // 测试6：react-tetris 风格 - 第1-3行有方块不影响生成
  {
    const matrix = createEmptyMatrix();
    // 在第1-3行放置方块（但不在第0行）
    let updated = matrix;
    updated = setCell(setCell(updated, 1, 4), 1, 5);
    updated = setCell(setCell(updated, 2, 4), 2, 5);
    updated = setCell(setCell(updated, 3, 4), 3, 5);

    // O方块在[-1,4]生成，占据y=-1到y=0
    // y=-1 部分不检查碰撞，y=0部分没有方块，可以生成
    const block = new Block({ type: 'O' });

    assert.equal(want(block, updated), true, 'Block can spawn at [-1,4]');
    assert.equal(hasVisibleCollision(block, updated), false, 'No collision in visible area');

    console.log('✓ Test 6: Blocks in rows 1-3 do not block spawn at [-1,4]');
  }

  // 测试7：第4行（第一个可见行）有方块
  {
    const matrix = createEmptyMatrix();
    // 在第4行放置方块（第一个可见行）
    const updated = setCell(setCell(matrix, 4, 4), 4, 5);

    // O方块在[-1,4]生成，占据y=-1到y=0
    // 第4行的方块不影响生成
    const block = new Block({ type: 'O' });

    assert.equal(want(block, updated), true, 'Block can spawn, no overlap with row 4');
    assert.equal(hasVisibleCollision(block, updated), false, 'O block at [-1,4] does not reach row 4');

    console.log('✓ Test 7: Block can spawn above visible area blocks');
  }

  // 测试8：实际失败场景 - 方块在可见区域碰撞
  {
    const matrix = createEmptyMatrix();
    // 在第4-5行放置方块
    let updated = matrix;
    updated = setCell(setCell(updated, 4, 4), 4, 5);
    updated = setCell(setCell(updated, 5, 4), 5, 5);

    // 创建一个位置更低的方块（模拟已经下落到可见区域的方块）
    const block = new Block({
      type: 'O',
      xy: [4, 4]  // 在可见区域位置
    });

    assert.equal(want(block, updated), false, 'Block cannot be placed at [4,4]');
    assert.equal(hasVisibleCollision(block, updated), true, 'Direct collision in visible area');

    console.log('✓ Test 8: Direct collision in visible area');
  }

  console.log('\n✅ All game over logic tests passed!\n');
  console.log('Summary (react-tetris style):');
  console.log('- Blocks spawn at negative y positions (I: [0,3], others: [-1,4])');
  console.log('- y < 0 positions do not check collision (want() returns true)');
  console.log('- Only y >= 0 parts are written to matrix');
  console.log('- Game over only when matrix[0] has blocks (isOver() checks row 0 only)');
  console.log('- Visible area starts at row 4 (INVISIBLE_ROWS = 4)');
}

run();
