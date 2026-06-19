/* ── модалка "новий блок" ─────────────────────────────────────────── */
let selectedEmoji = EMOJIS[0];
let colorIdx = 0;

function openBlockModal() {
  selectedEmoji = EMOJIS[0];
  colorIdx = Math.floor(Math.random() * COLORS.length);
  document.getElementById('modal-name').value = '';

  const pick = document.getElementById('emoji-pick');
  pick.innerHTML = '';
  EMOJIS.forEach(e => {
    const s = document.createElement('span');
    s.className = 'ep' + (e === selectedEmoji ? ' sel' : '');
    s.textContent = e;
    s.onclick = () => {
      selectedEmoji = e;
      document.querySelectorAll('.ep').forEach(x => x.classList.remove('sel'));
      s.classList.add('sel');
    };
    pick.appendChild(s);
  });

  document.getElementById('block-modal-bg').classList.add('open');
  setTimeout(() => document.getElementById('modal-name').focus(), 100);
}

function closeBlockModal() {
  document.getElementById('block-modal-bg').classList.remove('open');
}

function confirmBlockModal() {
  const name = document.getElementById('modal-name').value.trim();
  if (!name) return;
  const blocks = loadBlocks();
  const id = 'block_' + Date.now();
  blocks.push({ id, label: name, icon: selectedEmoji, color: COLORS[colorIdx % COLORS.length] });
  saveBlocks(blocks);
  closeBlockModal();
  rebuildGrid();
}

/* ── модалка "редагування задачі" ─────────────────────────────────── */
let editCtx = null;

function openTaskModal(blockId, idx) {
  const tasks = loadTasks(blockId);
  const t = tasks[idx];
  if (!t) return;

  editCtx = { blockId, idx };
  document.getElementById('et-text').value = t.text || '';
  document.getElementById('et-date').value = t.date || '';
  document.getElementById('et-budget').value = t.budget || '';
  document.getElementById('et-comment').value = t.comment || '';
  document.getElementById('et-link').value = t.link || '';
  document.getElementById('task-modal-bg').classList.add('open');
}

function closeTaskModal() {
  document.getElementById('task-modal-bg').classList.remove('open');
  editCtx = null;
}

function saveFromModal() {
  if (!editCtx) return;
  const tasks = loadTasks(editCtx.blockId);
  const t = tasks[editCtx.idx];
  if (!t) return;

  t.text = document.getElementById('et-text').value.trim() || t.text;
  t.date = document.getElementById('et-date').value;
  t.budget = document.getElementById('et-budget').value;
  t.comment = document.getElementById('et-comment').value;
  t.link = document.getElementById('et-link').value;
  saveTasks(editCtx.blockId, tasks);

  if (t.priority) {
    const priorities = loadP();
    const pi = priorities.findIndex(p => p.blockId === editCtx.blockId && p.taskIdx === editCtx.idx);
    if (pi >= 0) { priorities[pi].text = t.text; priorities[pi].date = t.date; saveP(priorities); }
  }

  renderBlock(editCtx.blockId);
  renderPriority();
  closeTaskModal();
}

function deleteFromModal() {
  if (!editCtx) return;
  delTask(editCtx.blockId, editCtx.idx);
  closeTaskModal();
}

/* ── глобальні обробники (закриття по кліку поза вікном / Escape) ──── */
function initModalHandlers() {
  document.getElementById('block-modal-bg').addEventListener('click', function (e) {
    if (e.target === this) closeBlockModal();
  });
  document.getElementById('task-modal-bg').addEventListener('click', function (e) {
    if (e.target === this) closeTaskModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeTaskModal(); closeBlockModal(); }
  });
}
