/* ── рендер однієї картки задачі (використовується і в блоках, і деінде) */
function renderBlock(id) {
  const tasks = loadTasks(id);
  const ct = document.getElementById('t_' + id);
  if (!ct) return;

  const done = tasks.filter(t => t.done).length;
  const total = tasks.length;
  const pct = total ? Math.round(done / total * 100) : 0;

  const fill = document.getElementById('f_' + id);
  if (fill) fill.style.width = pct + '%';
  const pctEl = document.getElementById('pct_' + id);
  if (pctEl) pctEl.textContent = total ? pct + '%' : '';

  if (!tasks.length) { ct.innerHTML = '<div class="empty">поки порожньо</div>'; return; }
  ct.innerHTML = '';

  tasks.forEach((t, i) => {
    const row = document.createElement('div');
    row.className = 'task';
    row.onclick = function (e) {
      if (e.target.tagName === 'INPUT' || e.target.classList.contains('star-btn') || e.target.classList.contains('del')) return;
      openTaskModal(id, i);
    };

    let metaHtml = '';
    if (t.date || t.budget || t.priority) {
      metaHtml = '<div class="tmeta">';
      if (t.date) metaHtml += `<span class="tag tag-date">📅 ${esc(formatDateForDisplay(t.date))}</span>`;
      if (t.budget) metaHtml += `<span class="tag tag-budget">💰 ${esc(t.budget)}</span>`;
      if (t.priority) metaHtml += `<span class="tag tag-priority">⭐ пріоритет</span>`;
      metaHtml += '</div>';
    }

    const comm = t.comment ? `<div class="tcomment">${esc(t.comment)}</div>` : '';
    const linkUrl = t.link ? normalizeUrl(t.link) : '';
    const linkHtml = linkUrl
      ? `<a class="tlink" href="${esc(linkUrl)}" target="_blank" rel="noopener" onclick="event.stopPropagation()">🔗 ${esc(linkUrl.replace(/^https?:\/\//, ''))}</a>`
      : '';

    row.innerHTML = `
      <input type="checkbox" ${t.done ? 'checked' : ''} onchange="toggleTask('${id}',${i})" onclick="event.stopPropagation()"/>
      <div class="tinfo">
        <div class="ttext${t.done ? ' done' : ''}">${esc(t.text)}</div>
        ${comm}${linkHtml}${metaHtml}
      </div>
      <button class="star-btn${t.priority ? ' on' : ''}" onclick="event.stopPropagation();togglePriority('${id}',${i})" title="у пріоритети">⭐</button>
      <span class="del" onclick="event.stopPropagation();delTask('${id}',${i})">✕</span>`;
    ct.appendChild(row);
  });
}

function toggleTask(id, i) {
  const tasks = loadTasks(id);
  if (tasks[i]) tasks[i].done = !tasks[i].done;
  saveTasks(id, tasks);
  renderBlock(id);
}

function togglePriority(id, i) {
  const tasks = loadTasks(id);
  if (!tasks[i]) return;
  const t = tasks[i];
  const priorities = loadP();
  if (t.priority) {
    t.priority = false;
    const idx = priorities.findIndex(p => p.blockId === id && p.taskIdx === i);
    if (idx >= 0) priorities.splice(idx, 1);
  } else {
    t.priority = true;
    priorities.push({ text: t.text, blockId: id, taskIdx: i, date: t.date || '' });
  }
  saveTasks(id, tasks);
  saveP(priorities);
  renderBlock(id);
  renderPriority();
}

function delTask(id, i) {
  const tasks = loadTasks(id);
  if (tasks[i] && tasks[i].priority) {
    const priorities = loadP();
    const idx = priorities.findIndex(p => p.blockId === id && p.taskIdx === i);
    if (idx >= 0) priorities.splice(idx, 1);
    saveP(priorities);
  }
  tasks.splice(i, 1);
  saveTasks(id, tasks);
  renderBlock(id);
  renderPriority();
}

function addTask(id) {
  const inp = document.getElementById('i_' + id);
  const dateI = document.getElementById('d_' + id);
  const budgetI = document.getElementById('b_' + id);
  const commentI = document.getElementById('c_' + id);
  const linkI = document.getElementById('l_' + id);
  const text = (inp && inp.value || '').trim();
  if (!text) return;

  const tasks = loadTasks(id);
  tasks.push({
    text,
    date: (dateI && dateI.value) || '',
    budget: (budgetI && budgetI.value) || '',
    comment: (commentI && commentI.value) || '',
    link: (linkI && linkI.value) || '',
    done: false,
    priority: false,
  });
  saveTasks(id, tasks);

  inp.value = '';
  if (dateI) dateI.value = '';
  if (budgetI) budgetI.value = '';
  if (commentI) commentI.value = '';
  if (linkI) linkI.value = '';
  renderBlock(id);
}

function deleteBlock(id) {
  if (!confirm('Видалити блок разом із задачами?')) return;
  const blocks = loadBlocks().filter(b => b.id !== id);
  saveBlocks(blocks);
  localStorage.removeItem(lsKey(id));
  const priorities = loadP().filter(p => p.blockId !== id);
  saveP(priorities);
  rebuildGrid();
  renderPriority();
}

/* ── побудова DOM-картки блоку + drag&drop ────────────────────────── */
let dragSrc = null;

function buildBlockEl(b) {
  const div = document.createElement('div');
  div.className = 'block';
  div.dataset.id = b.id;
  div.draggable = true;

  div.innerHTML = `
    <div class="block-top">
      <div class="block-head">
        <span class="drag-handle" title="перетягнути">⠿</span>
        <div class="block-name">
          <div class="block-icon" style="background:${b.color}22">${b.icon}</div>
          ${esc(b.label)}
          <span class="pct" id="pct_${b.id}"></span>
        </div>
        <div class="head-actions">
          <button class="add-btn" onclick="document.getElementById('i_${b.id}').focus()" aria-label="додати">+</button>
          <button class="del-block-btn" onclick="deleteBlock('${b.id}')" title="видалити блок">✕</button>
        </div>
      </div>
      <div class="bar-wrap"><div class="bar-fill" id="f_${b.id}" style="background:${b.color};width:0%"></div></div>
    </div>
    <div class="tasks" id="t_${b.id}"></div>
    <div class="inp-area">
      <input class="inp" id="i_${b.id}" placeholder="нова задача…" onkeydown="if(event.key==='Enter')addTask('${b.id}')"/>
      <div class="extra-fields">
        <input type="date" class="inp-date" id="d_${b.id}"/>
        <input class="inp-sm" id="b_${b.id}" placeholder="💰 бюджет"/>
      </div>
      <textarea class="inp-comment" id="c_${b.id}" placeholder="💬 коментар…" rows="1"></textarea>
      <input class="inp-link" id="l_${b.id}" placeholder="🔗 посилання (https://…)"/>
      <button class="save" onclick="addTask('${b.id}')">додати</button>
    </div>`;

  div.addEventListener('dragstart', e => { dragSrc = div; div.classList.add('dragging'); e.dataTransfer.effectAllowed = 'move'; });
  div.addEventListener('dragend', () => { div.classList.remove('dragging'); document.querySelectorAll('.block').forEach(b => b.classList.remove('drag-over')); });
  div.addEventListener('dragover', e => { e.preventDefault(); if (div !== dragSrc) div.classList.add('drag-over'); });
  div.addEventListener('dragleave', () => div.classList.remove('drag-over'));
  div.addEventListener('drop', e => {
    e.preventDefault();
    div.classList.remove('drag-over');
    if (!dragSrc || dragSrc === div) return;
    const grid = document.getElementById('grid');
    const children = [...grid.children];
    const fromIdx = children.indexOf(dragSrc);
    const toIdx = children.indexOf(div);
    if (fromIdx < 0 || toIdx < 0) return;
    if (fromIdx < toIdx) grid.insertBefore(dragSrc, div.nextSibling);
    else grid.insertBefore(dragSrc, div);
    const newOrder = [...grid.children].map(el => el.dataset.id);
    const blocks = loadBlocks();
    saveBlocks(newOrder.map(id => blocks.find(b => b.id === id)).filter(Boolean));
  });

  return div;
}

function rebuildGrid() {
  const grid = document.getElementById('grid');
  grid.innerHTML = '';
  loadBlocks().forEach(b => {
    const el = buildBlockEl(b);
    grid.appendChild(el);
    renderBlock(b.id);
  });
}
