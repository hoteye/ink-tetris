#!/usr/bin/env node

/**
 * react-tetris vs ink-tetris 游戏结束判定对比分析
 */

console.log('═'.repeat(70));
console.log('react-tetris 游戏结束判定分析');
console.log('═'.repeat(70));

console.log('\n【关键发现】react-tetris 的 isOver() 实现非常简洁！\n');

console.log('react-tetris/src/unit/index.js:73-75');
console.log('```javascript');
console.log('isOver(matrix) {');
console.log('  return matrix.get(0).some(n => !!n);  // 只检查第0行！');
console.log('}');
console.log('```');

console.log('\n这个实现只检查 matrix[0]（第一行），如果第一行有任何方块，游戏结束！\n');

console.log('═'.repeat(70));
console.log('react-tetris 的方块生成位置');
console.log('═'.repeat(70));

console.log('\nreact-tetris/src/unit/block.js:');
console.log('  I 方块：xy = [0, 3]   （第0行，列3）');
console.log('  其他方块：xy = [-1, 4] （第-1行，列4）← 注意是负数！\n');

console.log('关键理解：');
console.log('  - react-tetris 使用负数行号表示"在可见区域上方"');
console.log('  - 当方块在 y < 0 时，它们在"spawn zone"，还没进入棋盘');
console.log('  - 只有当方块下落到 y >= 0 并锁定时，才会写入 matrix');

console.log('\n═'.repeat(70));
console.log('react-tetris 的 want() 函数 - 碰撞检测');
console.log('═'.repeat(70));

console.log('\nreact-tetris/src/unit/index.js:33-60');
console.log('```javascript');
console.log('want(next, matrix) {');
console.log('  const xy = next.xy;');
console.log('  const shape = next.shape;');
console.log('  return shape.every((m, k1) => (');
console.log('    m.every((n, k2) => {');
console.log('      if (xy[1] < 0) return false;        // 左边界');
console.log('      if (xy[1] + horizontal > 10) return false; // 右边界');
console.log('      if (xy[0] + k1 < 0) return true;    // ← 关键！上方允许！');
console.log('      if (xy[0] + k1 >= 20) return false; // 底边界');
console.log('      if (n) {');
console.log('        if (matrix.get(xy[0] + k1).get(xy[1] + k2)) {');
console.log('          return false;  // 碰撞检测');
console.log('        }');
console.log('        return true;');
console.log('      }');
console.log('      return true;');
console.log('    })');
console.log('  ));');
console.log('}');
console.log('```');

console.log('\n关键行：`if (xy[0] + k1 < 0) return true;`');
console.log('  - 如果方块的某个单元格在 y < 0（上方），直接返回 true');
console.log('  - 这意味着：方块在上方时，不检查碰撞！');
console.log('  - 允许方块部分在上方，部分在棋盘内');

console.log('\n═'.repeat(70));
console.log('react-tetris 的方块锁定逻辑');
console.log('═'.repeat(70));

console.log('\nreact-tetris/src/control/states.js:78-83');
console.log('```javascript');
console.log('shape.forEach((m, k1) => (');
console.log('  m.forEach((n, k2) => {');
console.log('    if (n && xy.get(0) + k1 >= 0) { // ← 关键！只锁定 y >= 0 的部分');
console.log('      let line = matrix.get(xy.get(0) + k1);');
console.log('      line = line.set(xy.get(1) + k2, 1);');
console.log('      matrix = matrix.set(xy.get(0) + k1, line);');
console.log('    }');
console.log('  })');
console.log('));');
console.log('```');

console.log('\n关键判断：`if (n && xy.get(0) + k1 >= 0)`');
console.log('  - 只有当方块单元格的 y 坐标 >= 0 时，才写入 matrix');
console.log('  - 如果方块部分在 y < 0，这部分不会写入 matrix');
console.log('  - 这确保了 matrix[0] 只有在方块真正"进入"棋盘时才有内容');

console.log('\n═'.repeat(70));
console.log('react-tetris 的游戏结束触发流程');
console.log('═'.repeat(70));

console.log('\nreact-tetris/src/control/states.js:113-119');
console.log('```javascript');
console.log('if (isOver(matrix)) {');
console.log('  if (music.gameover) {');
console.log('    music.gameover();');
console.log('  }');
console.log('  states.overStart();');
console.log('  return;');
console.log('}');
console.log('```');

console.log('\n触发时机：');
console.log('  1. 方块锁定后，调用 nextAround(matrix)');
console.log('  2. 检查 isOver(matrix)');
console.log('  3. 如果 matrix[0] 有方块，游戏结束');

console.log('\n游戏结束场景：');
console.log('  - 方块堆积到第0行');
console.log('  - 新方块锁定时，部分单元格在 y = 0');
console.log('  - matrix[0] 被写入');
console.log('  - isOver() 返回 true');

console.log('\n\n═'.repeat(70));
console.log('对比：react-tetris vs ink-tetris (旧版本)');
console.log('═'.repeat(70));

console.log('\n┌─────────────────────┬─────────────────────┬─────────────────────┐');
console.log('│ 特性                │ react-tetris        │ ink-tetris (旧)     │');
console.log('├─────────────────────┼─────────────────────┼─────────────────────┤');
console.log('│ 方块生成位置        │ [-1, 4] / [0, 3]    │ [2, 4] / [3, 3]     │');
console.log('│                     │ (负数行号！)        │ (正数行号)          │');
console.log('├─────────────────────┼─────────────────────┼─────────────────────┤');
console.log('│ spawn zone 处理     │ y < 0 不写入 matrix │ 所有位置都写入      │');
console.log('│                     │ (上方是"虚拟空间")  │ (行0-3都在matrix)   │');
console.log('├─────────────────────┼─────────────────────┼─────────────────────┤');
console.log('│ isOver() 检查范围   │ 只检查 matrix[0]    │ 检查 matrix[0-3]    │');
console.log('│                     │ (只检查第0行)       │ (检查所有不可见行)  │');
console.log('├─────────────────────┼─────────────────────┼─────────────────────┤');
console.log('│ want() 碰撞检测     │ y < 0 直接返回true  │ 所有位置都检测      │');
console.log('│                     │ (上方不检测碰撞)    │ (包括不可见区域)    │');
console.log('├─────────────────────┼─────────────────────┼─────────────────────┤');
console.log('│ 锁定方块时          │ 只锁定 y >= 0 部分  │ 全部锁定            │');
console.log('│                     │ (上方部分忽略)      │ (包括不可见区域)    │');
console.log('└─────────────────────┴─────────────────────┴─────────────────────┘');

console.log('\n关键差异：');
console.log('  ✓ react-tetris：spawn zone 在 y < 0，"真正的虚拟空间"');
console.log('  ✗ ink-tetris：spawn zone 在 y = 0-3，"在 matrix 内部"');

console.log('\n═'.repeat(70));
console.log('对比：react-tetris vs ink-tetris (修复后)');
console.log('═'.repeat(70));

console.log('\n┌─────────────────────┬─────────────────────┬─────────────────────┐');
console.log('│ 特性                │ react-tetris        │ ink-tetris (修复后) │');
console.log('├─────────────────────┼─────────────────────┼─────────────────────┤');
console.log('│ 方块生成位置        │ [-1, 4] / [0, 3]    │ [2, 4] / [3, 3]     │');
console.log('├─────────────────────┼─────────────────────┼─────────────────────┤');
console.log('│ isOver() 检查范围   │ 只检查 matrix[0]    │ 只检查 matrix[0-1]  │');
console.log('│                     │ (1行)               │ (2行)               │');
console.log('├─────────────────────┼─────────────────────┼─────────────────────┤');
console.log('│ 允许方块存在的区域  │ matrix[0-19]        │ matrix[0-19]        │');
console.log('│                     │ (y < 0 不算在内)    │ (行2-3允许临时存在) │');
console.log('├─────────────────────┼─────────────────────┼─────────────────────┤');
console.log('│ 游戏结束条件        │ matrix[0] 有方块    │ matrix[0-1] 有方块  │');
console.log('└─────────────────────┴─────────────────────┴─────────────────────┘');

console.log('\n相似之处：');
console.log('  ✓ 都只检查"真正的顶部"（最上面的几行）');
console.log('  ✓ 都允许方块在 spawn zone 临时存在');
console.log('  ✓ 都不因为"spawn zone 有方块"就判定游戏结束');

console.log('\n不同之处：');
console.log('  - react-tetris：用负数行号实现 spawn zone');
console.log('  - ink-tetris：用 matrix 内部的行 0-3 作为 spawn zone');

console.log('\n═'.repeat(70));
console.log('为什么 react-tetris 不会遇到这个 bug？');
console.log('═'.repeat(70));

console.log('\n场景模拟：方块锁定在生成位置\n');

console.log('【react-tetris】');
console.log('  1. O 方块在 [-1, 4] 生成（y = -1）');
console.log('  2. O 方块占据 y = -1 到 y = 0');
console.log('  3. O 方块无法下落，在 [-1, 4] 锁定');
console.log('  4. 锁定时，只有 y >= 0 的部分写入 matrix');
console.log('     - y = -1 的部分：不写入');
console.log('     - y = 0 的部分：写入 matrix[0]');
console.log('  5. isOver(matrix) 检查 matrix[0]');
console.log('     - matrix[0] 有方块！');
console.log('     - 返回 true → 游戏结束 ✓');
console.log('  6. 符合预期：方块锁定在生成位置 = 顶部已满 = 游戏结束');

console.log('\n【ink-tetris 旧版本】');
console.log('  1. O 方块在 [2, 4] 生成');
console.log('  2. O 方块占据 y = 2 到 y = 3');
console.log('  3. O 方块无法下落，在 [2, 4] 锁定');
console.log('  4. 锁定时，全部写入 matrix');
console.log('     - matrix[2] 有方块');
console.log('     - matrix[3] 有方块');
console.log('  5. 下一个 Z 方块尝试在 [2, 4] 生成');
console.log('  6. want() 检测到 matrix[2][4-5] 已被占据');
console.log('  7. 旧逻辑：!want() → 游戏结束 ❌');
console.log('  8. 但 matrix[0-1] 是空的！');
console.log('  9. Bug：游戏不应该结束！');

console.log('\n【ink-tetris 修复后】');
console.log('  1. O 方块在 [2, 4] 生成');
console.log('  2. O 方块锁定在 [2, 4]');
console.log('  3. matrix[2-3] 有方块');
console.log('  4. 下一个 Z 方块尝试在 [2, 4] 生成');
console.log('  5. want() 返回 false（碰撞）');
console.log('  6. 修复后逻辑：不再检查 !want()，只检查 isOver()');
console.log('  7. isOver() 只检查 matrix[0-1]');
console.log('  8. matrix[0-1] 是空的');
console.log('  9. 返回 false → 游戏继续 ✓');
console.log(' 10. 符合预期：顶部还有空间，游戏应该继续');

console.log('\n═'.repeat(70));
console.log('核心设计差异总结');
console.log('═'.repeat(70));

console.log('\n【react-tetris 的设计】');
console.log('  - 使用负数坐标表示 spawn zone');
console.log('  - spawn zone 在 matrix 之外（y < 0）');
console.log('  - 只有 y >= 0 的方块才写入 matrix');
console.log('  - isOver() 只检查 matrix[0]');
console.log('  - 优点：spawn zone 是"真正的虚拟空间"，逻辑清晰');
console.log('  - 缺点：需要处理负数索引，代码稍微复杂');

console.log('\n【ink-tetris 的设计（修复后）】');
console.log('  - spawn zone 在 matrix 内部（行 0-3）');
console.log('  - 所有方块都写入 matrix');
console.log('  - isOver() 只检查 matrix[0-1]（spawn zone 上半部分）');
console.log('  - 优点：不需要负数索引，代码简单');
console.log('  - 缺点：需要明确定义"哪部分 spawn zone 触发游戏结束"');

console.log('\n两种方案都是合理的，关键是：');
console.log('  ✓ react-tetris：matrix[0] 有方块 = 游戏结束');
console.log('  ✓ ink-tetris：matrix[0-1] 有方块 = 游戏结束');
console.log('  都确保了：只有"真正的顶部"有方块才判定失败！');

console.log('\n═'.repeat(70));
console.log('结论');
console.log('═'.repeat(70));

console.log('\n1. react-tetris 的实现非常优雅：');
console.log('   - 用负数行号实现 spawn zone');
console.log('   - spawn zone 不占用 matrix 空间');
console.log('   - isOver() 只需检查 matrix[0]，逻辑极其简单');

console.log('\n2. ink-tetris 的修复方案也是正确的：');
console.log('   - 虽然 spawn zone 在 matrix 内部');
console.log('   - 但通过只检查行 0-1，达到了相同的效果');
console.log('   - 允许行 2-3 临时存在方块');

console.log('\n3. 两者的本质是一致的：');
console.log('   - 都区分了"spawn zone"和"真正的顶部"');
console.log('   - 都只在"真正的顶部"有方块时判定游戏结束');
console.log('   - 都允许方块在 spawn zone 临时存在');

console.log('\n4. ink-tetris 的 bug 原因：');
console.log('   - 旧版本：isOver() 检查了整个 spawn zone（行 0-3）');
console.log('   - 旧版本：!want() 检查导致 spawn zone 碰撞也判定游戏结束');
console.log('   - 修复后：isOver() 只检查行 0-1，移除了 !want() 检查');
console.log('   - 现在行为与 react-tetris 一致！');

console.log('\n═'.repeat(70));
