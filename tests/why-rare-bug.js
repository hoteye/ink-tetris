#!/usr/bin/env node

/**
 * 解释：为什么这个bug需要玩很久才触发？
 */

console.log('═'.repeat(70));
console.log('为什么这是个罕见的bug？');
console.log('═'.repeat(70));

console.log('\n【Bug触发的唯一条件】\n');

console.log('旧代码的判定逻辑：');
console.log('  if (!want(nextBlock, newMatrix)) {');
console.log('    gameOver = true;  // 新方块无法放置在生成位置');
console.log('  }');

console.log('\n这意味着：只有当新方块与已锁定的方块在生成位置重叠时才触发bug\n');

console.log('═'.repeat(70));
console.log('场景分析：方块锁定位置的演变');
console.log('═'.repeat(70));

console.log('\n【游戏早期（0-1000分）】\n');

console.log('方块堆积情况：');
console.log('  行0-3:  空空空空  (不可见区域)');
console.log('  行4-9:  空空空空  (可见区域上部)');
console.log('  行10-14: 空空少量  (可见区域中部)');
console.log('  行15-19: ▓▓方块▓  (可见区域底部) ← 方块锁定在这里');

console.log('\n新方块生成位置：[2, 4]');
console.log('已锁定方块位置：行15-19（远离生成位置）');
console.log('\n结果：');
console.log('  ✓ 新方块在[2,4]生成');
console.log('  ✓ 行2-3是空的');
console.log('  ✓ want()返回true');
console.log('  ✓ 游戏正常进行');

console.log('\n═'.repeat(70));

console.log('\n【游戏中期（1000-3000分）】\n');

console.log('方块堆积情况：');
console.log('  行0-3:  空空空空  (不可见区域)');
console.log('  行4-9:  空空空少  (可见区域上部)');
console.log('  行10-14: ▓▓方块▓  (可见区域中部) ← 堆积升高');
console.log('  行15-19: ▓▓▓满▓▓  (可见区域底部)');

console.log('\n新方块生成位置：[2, 4]');
console.log('已锁定方块位置：行10-19（仍然远离生成位置）');
console.log('\n结果：');
console.log('  ✓ 新方块在[2,4]生成');
console.log('  ✓ 行2-3还是空的');
console.log('  ✓ want()返回true');
console.log('  ✓ 游戏继续');

console.log('\n═'.repeat(70));

console.log('\n【游戏后期（5000+分）- Bug触发！】\n');

console.log('关键时刻的堆积情况：');
console.log('  行0-1:  空空空空  (不可见区域上半)');
console.log('  行2-3:  空空空空  (不可见区域下半) ← 即将有方块！');
console.log('  行4-6:  空少空少  (可见区域顶部)');
console.log('  行7-12: ▓▓方块▓  (可见区域上部)');
console.log('  行13-19: ▓满▓满▓  (可见区域下部) ← 堆得很高');

console.log('\n【关键场景】O方块下落：\n');

console.log('步骤1: O方块在[2,4]生成');
console.log('  ┌────────┐');
console.log('  │ 行2: ▓▓│ ← O方块在这里');
console.log('  │ 行3: ▓▓│');
console.log('  │ 行4: 空│');
console.log('  │ 行5: 空│');
console.log('  │ ...   │');
console.log('  │ 行10:▓│ ← 下方有方块堆积');
console.log('  └────────┘');

console.log('\n步骤2: O方块尝试下落');
console.log('  - 从[2,4]向下移动到[3,4]');
console.log('  - 继续下落...');
console.log('  - 但是！某一行（比如行4-10某处）已经有方块堵住');
console.log('  - O方块无法继续下落');
console.log('  - O方块在行2-3附近就锁定了！');

console.log('\n步骤3: O方块锁定在[2,4]');
console.log('  ┌────────┐');
console.log('  │ 行2: ▓▓│ ← O方块锁定在这里！');
console.log('  │ 行3: ▓▓│');
console.log('  │ 行4: 空│');
console.log('  └────────┘');
console.log('  matrix中行2-3现在有方块了！');

console.log('\n步骤4: 下一个方块（Z）尝试生成');
console.log('  - Z方块也要在[2,4]生成（默认位置）');
console.log('  - 但是[2,4]已经被O方块占据了！');
console.log('  - want()返回false');
console.log('  - 触发：gameOver = true ❌');

console.log('\n\n═'.repeat(70));
console.log('核心问题：为什么O方块会锁定在[2,4]？');
console.log('═'.repeat(70));

console.log('\n这需要非常特殊的堆积模式：\n');

console.log('必要条件1：列4（或附近）堆得很高');
console.log('  - 方块堆积到行4-10之间');
console.log('  - 但不是均匀堆积，而是某些列特别高');

console.log('\n必要条件2：O方块刚好在列4-5生成');
console.log('  - O方块占据2列（列4-5）');
console.log('  - 如果生成在其他列，就不会触发bug');

console.log('\n必要条件3：O方块下落路径被堵');
console.log('  - 列4-5在行4-10某处有方块');
console.log('  - O方块下落几格后就撞到');
console.log('  - 在行2-3就锁定了');

console.log('\n必要条件4：下一个方块也是非I类型');
console.log('  - 如果下一个是I，生成位置是[3,3]，不会冲突');
console.log('  - 只有非I类型才会在[2,4]生成');
console.log('  - 概率：6/7 = 85.7%');

console.log('\n\n═'.repeat(70));
console.log('概率计算');
console.log('═'.repeat(70));

console.log('\n假设游戏已进行到后期（方块堆积到行10附近）：\n');

console.log('1. 方块堆积模式合适（某列特别高）');
console.log('   - 需要列4-5附近堆到行4-10');
console.log('   - 但顶部（行0-3）还是空的');
console.log('   - 这是一个很特殊的堆积形态');
console.log('   - 估算概率：5-10%');

console.log('\n2. O方块刚好在列4生成');
console.log('   - O方块可以在列0-8任何位置生成（9个可能）');
console.log('   - 玩家可能会左右移动，但默认是列4');
console.log('   - 假设50%概率在列4附近');

console.log('\n3. O方块下落被堵，锁定在行2-3');
console.log('   - 需要列4-5在行4-10有堵塞');
console.log('   - 且恰好让O方块在行2-3锁定（而不是行4+）');
console.log('   - 估算概率：10-20%');

console.log('\n4. 下一个方块是非I类型');
console.log('   - 概率：6/7 = 85.7%');

console.log('\n联合概率（粗略估算）：');
console.log('  P = 10% × 50% × 15% × 85.7%');
console.log('  P ≈ 0.64%');
console.log('  即：大约每150-200个方块锁定才可能触发1次');

console.log('\n但关键是：只有在游戏后期（堆积高）才可能满足条件1！');

console.log('\n═'.repeat(70));
console.log('为什么需要玩到5098分？');
console.log('═'.repeat(70));

console.log('\n1. 早期（0-2000分）：');
console.log('   - 方块锁定在行15-19');
console.log('   - 离行2-3太远');
console.log('   - 不可能触发bug');
console.log('   - 触发概率：0%');

console.log('\n2. 中期（2000-4000分）：');
console.log('   - 方块锁定在行10-15');
console.log('   - 开始接近不可见区域');
console.log('   - 但还不够高');
console.log('   - 触发概率：<0.1%');

console.log('\n3. 后期（4000+分）：');
console.log('   - 方块锁定在行7-15');
console.log('   - 某些列可能堆到行4-6');
console.log('   - 满足bug触发条件');
console.log('   - 触发概率：0.5-1%');

console.log('\n4. 你的情况（5098分，39行）：');
console.log('   - 消除了39行，但堆积速度 > 消除速度');
console.log('   - 堆积已经很高（接近行4）');
console.log('   - 某一刻，列4堆得特别高');
console.log('   - O方块恰好在列4，下落几格就锁定在[2,4]');
console.log('   - 下一个Z方块也要在[2,4]生成');
console.log('   - 完美风暴！Bug触发！');

console.log('\n═'.repeat(70));
console.log('结论');
console.log('═'.repeat(70));

console.log('\n这个bug罕见的原因：\n');

console.log('✗ 不是"一开始就触发"，因为：');
console.log('  - 早期方块锁定位置远离生成位置（行15-19）');
console.log('  - 行2-3一直是空的');
console.log('  - 新方块总能在[2,4]成功生成');

console.log('\n✓ 需要玩到后期才可能触发，因为：');
console.log('  - 需要方块堆积很高（接近行4）');
console.log('  - 需要某列恰好堆到让方块在行2-3锁定');
console.log('  - 需要下一个方块类型也冲突');
console.log('  - 多个低概率事件同时发生');

console.log('\n你玩到5098分才遇到，说明：');
console.log('  1. 你水平很高，玩了很久');
console.log('  2. 你遇到了这个极低概率的"完美风暴"场景');
console.log('  3. 这确实是一个罕见但致命的bug！');

console.log('\n═'.repeat(70));
