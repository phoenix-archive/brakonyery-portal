const authScreen = document.getElementById('authScreen');
const portalScreen = document.getElementById('portalScreen');
const authForm = document.getElementById('authForm');
const authMessage = document.getElementById('authMessage');
const scanOverlay = document.getElementById('scanOverlay');
const activeUser = document.getElementById('activeUser');
const logoutBtn = document.getElementById('logoutBtn');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const modalClose = document.getElementById('modalClose');
const cardsGrid = document.getElementById('cardsGrid');

const STORAGE_ACCOUNT = 'brk_demo_account';
const STORAGE_SESSION = 'brk_demo_session';

const content = {
  who: {
    title: 'Кто мы?',
    body: `Организация «Браконьеры» является независимым международным объединением, деятельность которого направлена на сохранение стабильности, защиту человечества и обеспечение долгосрочного развития цивилизации.

На протяжении многих лет сотрудники организации действуют в различных регионах мира, предотвращая кризисы, устраняя угрозы общественной безопасности и создавая условия для устойчивого развития человеческого общества.

Несмотря на масштаб деятельности, организация сохраняет высокий уровень конфиденциальности для защиты своих сотрудников, операций и стратегических целей.`
  },
  mission: {
    title: 'Наша миссия',
    body: `Мы убеждены, что хаос, войны, преступность и разобщённость являются серьёзными препятствиями на пути прогресса человеческой цивилизации.

Наша задача заключается в объединении человечества под единым направлением развития, устранении факторов дестабилизации и формировании устойчивого мирового порядка, способного обеспечить безопасность будущих поколений.

Мы стремимся создать мир, в котором ресурсы используются рационально, знания служат развитию цивилизации, а решения принимаются ради общего блага.`
  },
  future: {
    title: 'Наше будущее',
    body: `Земля является лишь первым этапом развития человечества.

Организация считает своим долгом подготовить цивилизацию к эпохе межзвёздного существования, в которой разум сможет распространить знания, стабильность и процветание далеко за пределы родного мира.

Мы верим, что только единая цивилизация способна преодолеть вызовы будущего и привести человечество к новым горизонтам развития.`
  },
  principles: {
    title: 'Наши принципы',
    body: `Единство — человечество сильнее, когда действует сообща.

Порядок — стабильность является фундаментом прогресса.

Развитие — постоянное совершенствование необходимо для выживания цивилизации.

Ответственность — сила существует для защиты будущего.

Конфиденциальность — информация должна использоваться ответственно и в интересах общего блага.`
  },
  message: {
    title: 'Обращение к сотрудникам',
    body: `Получая доступ к ресурсам организации, вы становитесь частью проекта, масштабы которого превосходят интересы отдельных государств, корпораций и поколений.

Ваши действия влияют на будущее человечества.

Добро пожаловать в ряды Браконьеров.`
  }
};

function setMessage(text, ok = false) {
  authMessage.textContent = text;
  authMessage.style.color = ok ? '#d6ffe6' : '#ffd1d2';
}

function getAccount() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_ACCOUNT) || 'null');
  } catch {
    return null;
  }
}

function saveAccount(account) {
  localStorage.setItem(STORAGE_ACCOUNT, JSON.stringify(account));
}

function saveSession(username) {
  localStorage.setItem(STORAGE_SESSION, JSON.stringify({ username, signedInAt: Date.now() }));
}

function getSession() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_SESSION) || 'null');
  } catch {
    return null;
  }
}

function showPortal(username) {
  activeUser.textContent = username;
  authScreen.classList.add('hidden');
  portalScreen.classList.remove('hidden');
}

function showAuth() {
  portalScreen.classList.add('hidden');
  authScreen.classList.remove('hidden');
  authMessage.textContent = '';
}

function openModal(sectionKey) {
  const item = content[sectionKey];
  if (!item) return;
  modalTitle.textContent = item.title;
  modalBody.textContent = item.body;
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
}

function closeModal() {
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
}

function simulateScanAndEnter(username) {
  scanOverlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  window.setTimeout(() => {
    scanOverlay.classList.add('hidden');
    document.body.style.overflow = '';
    saveSession(username);
    showPortal(username);
  }, 1800);
}

authForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  if (username.length < 3) {
    setMessage('Имя пользователя должно содержать не менее 3 символов.');
    return;
  }

  if (!email.includes('@') || !email.includes('.')) {
    setMessage('Введите корректный адрес электронной почты.');
    return;
  }

  if (password.length < 6) {
    setMessage('Пароль должен содержать не менее 6 символов.');
    return;
  }

  const account = getAccount();

  if (!account) {
    saveAccount({ username, email, password });
    setMessage('Профиль создан. Проверка доступа... ', true);
    simulateScanAndEnter(username);
    return;
  }

  if (account.email !== email || account.password !== password) {
    setMessage('Данные доступа не подтверждены. Проверьте имя, почту и пароль.');
    return;
  }

  if (account.username !== username) {
    saveAccount({ ...account, username });
  }

  setMessage('Доступ подтверждён. Перенаправление в портал...', true);
  simulateScanAndEnter(username);
});

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem(STORAGE_SESSION);
  showAuth();
});

cardsGrid.addEventListener('click', (event) => {
  const card = event.target.closest('.info-card');
  if (!card) return;
  openModal(card.dataset.section);
});

modal.addEventListener('click', (event) => {
  if (event.target.matches('[data-close="true"]')) closeModal();
});
modalClose.addEventListener('click', closeModal);
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeModal();
});

// Auto sign-in for demo convenience
const session = getSession();
if (session?.username) {
  showPortal(session.username);
} else {
  showAuth();
}
