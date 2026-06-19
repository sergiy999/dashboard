function renderPriority() {
  const wrap = document.getElementById('priority-wrap');
  const items = loadP();
  wrap.innerHTML = '';

  const block = document.createElement('div');
  block.className = 'block priority-block';
  block.innerHTML = `
    <div class="block-top">
      <div class="block-head">
        <div class="block-name">
          <div class="block-icon" style="background:#ff9f4322">⭐</div>
          пріоритети
          <span class="pct">${items.length ? items.length + ' задач' : ''}</span>
        </div>
      </div>
    </div>
    <div class="tasks" id="p-tasks"></div>
    <div class="inp-area">
      <input class="inp" id="p-inp" placeholder="додати пріоритет вручну…" onkeydown="if(event.key==='Enter')addPriority()"/>
      <button class="save" onclick="addPriority()">додати</button>
    </div>`;
  wrap.appendChild(block);

  const ct = document.getElementById('p-tasks');
  if (!items.length) {
    ct.innerHTML = '<div class="empty">поки порожньо — став ⭐ на задачу або пиши вручну</div>';
    return;
  }

  items.forEach((item, i) => {
    const row = document.createElement('div');
    row.className = 'p-item';
    const src = item.blockId
      ? '← ' + getLabelById(item.blockId) + (item.date ? ' · до ' + esc(formatDateForDisplay(item.date)) : '')
      : '← вручну';
    row.innerHTML = `
      <div class="p-num">${i + 1}</div>
      <div class="p-body">
        <div class="p-text">${esc(item.text)}</div>
        <div class="p-src">${src}</div>
      </div>
      <span class="p-del" onclick="removePriority(${i},'${item.blockId || ''}',${item.taskIdx !== undefined ? item.taskIdx : -1})">✕</span>`;
    ct.appendChild(row);
  });
}

function addPriority() {
  const inp = document.getElementById('p-inp');
  const text = (inp.value || '').trim();
  if (!text) return;
  const items = loadP();
  items.push({ text });
  saveP(items);
  inp.value = '';
  renderPriority();
}

function removePriority(i, blockId, taskIdx) {
  const items = loadP();
  items.splice(i, 1);
  saveP(items);
  if (blockId && taskIdx >= 0) {
    const tasks = loadTasks(blockId);
    if (tasks[taskIdx]) { tasks[taskIdx].priority = false; saveTasks(blockId, tasks); }
    renderBlock(blockId);
  }
  renderPriority();
}
