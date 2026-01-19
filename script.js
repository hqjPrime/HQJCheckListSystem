// 从 localStorage 加载
let items = JSON.parse(localStorage.getItem('todoList')) || [];
let categories = JSON.parse(localStorage.getItem('categories')) || [];
let currentSuggestedCategory = null;
let currentFilter = 'all'; // 'all', 'uncategorized', 或分类名
let keywordCategoryMap = {};

// 从JSON文件加载关键词映射
async function loadKeywordMap() {
  try {
    const response = await fetch('keywords.json');
    keywordCategoryMap = await response.json();
    // 从关键词映射中提取所有分类
    const allCategories = [...new Set(Object.values(keywordCategoryMap))];
    // 更新categories数组，添加所有新的分类
    allCategories.forEach(cat => {
      if (!categories.includes(cat)) {
        categories.push(cat);
      }
    });
    localStorage.setItem('categories', JSON.stringify(categories));
  } catch (error) {  
    console.error('加载关键词映射失败:', error);
    // 使用默认映射
    keywordCategoryMap = {
      '买菜': '购物',
      '购物': '购物',
      '超市': '购物',
      '买东西': '购物',
      '缴费': '账单',
      '电费': '账单',
      '水费': '账单',
      '燃气费': '账单',
      '话费': '账单',
      '信用卡': '账单',
      '还款': '账单',
      '工作': '工作',
      '任务': '工作',
      '项目': '工作',
      '会议': '工作',
      '学习': '学习',
      '看书': '学习',
      '阅读': '学习',
      '作业': '学习',
      '考试': '学习',
      '运动': '健康',
      '健身': '健康',
      '跑步': '健康',
      '锻炼': '健康',
      '吃饭': '生活',
      '做饭': '生活',
      '家务': '生活',
      '打扫': '生活',
      '洗衣服': '生活',
      '电影': '娱乐',
      '游戏': '娱乐',
      '音乐': '娱乐',
      '旅行': '旅行',
      '旅游': '旅行',
      '出差': '旅行'
    };
  }
}

// 学习用户的分类习惯
function learnCategory(text) {
  for (const [keyword, category] of Object.entries(keywordCategoryMap)) {
    if (text.includes(keyword)) {
      if (!categories.includes(category)) {
        categories.push(category);
        localStorage.setItem('categories', JSON.stringify(categories));
      }
      return category;
    }
  }
  return null;
}

// 获取建议分类
function getSuggestedCategory(text) {
  return learnCategory(text);
}

// 显示分类建议
function showCategorySuggestion(category) {
  const suggestionsEl = document.getElementById('categorySuggestions');
  const suggestedCategoryEl = document.getElementById('suggestedCategory');
  if (category) {
    currentSuggestedCategory = category;
    suggestedCategoryEl.textContent = category;
    suggestionsEl.style.display = 'block';
  } else {
    suggestionsEl.style.display = 'none';
    currentSuggestedCategory = null;
  }
}

// 应用建议的分类
function applySuggestedCategory() {
  if (currentSuggestedCategory) {
    const input = document.getElementById('newItem');
    const text = input.value.trim();
    if (text && !text.includes(currentSuggestedCategory)) {
      input.value = `[${currentSuggestedCategory}] ${text}`;
    }
    showCategorySuggestion(null);
    input.focus();
  }
}

// Tab键应用分类建议
document.getElementById('newItem').addEventListener('keydown', e => {
  if (e.key === 'Tab') {
    e.preventDefault();
    
    if (currentSuggestedCategory) {
      // 按Tab键应用分类并直接添加
      applySuggestedCategory();
      setTimeout(() => {
        addItem();
      }, 0);
    } else {
      // 没有建议时，按Tab键跳到下一个控件
      document.activeElement.nextElementSibling?.focus();
    }
  }
});

// 按分类筛选
function filterByCategory(category) {
  currentFilter = category;
  updateFilterButtons();
  render();
  drawPieChart();
}

// 更新筛选按钮状态
function updateFilterButtons() {
  // 移除所有按钮的active类
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // 添加当前筛选的active类
  if (currentFilter === 'all') {
    document.getElementById('filterAll').classList.add('active');
  } else if (currentFilter === 'uncategorized') {
    document.getElementById('filterUncategorized').classList.add('active');
  } else {
    const categoryBtn = document.querySelector(`[data-category="${currentFilter}"]`);
    if (categoryBtn) {
      categoryBtn.classList.add('active');
    }
  }
}

// 渲染分类筛选按钮
function renderCategoryFilters() {
  const container = document.getElementById('categoryFilterButtons');
  container.innerHTML = categories.map(category => `
    <button 
      onclick="filterByCategory('${category}')" 
      class="filter-btn"
      data-category="${category}"
    >
      ${category}
    </button>
  `).join('');
  updateFilterButtons();
}

// 从文本中提取分类
function extractCategory(text) {
  const match = text.match(/\[([^\]]+)\]/);
  return match ? match[1] : null;
}

// 获取筛选后的事项
function getFilteredItems() {
  if (currentFilter === 'all') {
    return items;
  } else if (currentFilter === 'uncategorized') {
    return items.filter(item => !extractCategory(item.text));
  } else {
    return items.filter(item => extractCategory(item.text) === currentFilter);
  }
}

// 绘制饼状图
function drawPieChart() {
  const canvas = document.getElementById('progressChart');
  const ctx = canvas.getContext('2d');
  const filteredItems = getFilteredItems();
  
  if (filteredItems.length === 0) {
    // 没有事项时显示空饼图和提示文字
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2 - 5, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0, 255, 136, 0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();
    // 添加中心提示文字
    ctx.fillStyle = 'rgba(0, 255, 136, 0.5)';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('无事项', canvas.width / 2, canvas.height / 2);
    document.getElementById('completionRate').textContent = '0%';
    return;
  }
  
  // 计算完成率（用于文字显示）
  const completedCount = filteredItems.filter(item => item.done).length;
  const completionRate = Math.round((completedCount / filteredItems.length) * 100);
  
  // 清除画布
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  if (currentFilter === 'all') {
    // 显示分类分布
    const categoryCounts = {};
    filteredItems.forEach(item => {
      const cat = extractCategory(item.text) || '未分类';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });
    const categories = Object.keys(categoryCounts);
    const colors = [
      'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)',
      'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)',
      'linear-gradient(135deg, #ffaa00 0%, #cc8800 100%)',
      'linear-gradient(135deg, #ff4757 0%, #cc3a48 100%)',
      'linear-gradient(135deg, #a29bfe 0%, #817be0 100%)',
      'linear-gradient(135deg, #fd79a8 0%, #d66191 100%)',
      'linear-gradient(135deg, #00b894 0%, #009176 100%)',
      'linear-gradient(135deg, #e17055 0%, #bd5a42 100%)'
    ];
    
    let startAngle = 0;
    categories.forEach((cat, idx) => {
      const count = categoryCounts[cat];
      const sliceAngle = (count / filteredItems.length) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, canvas.height / 2);
      ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2 - 5, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      const gradient = ctx.createLinearGradient(canvas.width / 2 - 30, canvas.height / 2 - 30, canvas.width / 2 + 30, canvas.height / 2 + 30);
      const colorParts = colors[idx % colors.length].match(/#([0-9a-fA-F]{6})/g);
      if (colorParts) {
        gradient.addColorStop(0, colorParts[0]);
        gradient.addColorStop(1, colorParts[1]);
      }
      ctx.fillStyle = gradient;
      ctx.fill();
      startAngle += sliceAngle;
    });
    
    // 绘制中心圆（深色）
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2 - 15, 0, Math.PI * 2);
    ctx.fillStyle = '#0f0f23';
    ctx.fill();
    
    // 显示总事项数
    ctx.fillStyle = '#00ff88';
    ctx.font = '700 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(filteredItems.length, canvas.width / 2, canvas.height / 2);
    
    document.getElementById('completionRate').textContent = completionRate + '%';
  } else {
    // 显示完成率
    // 绘制未完成部分（深色）
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, canvas.height / 2);
    ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2 - 5, 0, Math.PI * 2 * (1 - completionRate / 100));
    ctx.closePath();
    ctx.fillStyle = 'rgba(15, 15, 35, 0.8)';
    ctx.fill();
    
    // 绘制完成部分（绿色渐变）
    if (completionRate > 0) {
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, canvas.height / 2);
      ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2 - 5, Math.PI * 2 * (1 - completionRate / 100), Math.PI * 2);
      ctx.closePath();
      const gradient = ctx.createLinearGradient(canvas.width / 2 - 30, canvas.height / 2 - 30, canvas.width / 2 + 30, canvas.height / 2 + 30);
      gradient.addColorStop(0, '#00ff88');
      gradient.addColorStop(1, '#00cc6a');
      ctx.fillStyle = gradient;
      ctx.fill();
    }
    
    // 绘制中心圆（深色）
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2 - 15, 0, Math.PI * 2);
    ctx.fillStyle = '#0f0f23';
    ctx.fill();
    
    // 更新完成率文字
    document.getElementById('completionRate').textContent = completionRate + '%';
  }
}

function addItem() {
  const input = document.getElementById('newItem');
  const text = input.value.trim();
  if (text) {
    items.push({ text, done: false });
    saveAndRender();
    input.value = '';
    showCategorySuggestion(null); // 隐藏分类建议
  }
}

function toggleDone(index) {
  items[index].done = !items[index].done;
  saveAndRender();
}

function deleteItem(index) {
  items.splice(index, 1);
  saveAndRender();
}

function saveAndRender() {
  localStorage.setItem('todoList', JSON.stringify(items));
  render();
  drawPieChart();
}

function render() {
  const listEl = document.getElementById('list');
  const filteredItems = getFilteredItems();
  listEl.innerHTML = filteredItems.map((item, i) => {
    const originalIndex = items.findIndex(x => x.text === item.text && x.done === item.done);
    return `
      <li class="${item.done ? 'completed' : ''}">
        <input type="checkbox" ${item.done ? 'checked' : ''} onchange="toggleDone(${originalIndex})">
        ${item.text}
        <button onclick="deleteItem(${originalIndex})" style="margin-left:1rem;">×</button>
      </li>
    `;
  }).join('');
}

// 输入时显示分类建议
document.getElementById('newItem').addEventListener('input', e => {
  const text = e.target.value.trim();
  if (text.length > 1) {
    const category = getSuggestedCategory(text);
    showCategorySuggestion(category);
  } else {
    showCategorySuggestion(null);
  }
});

// 回车添加
document.getElementById('newItem').addEventListener('keypress', e => {
  if (e.key === 'Enter') addItem();
});

// 默认预设项
const defaultItems = [
  // 工作分类
  { text: '[工作] 回复重要邮件', done: false },
  { text: '[工作] 整理工作文档', done: false },
  { text: '[工作] 制定下周计划', done: false },
  { text: '[工作] 跟进客户需求', done: false },
  
  // 学习分类
  { text: '[学习] 阅读技术书籍', done: false },
  { text: '[学习] 观看在线课程', done: false },
  { text: '[学习] 练习编程题目', done: false },
  { text: '[学习] 学习新技能', done: false },
  { text: '[学习] 复习笔记', done: false },
  { text: '[学习] 写学习总结', done: false },
  { text: '[学习] 参加技术交流', done: false },
  
  // 生活分类
  { text: '[生活] 打扫房间', done: false },
  { text: '[生活] 购买生活用品', done: false },
  { text: '[生活] 准备晚餐', done: false },
  { text: '[生活] 整理衣柜', done: false },
  { text: '[生活] 缴纳水电费', done: false },
  { text: '[生活] 预约医生', done: false },
  { text: '[生活] 联系朋友', done: false },
  { text: '[生活] 规划周末活动', done: false },
  
  // 健康分类
  { text: '[健康] 晨跑30分钟', done: false },
  { text: '[健康] 做瑜伽', done: false },
  { text: '[健康] 喝够8杯水', done: false },
  { text: '[健康] 早睡早起', done: false },
  { text: '[健康] 吃健康早餐', done: false },
  { text: '[健康] 体检预约', done: false },
  
  // 娱乐分类
  { text: '[娱乐] 看电影', done: false },
  { text: '[娱乐] 听音乐', done: false },
  { text: '[娱乐] 玩游戏放松', done: false },
  { text: '[娱乐] 看综艺节目', done: false },
  { text: '[娱乐] 阅读小说', done: false },
  { text: '[娱乐] 户外散步', done: false },
  { text: '[娱乐] 尝试新菜谱', done: false },
  
  // 未分类
  { text: '打电话给家人', done: false },
  { text: '整理照片', done: false },
  { text: '备份重要文件', done: false },
  { text: '修理损坏物品', done: false },
  { text: '写日记', done: false },
  { text: '计划旅行', done: false },
  { text: '学习摄影', done: false },
  { text: '整理收藏', done: false },
  { text: '写感谢信', done: false },
  { text: '学习新语言', done: false }
];

// 初始化
async function init() {
  await loadKeywordMap();
  
  // 如果没有保存的清单，加载默认预设项
  if (items.length === 0) {
    items = [...defaultItems];
    saveAndRender();
  }
  
  render();
  renderCategoryFilters();
  drawPieChart();
  document.getElementById('newItem').focus();
}

init();

// 导出为 Markdown
function exportToMarkdown() {
  const completedItems = items.filter(item => item.done);
  const pendingItems = items.filter(item => !item.done);
  
  let markdown = `# 清单\n\n`;
  markdown += `## 待办事项 (${pendingItems.length})\n`;
  pendingItems.forEach(item => {
    markdown += `- [ ] ${item.text}\n`;
  });
  
  if (completedItems.length > 0) {
    markdown += `\n## 已完成 (${completedItems.length})\n`;
    completedItems.forEach(item => {
      markdown += `- [x] ${item.text}\n`;
    });
  }
  
  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10);
  const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, '-');
  a.download = `清单_${dateStr}_${timeStr}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// 从 Markdown 导入
function importFromMarkdown(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(e) {
    const content = e.target.result;
    const lines = content.split('\n');
    const importedItems = [];
    
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('- [ ] ')) {
        importedItems.push({
          text: trimmed.slice(6),
          done: false
        });
      } else if (trimmed.startsWith('- [x] ') || trimmed.startsWith('- [X] ')) {
        importedItems.push({
          text: trimmed.slice(6),
          done: true
        });
      }
    });
    
    if (importedItems.length > 0) {
      if (confirm(`将导入 ${importedItems.length} 个事项，是否覆盖现有清单？`)) {
        items = importedItems;
        saveAndRender();
      }
    } else {
      alert('未找到可导入的清单事项');
    }
    
    event.target.value = '';
  };
  reader.readAsText(file, 'UTF-8');
}

// 清空所有事项
function clearAll() {
  if (items.length === 0) {
    alert('清单已经是空的了！');
    return;
  }
  
  if (confirm(`确定要清空所有 ${items.length} 个事项吗？此操作不可恢复！`)) {
    items = [];
    saveAndRender();
    alert('所有事项已清空');
  }
}

// 实时时间显示 - 单个数字翻页
let previousTime = { h1: '0', h2: '0', m1: '0', m2: '0', s1: '0', s2: '0', ms1: '0', ms2: '0', ms3: '0' };

function updateTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const ms = String(now.getMilliseconds()).padStart(3, '0');
  
  const currentTime = {
    h1: hours[0], h2: hours[1],
    m1: minutes[0], m2: minutes[1],
    s1: seconds[0], s2: seconds[1],
    ms1: ms[0], ms2: ms[1], ms3: ms[2]
  };
  
  // 更新每个数字
  for (const [key, value] of Object.entries(currentTime)) {
    if (previousTime[key] !== value) {
      const digitEl = document.querySelector(`[data-digit="${key}"]`);
      if (digitEl) {
        // 添加翻转动画类
        digitEl.classList.add('flip');
        
        // 动画结束后更新数字并移除动画类
        setTimeout(() => {
          digitEl.textContent = value;
        }, 150);
        
        setTimeout(() => {
          digitEl.classList.remove('flip');
        }, 300);
      }
      previousTime[key] = value;
    }
  }
}

// 初始化时间并开始更新
updateTime();
setInterval(updateTime, 50);
