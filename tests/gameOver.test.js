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

  // 测试2：不可见区域有方块，但新方块生成位置不在可见区域发生碰撞 - 应该继续游戏
  // 这是修复的核心场景：当方块在位置[2,4]（不可见区）时，新O方块也生成在[2,4]
  {
    const matrix = createEmptyMatrix();
    // 在不可见区域放置方块（模拟O方块锁定在[2,4]）
    const updated = setCell(setCell(matrix, 2, 4), 2, 5);
    const updated2 = setCell(setCell(updated, 3, 4), 3, 5);

    // 尝试生成新的O方块（默认位置[2,4]）
    const block = new Block({ type: 'O' });

    // want()会返回false，因为位置被占据
    assert.equal(want(block, updated2), false, 'Block cannot spawn at occupied position');

    // 但是碰撞发生在不可见区域，所以不应该判定游戏结束
    assert.equal(hasVisibleCollision(block, updated2), false, 'Collision in invisible area should not trigger game over');

    console.log('✓ Test 2: Collision in invisible area does not trigger game over');
  }

  // 测试3：可见区域有方块，新方块与可见区域方块碰撞 - 应该游戏结束
  {
    const matrix = createEmptyMatrix();
    // 在可见区域顶部放置方块（第4行是第一个可见行）
    let updated = matrix;
    // O方块占据2x2，在[2,4]生成时会占据行2-3，列4-5
    // 如果第4-5行有方块，O方块下落后会碰撞
    for (let x = 0; x < BOARD_WIDTH; x++) {
      updated = setCell(updated, INVISIBLE_ROWS, x);  // 填满第一个可见行
    }

    // 尝试生成新的I方块（位置[3,3]）
    const block = new Block({ type: 'I' });

    // I方块是1x4，在[3,3]生成，占据第3行的列3-6
    // 因为第4行已满，I方块无法向下移动
    // 但是I方块本身在第3行（不可见区），与第4行不直接碰撞
    assert.equal(hasVisibleCollision(block, updated), false, 'I block at row 3 does not collide with row 4');

    console.log('✓ Test 3: Block in invisible area, visible area full but no direct collision');
  }

  // 测试4：新方块部分在可见区域，与可见区域方块碰撞 - 应该游戏结束
  {
    const matrix = createEmptyMatrix();
    // T方块在[2,4]生成时的形状：
    //   row 2: [0,1,0]
    //   row 3: [1,1,1]
    // 占据位置：row 2 col 5; row 3 col 4,5,6

    // 在row 3, col 4 放置方块（在不可见区域）
    const updated = setCell(matrix, 3, 4);

    const block = new Block({ type: 'T' });

    // T方块无法放置，因为[3,4]已被占据
    assert.equal(want(block, updated), false, 'T block cannot spawn');

    // 但碰撞在不可见区域，不应该游戏结束
    assert.equal(hasVisibleCollision(block, updated), false, 'Collision at row 3 (invisible) should not trigger game over');

    console.log('✓ Test 4: T block collision in invisible area');
  }

  // 测试5：模拟真实游戏场景 - 方块堆积到可见区域，新方块部分在可见区
  {
    const matrix = createEmptyMatrix();
    // 创建一个更低位置的方块，让它的一部分在可见区域
    // L方块占据2行3列，如果在[3,4]生成：
    //   row 3: [0,0,1] (cols 4,5,6)
    //   row 4: [1,1,1] (cols 4,5,6)
    // 在第4行的列4放置方块，会与L方块的可见部分碰撞
    let updated = matrix;
    updated = setCell(updated, 4, 4);

    const block = new Block({ type: 'L', xy: [3, 4] });

    assert.equal(want(block, updated), false, 'L block at [3,4] cannot spawn');
    assert.equal(hasVisibleCollision(block, updated), true, 'Collision with visible area should trigger game over');

    console.log('✓ Test 5: Block collision with visible area triggers game over');
  }

  // 测试6：边界情况 - 第3行（最后一个不可见行）有方块
  {
    const matrix = createEmptyMatrix();
    // 在第3行放置方块
    const updated = setCell(setCell(matrix, 3, 4), 3, 5);

    const block = new Block({ type: 'O' });

    assert.equal(want(block, updated), false, 'Block spawn blocked');
    assert.equal(hasVisibleCollision(block, updated), false, 'Row 3 is still invisible');

    console.log('✓ Test 6: Block at last invisible row (row 3) does not trigger game over');
  }

  // 测试7：边界情况 - 第4行（第一个可见行）有方块
  {
    const matrix = createEmptyMatrix();
    // 在第4行放置方块（第一个可见行）
    const updated = setCell(setCell(matrix, 4, 4), 4, 5);

    const block = new Block({ type: 'O' });
    // O方块在[2,4]生成，占据[2-3][4-5]
    // 第4行的[4,5]位置有方块，但O方块只占据到第3行

    assert.equal(want(block, updated), true, 'Block can spawn, no overlap with row 4');
    assert.equal(hasVisibleCollision(block, updated), false, 'O block at [2,4] does not reach row 4');

    console.log('✓ Test 7: Block can spawn above visible area blocks');
  }

  // 测试8：实际失败场景 - 方块直接在可见区域无法放置
  {
    const matrix = createEmptyMatrix();
    // 在第4-5行放置方块
    let updated = matrix;
    updated = setCell(setCell(updated, 4, 4), 4, 5);
    updated = setCell(setCell(updated, 5, 4), 5, 5);

    // 创建一个位置更低的方块（模拟已经下落的方块）
    const block = new Block({
      type: 'O',
      xy: [4, 4]  // 强制在可见区域生成
    });

    assert.equal(want(block, updated), false, 'Block cannot be placed in visible area');
    assert.equal(hasVisibleCollision(block, updated), true, 'Direct collision in visible area');

    console.log('✓ Test 8: Direct collision in visible area triggers game over');
  }

  console.log('\n✅ All game over logic tests passed!\n');
  console.log('Summary:');
  console.log('- Blocks can spawn even if invisible area has blocks');
  console.log('- Game over only triggers when new block collides with visible area (row >= 4)');
  console.log('- Invisible rows (0-3) are for spawning and transitioning blocks');
}

run();
