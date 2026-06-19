/* ── вбудована резервна копія даних ───────────────────────────────
   Якщо localStorage порожній (новий пристрій, очищений кеш),
   ці дані автоматично завантажаться при першому відкритті сайту. */
const BACKUP = {"tasks_v2_girl":"[{\"text\":\"поїздка в гори з палатками\",\"date\":\"\",\"budget\":\"\",\"comment\":\"\",\"done\":false,\"priority\":false},{\"text\":\"поїздка на сплав\",\"date\":\"\",\"budget\":\"\",\"comment\":\"\",\"done\":false,\"priority\":false},{\"text\":\"інше місто\",\"date\":\"\",\"budget\":\"\",\"comment\":\"\",\"done\":false,\"priority\":false},{\"text\":\"картинг\",\"date\":\"\",\"budget\":\"\",\"comment\":\"\",\"done\":false,\"priority\":false},{\"text\":\"поїзда на велосипедах\",\"date\":\"\",\"budget\":\"\",\"comment\":\"\",\"done\":false,\"priority\":false},{\"text\":\"Зробити пропозицію\",\"date\":\"2026-08-30\",\"budget\":\"\",\"comment\":\"\n\nвибрати локацію та дату\n\",\"done\":false,\"priority\":false}]","tasks_v2_parents":"[{\"text\":\"проводити час з ними\",\"date\":\"\",\"budget\":\"\",\"comment\":\"\",\"done\":false,\"priority\":false},{\"text\":\"купити мамі телефон\",\"date\":\"\",\"budget\":\"\",\"comment\":\"\",\"done\":false,\"priority\":false},{\"text\":\"поїхати кудись разом або подарити поїздку\",\"date\":\"\",\"budget\":\"\",\"comment\":\"\",\"done\":false,\"priority\":false},{\"text\":\"подяка за всього шо дали\",\"date\":\"\",\"budget\":\"\",\"comment\":\"\",\"done\":false,\"priority\":false}]","tasks_v2_health":"[{\"text\":\"Зубний\",\"date\":\"2026-07-15\",\"budget\":\"6000\",\"comment\":\"треба зробити три ошатні зуба\",\"done\":false,\"priority\":false},{\"text\":\"Верикоз на правій нозі\",\"date\":\"2026-06-30\",\"budget\":\"2000\",\"comment\":\"обовчзково треба піти чим швидше\",\"done\":false,\"priority\":true}]","tasks_v2_growth":"[{\"text\":\"Вивчати нові страви\",\"date\":\"\",\"budget\":\"\",\"comment\":\"\",\"done\":false,\"priority\":false},{\"text\":\"знімати відео про кухню\",\"date\":\"\",\"budget\":\"0\",\"comment\":\"постійно · 1-2 відео тиждень вести тік так та інстанрам придумати формат\n\",\"done\":false,\"priority\":false},{\"text\":\"новий продукт щоб летів страшно і нікого не було\",\"date\":\"2026-07-30\",\"budget\":\"0\",\"comment\":\"обрати день на подумати \",\"done\":false,\"priority\":false},{\"text\":\"знімати відео з машинками хоч вілс+ едіти\",\"date\":\"\",\"budget\":\"0\",\"comment\":\"постійно · розписати покроковий плвн + візитки зробити \n\",\"done\":false,\"priority\":false},{\"text\":\"вест бізнес Lego активно\",\"date\":\"\",\"budget\":\"500\",\"comment\":\"постійно · оновити телеграм та постити відео створити сайт \",\"done\":false,\"priority\":false},{\"text\":\"Створити проект по кухні даш борт\",\"date\":\"2026-06-30\",\"budget\":\"0\",\"comment\":\"продумати та затеси логіку та збір інформації\",\"done\":false,\"priority\":false}]","priorities_v2":"[{\"text\":\"Верикоз на правій нозі\",\"blockId\":\"health\",\"taskIdx\":1,\"date\":\"2026-06-30\"}]","db_blocks_v2":"[{\"id\":\"health\",\"label\":\"здоровʼя\",\"icon\":\"🏃\",\"color\":\"#1d9e75\"},{\"id\":\"growth\",\"label\":\"розвиток\",\"icon\":\"📚\",\"color\":\"#d85a30\"},{\"id\":\"moment1\",\"label\":\"момент 1\",\"icon\":\"⚡\",\"color\":\"#ba7517\"},{\"id\":\"moment2\",\"label\":\"момент 2\",\"icon\":\"✨\",\"color\":\"#d4537e\"},{\"id\":\"car\",\"label\":\"машина\",\"icon\":\"🚗\",\"color\":\"#378add\"},{\"id\":\"parents\",\"label\":\"батьки\",\"icon\":\"👨‍👩‍👦\",\"color\":\"#639922\"},{\"id\":\"girl\",\"label\":\"дівчина\",\"icon\":\"💑\",\"color\":\"#d4537e\"}]","tasks_v2_moment1":"[{\"text\":\"допрацювати стажера\",\"date\":\"2026-08-30\",\"budget\":\"\",\"comment\":\"\",\"link\":\"https://styager1.netlify.app\",\"done\":false,\"priority\":false}]"};

/* ── константи ──────────────────────────────────────────────────── */
const EMOJIS = ['🎯','🏃','🚗','📚','⚡','✨','👨‍👩‍👦','💑','💪','🧠','💼','🏠','💰','🎵','✈️','🌱','🔧','📱','❤️','🎓'];
const COLORS = ['#e8334a','#1d9e75','#378add','#d85a30','#ff9f43','#d4537e','#639922','#993556','#185fa5','#0f6e56'];

const DEFAULT_BLOCKS = [
  { id: 'health',  label: 'здоровʼя',  icon: '🏃', color: '#1d9e75' },
  { id: 'car',     label: 'машина',    icon: '🚗', color: '#378add' },
  { id: 'growth',  label: 'розвиток',  icon: '📚', color: '#d85a30' },
  { id: 'moment1', label: 'момент 1',  icon: '⚡', color: '#ff9f43' },
  { id: 'moment2', label: 'момент 2',  icon: '✨', color: '#d4537e' },
  { id: 'parents', label: 'батьки',    icon: '👨‍👩‍👦', color: '#639922' },
  { id: 'girl',    label: 'дівчина',   icon: '💑', color: '#d4537e' },
];

/* ── ключі localStorage ─────────────────────────────────────────── */
function blocksKey() { return 'db_blocks_v2'; }
function lsKey(id) { return 'tasks_v2_' + id; }
function pKey() { return 'priorities_v2'; }

/* ── відновлення резервної копії (якщо localStorage порожній) ────── */
function restoreBackupIfEmpty() {
  Object.keys(BACKUP).forEach(k => {
    if (!localStorage.getItem(k)) localStorage.setItem(k, BACKUP[k]);
  });
}

/* ── читання / запис блоків ───────────────────────────────────────── */
function loadBlocks() {
  try {
    const r = localStorage.getItem(blocksKey());
    if (r) return JSON.parse(r);
  } catch {}
  localStorage.setItem(blocksKey(), JSON.stringify(DEFAULT_BLOCKS));
  return DEFAULT_BLOCKS;
}
function saveBlocks(b) {
  try { localStorage.setItem(blocksKey(), JSON.stringify(b)); } catch {}
}

/* ── читання / запис задач ──────────────────────────────────────── */
function loadTasks(id) {
  try { const r = localStorage.getItem(lsKey(id)); return r ? JSON.parse(r) : []; }
  catch { return []; }
}
function saveTasks(id, t) {
  try { localStorage.setItem(lsKey(id), JSON.stringify(t)); } catch {}
}

/* ── читання / запис пріоритетів ──────────────────────────────────── */
function loadP() {
  try { const r = localStorage.getItem(pKey()); return r ? JSON.parse(r) : []; }
  catch { return []; }
}
function saveP(p) {
  try { localStorage.setItem(pKey(), JSON.stringify(p)); } catch {}
}

/* ── допоміжні функції ─────────────────────────────────────────── */
function esc(t) { const d = document.createElement('div'); d.textContent = t; return d.innerHTML; }
function getLabelById(id) { const b = loadBlocks().find(b => b.id === id); return b ? b.label : id; }
function normalizeUrl(u) { if (!u) return ''; return (/^https?:\/\//i.test(u)) ? u : 'https://' + u; }

/* перетворює YYYY-MM-DD (формат <input type=date>) на ДД.ММ.РРРР для показу */
function formatDateForDisplay(iso) {
  if (!iso) return '';
  const parts = iso.split('-');
  if (parts.length !== 3) return iso;
  return parts[2] + '.' + parts[1] + '.' + parts[0];
}
