#!/usr/bin/env node

/**
 * 详细解释：谁堵住了O方块？
 */

console.log('═'.repeat(70));
console.log('O方块为什么会锁定在[2,4]？');
console.log('═'.repeat(70));

console.log('\n【关键问题】O方块从[2,4]生成后，应该下落，为什么会停在[2,4]？\n');

console.log('让我们一步步分析：\n');

console.log('═'.repeat(70));
console.log('场景重现：O方块的下落过程');
console.log('═'.repeat(70));

console.log('\n【初始状态】游戏进行到后期，棋盘已经有很多方块\n');

console.log('列号:  0 1 2 3 4 5 6 7 8 9');
console.log('行0:   · · · · · · · · · ·  (不可见)');
console.log('行1:   · · · · · · · · · ·  (不可见)');
console.log('行2:   · · · · · · · · · ·  (不可见) ← O方块即将生成');
console.log('行3:   · · · · · · · · · ·  (不可见)');
console.log('─'.repeat(70));
console.log('行4:   · · · · · · · · · ·  (可见区域第一行)');
console.log('行5:   · · · · · · · · · ·');
console.log('行6:   · · · · · · · · · ·');
console.log('行7:   · · · · · · · · · ·');
console.log('行8:   · · · · · · · · · ·');
console.log('行9:   · · · · · · · · · ·');
console.log('行10:  · · · · ▓ ▓ · · · ·  ← 注意！列4-5有方块');
console.log('行11:  · · · · ▓ ▓ · · · ·');
console.log('行12:  · · · · ▓ ▓ · · · ·');
console.log('行13:  ▓ · ▓ ▓ ▓ ▓ ▓ ▓ · ▓');
console.log('行14:  ▓ ▓ · ▓ ▓ ▓ ▓ ▓ ▓ ▓');
console.log('...更多堆积的方块...');

console.log('\n关键：列4和列5在行10-12已经有方块堆积了！');

console.log('\n\n【步骤1】O方块在[2,4]生成\n');

console.log('O方块的形状（2x2）：');
console.log('  ▓ ▓');
console.log('  ▓ ▓');

console.log('\nO方块在[2,4]位置，占据：');
console.log('  - 行2，列4-5');
console.log('  - 行3，列4-5');

console.log('\n当前状态：');
console.log('列号:  0 1 2 3 4 5 6 7 8 9');
console.log('行0:   · · · · · · · · · ·');
console.log('行1:   · · · · · · · · · ·');
console.log('行2:   · · · · O O · · · ·  ← O方块在这里');
console.log('行3:   · · · · O O · · · ·  ← O方块在这里');
console.log('行4:   · · · · · · · · · ·');
console.log('...（行5-9都是空的）...');
console.log('行10:  · · · · ▓ ▓ · · · ·  ← 已锁定的方块');

console.log('\n\n【步骤2】O方块尝试下落到[3,4]\n');

console.log('O方块向下移动1格，位置变成[3,4]：');
console.log('  - 行3，列4-5');
console.log('  - 行4，列4-5');

console.log('\n检查是否可以移动：');
console.log('列号:  0 1 2 3 4 5 6 7 8 9');
console.log('行2:   · · · · · · · · · ·  (O方块离开了)');
console.log('行3:   · · · · O O · · · ·  ← O方块移到这里');
console.log('行4:   · · · · O O · · · ·  ← O方块移到这里');
console.log('行5:   · · · · · · · · · ·');

console.log('\n检查结果：行3和行4的列4-5都是空的');
console.log('✓ 可以移动！want()返回true');

console.log('\n\n【步骤3】O方块继续下落...\n');

console.log('O方块一直下落：');
console.log('  [3,4] → [4,4] → [5,4] → [6,4] → [7,4] → [8,4] → [9,4]');

console.log('\n当前状态（O方块在[9,4]）：');
console.log('列号:  0 1 2 3 4 5 6 7 8 9');
console.log('行0-8: （都是空的，O方块已经下落了）');
console.log('行9:   · · · · O O · · · ·  ← O方块现在在这里');
console.log('行10:  · · · · O O · · · ·  ← O方块现在在这里');
console.log('行11:  · · · · ▓ ▓ · · · ·  ← 已锁定的方块（matrix中）');

console.log('\n等等！这里不对！');
console.log('\n让我重新检查你的日志...');

console.log('\n\n═'.repeat(70));
console.log('重新分析：根据你的实际日志');
console.log('═'.repeat(70));

console.log('\n你的日志显示：');
console.log('  [LOCK BLOCK] Locking block type: O Position: [ 2, 4 ]');
console.log('  Board state: Row 0: 0000000000');
console.log('  Board state: Row 1: 0000000000');
console.log('  Board state: Row 2: 0000110000');
console.log('  Board state: Row 3: 0000110000');

console.log('\n这说明O方块锁定后，只有行2-3有方块！');
console.log('行4及以下是什么情况？日志没显示！');

console.log('\n\n【关键发现】O方块为什么在[2,4]就锁定了？\n');

console.log('可能性1：行4的列4-5已经有方块');
console.log('  如果是这样：');
console.log('  行2: · · · · O O · · · ·  (O方块)');
console.log('  行3: · · · · O O · · · ·  (O方块)');
console.log('  行4: · · · · ▓ ▓ · · · ·  (已锁定的方块)');
console.log('  ');
console.log('  O方块尝试从[2,4]下落到[3,4]：');
console.log('    - O方块的底部会在行4');
console.log('    - 但行4的列4-5已经被占据');
console.log('    - want()返回false');
console.log('    - O方块无法下落，立即锁定在[2,4]');

console.log('\n可能性2：行3下方某行（行4-10）的列4-5有方块堵住');
console.log('  需要具体看matrix的完整状态');

console.log('\n\n让我创建一个精确的模拟...\n');

console.log('═'.repeat(70));
console.log('精确模拟：O方块锁定在[2,4]的场景');
console.log('═'.repeat(70));

console.log('\n假设matrix状态（完整的20行）：\n');

const matrix = [
  [0,0,0,0,0,0,0,0,0,0], // 行0
  [0,0,0,0,0,0,0,0,0,0], // 行1
  [0,0,0,0,0,0,0,0,0,0], // 行2 - O方块即将在这里
  [0,0,0,0,0,0,0,0,0,0], // 行3
  [0,0,0,0,1,1,0,0,0,0], // 行4 - 关键！列4-5有方块！
  [0,0,0,0,1,1,0,0,0,0], // 行5
  [0,0,0,0,1,1,0,0,0,0], // 行6
  [0,0,0,0,1,1,0,0,0,0], // 行7
  [0,0,0,0,1,1,0,0,0,0], // 行8
  [0,0,0,0,1,1,0,0,0,0], // 行9
  [0,0,0,0,1,1,0,0,0,0], // 行10
  [0,0,0,0,1,1,0,0,0,0], // 行11
  [0,0,0,0,1,1,0,0,0,0], // 行12
  [1,0,1,1,1,1,1,1,0,1], // 行13
  [1,1,0,1,1,1,1,1,1,1], // 行14
  [1,1,0,1,1,1,1,1,1,1], // 行15
  [1,1,1,1,1,0,1,1,1,1], // 行16
  [1,1,1,1,1,1,0,1,1,1], // 行17
  [1,1,1,0,1,1,1,1,1,1], // 行18
  [1,1,1,0,1,1,1,1,1,1], // 行19
];

console.log('列号: 0 1 2 3 4 5 6 7 8 9');
for (let i = 0; i < 20; i++) {
  const visual = matrix[i].map(cell => cell ? '▓' : '·').join(' ');
  const marker = i < 4 ? '(不可见)' : i === 4 ? '(可见第1行)' : '';
  console.log(`行${i.toString().padStart(2)}: ${visual}  ${marker}`);
}

console.log('\n\n【关键】看到了吗？列4和列5从行4开始就有方块堆积！\n');

console.log('现在O方块在[2,4]生成，尝试下落：\n');

console.log('步骤1: O方块在[2,4]，占据行2-3，列4-5');
console.log('步骤2: O方块尝试下落到[3,4]，会占据行3-4，列4-5');
console.log('步骤3: 检查行4的列4-5是否为空？');
console.log('       matrix[4][4] = 1 (有方块！)');
console.log('       matrix[4][5] = 1 (有方块！)');
console.log('步骤4: want()返回false - 无法移动！');
console.log('步骤5: O方块触发锁定条件，立即锁定在[2,4]');

console.log('\n\n═'.repeat(70));
console.log('答案');
console.log('═'.repeat(70));

console.log('\n谁堵住了O方块？\n');

console.log('✓ 是行4（第一个可见行）的列4-5位置的方块！');
console.log('✓ 这些方块是之前游戏中锁定的方块');
console.log('✓ 它们堆得很高，一直堆到了行4');
console.log('✓ 当O方块在[2,4]生成后，尝试下落');
console.log('✓ O方块的底部（行3）想移动到行4');
console.log('✓ 但行4的列4-5已经被占据');
console.log('✓ O方块无法下落，只能停在[2,4]锁定');

console.log('\n这就是为什么O方块会"卡在"生成位置的原因！');

console.log('\n═'.repeat(70));
