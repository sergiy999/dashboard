/* ── простий пароль на вхід (захист від випадкового перегляду) ─────
   Це НЕ справжній захист — будь-хто технічно підкований може
   подивитись код сторінки і знайти PASSWORD. Підходить лише щоб
   випадкова людина з посиланням не потрапила одразу на дашборд.

   Щоб УВІМКНУТИ: розкоментуй виклик initPasswordGate() в кінці
   index.html (в <script> після підключення всіх файлів)
   і встанови свій пароль нижче. */

const PASSWORD = 'змінитут';
const GATE_SESSION_KEY = 'gate_unlocked_v1';

function initPasswordGate() {
  if (sessionStorage.getItem(GATE_SESSION_KEY) === '1') return;

  const gate = document.createElement('div');
  gate.className = 'gate-bg';
  gate.id = 'gate-bg';
  gate.innerHTML = `
    <div class="gate-box">
      <h2>введи пароль</h2>
      <input type="password" class="gate-inp" id="gate-inp" autocomplete="off" maxlength="40"/>
      <button class="gate-btn" onclick="checkGatePassword()">увійти</button>
      <div class="gate-error" id="gate-error"></div>
    </div>`;
  document.body.appendChild(gate);

  const inp = document.getElementById('gate-inp');
  inp.focus();
  inp.addEventListener('keydown', e => { if (e.key === 'Enter') checkGatePassword(); });
}

function checkGatePassword() {
  const inp = document.getElementById('gate-inp');
  const err = document.getElementById('gate-error');
  if (inp.value === PASSWORD) {
    sessionStorage.setItem(GATE_SESSION_KEY, '1');
    document.getElementById('gate-bg').remove();
  } else {
    err.textContent = 'невірний пароль';
    inp.value = '';
    inp.focus();
  }
}
