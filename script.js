 const translations = {
    en: {
      appTitle: 'To-Do List',
      language: 'Language',
      theme: 'Theme',
      addBtn: 'Add',
      deleteBtn: 'Delete',
      editBtn: 'Edit',
      pinnedHeader: 'Pinned Tasks',
      completedTasks: 'Completed Tasks',
      uncompletedTasks: 'Uncompleted Tasks',
      column: idx => `Tasks (${idx + 1})`,
      alertEmpty: 'Please enter a task.',
      searchPlaceholder: 'Search tasks',
      dashboardTitle: 'Dashboard',
      backToList: 'Back to To-Do List',
      dueLabel: 'Due: '
    },
    ta: {
      appTitle: 'டோ டோ பட்டியல்',
      language: 'மொழி',
      theme: 'தீம்',
      addBtn: 'சேர்',
      deleteBtn: 'அகற்று',
      editBtn: 'திருத்து',
      pinnedHeader: 'முத்திரிக்கப்பட்டவை',
      completedTasks: 'முடிந்தவை',
      uncompletedTasks: 'முடாதவை',
      column: idx => `பணிகள் (${idx + 1})`,
      alertEmpty: 'தயவு செய்து ஒரு பணி சேர்க்கவும்.',
      searchPlaceholder: 'பணிகளை தேடு',
      dashboardTitle: 'கட்டுப்பாட்டு பலகை',
      backToList: 'பணிகளுக்கு திரும்பு',
      dueLabel: 'கால அளவு: '
    },
    hi: {
      appTitle: 'टू-डू सूचि',
      language: 'भाषा',
      theme: 'थीम',
      addBtn: 'जोड़ें',
      deleteBtn: 'हटाएँ',
      editBtn: 'संपादित करें',
      pinnedHeader: 'पिन किए गए कार्य',
      completedTasks: 'पूरा हुआ',
      uncompletedTasks: 'अपूर्ण',
      column: idx => `कार्य (${idx + 1})`,
      alertEmpty: 'कृपया एक कार्य दर्ज करें।',
      searchPlaceholder: 'कार्य खोजें',
      dashboardTitle: 'डैशबोर्ड',
      backToList: 'कार्य सूची पर वापस जाएं',
      dueLabel: 'समय सीमा: '
    }
  };
  let tasks = [], filteredSearch = "", currentLang = 'en';
  const columnsContainer = document.getElementById('columns');
  const taskInput = document.getElementById('taskInput');
  const deadlineInput = document.getElementById('deadlineInput');
  const searchInput = document.getElementById('search-tasks');
  const addButton = document.getElementById('addButton');
  const langSelect = document.getElementById('lang-select');
  const themeSelect = document.getElementById('theme-select');
  const calendarToggle = document.getElementById('calendarToggle');
  const calendarPopup = document.getElementById('calendarPopup');
  const calendarHeader = document.getElementById('calendarHeader');
  const calendarBody = document.getElementById('calendarBody');
  const dashboardBtn = document.getElementById('dashboardBtn');
  const dashboardPage = document.getElementById('dashboardPage');
  const mainPage = document.getElementById('mainPage');
  const dashboardStats = document.getElementById('dashboardStats');
  const backButton = document.getElementById('backButton');
  const allTasksDonePopup = document.getElementById('allTasksDonePopup');
  const closeAllDoneBtn = document.getElementById('closeAllDoneBtn');
  const confettiContainer = document.getElementById('confetti');
  function saveTasks() { localStorage.setItem('todo_advanced_tasks', JSON.stringify(tasks)); }
  function chunkArray(array, size) {
    let chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
  function initialize() {
    const savedTasks = localStorage.getItem('todo_advanced_tasks');
    tasks = savedTasks ? JSON.parse(savedTasks) : [];
    const savedLang = localStorage.getItem('todo_advanced_lang');
    if(savedLang && translations[savedLang]) {
      currentLang = savedLang;
      langSelect.value = currentLang;
    }
    const savedTheme = localStorage.getItem('todo_advanced_theme') || 'default';
    themeSelect.value = savedTheme;
    document.body.classList.remove('theme-dark', 'theme-blue');
    if(savedTheme === 'dark') document.body.classList.add('theme-dark');
    else if(savedTheme === 'blue') document.body.classList.add('theme-blue');
    translateUI();
    renderTasks();
    attachEvents();
  }
  function attachEvents() {
    langSelect.addEventListener('change', () => {
      currentLang = langSelect.value;
      localStorage.setItem('todo_advanced_lang', currentLang);
      translateUI(); renderTasks();
    });
    themeSelect.addEventListener('change', () => {
      const val = themeSelect.value;
      localStorage.setItem('todo_advanced_theme', val);
      document.body.classList.remove('theme-dark','theme-blue');
      if(val === 'dark') document.body.classList.add('theme-dark');
      else if(val === 'blue') document.body.classList.add('theme-blue');
    });
    searchInput.addEventListener('input', e => {
      filteredSearch = e.target.value.toLowerCase(); renderTasks();
    });
    addButton.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', e => { if (e.key === 'Enter') { e.preventDefault(); addTask(); } });
    dashboardBtn.addEventListener('click', () => {
      mainPage.style.display = 'none';
      dashboardPage.style.display = 'block';
      updateDashboardStats();
    });
    backButton.addEventListener('click', () => {
      dashboardPage.style.display = 'none';
      mainPage.style.display = 'flex';
    });
    calendarToggle.addEventListener('click', e => {
      e.stopPropagation();
      if(calendarPopup.style.display === 'block') {
        calendarPopup.style.display = 'none';
        calendarPopup.setAttribute('aria-hidden','true');
      } else {
        calendarPopup.style.display = 'block';
        calendarPopup.setAttribute('aria-hidden','false');
        renderCalendar(new Date());
      }
    });
    window.addEventListener('click', e => {
      if(!calendarPopup.contains(e.target) && e.target !== calendarToggle) {
        calendarPopup.style.display = 'none';
        calendarPopup.setAttribute('aria-hidden','true');
      }
    });
    closeAllDoneBtn.addEventListener('click', () => {
      allTasksDonePopup.classList.remove('show');
      confettiContainer.innerHTML = '';
    });
  }
  function translateUI() {
    const t = translations[currentLang];
    document.getElementById('main-title').textContent = t.appTitle;
    document.getElementById('lang-label').textContent = t.language;
    document.getElementById('theme-label').textContent = t.theme;
    taskInput.placeholder = t.addBtn;
    addButton.textContent = t.addBtn;
    searchInput.placeholder = t.searchPlaceholder;
    dashboardBtn.textContent = t.dashboardTitle;
    backButton.textContent = t.backToList;
  }
  function addTask() {
    const val = taskInput.value.trim();
    if(!val) {
      alert(translations[currentLang].alertEmpty);
      return;
    }
    tasks.unshift({
      id: Date.now().toString(),
      text: val[0].toUpperCase() + val.slice(1),
      completed: false,
      pinned: false,
      due: deadlineInput.value || null,
      createdAt: Date.now()
    });
    saveTasks(); renderTasks();
    taskInput.value = ''; deadlineInput.value = ''; taskInput.focus();
  }
  function renderTasks() {
    columnsContainer.innerHTML = '';
    const t = translations[currentLang];
    let filteredTasks = filteredSearch ? tasks.filter(t => t.text.toLowerCase().includes(filteredSearch)) : tasks;
    filteredTasks = [...filteredTasks].sort((a,b) => (a.pinned === b.pinned) ? 0 : a.pinned ? -1 : 1);
    const pinnedTasks = filteredTasks.filter(t => t.pinned);
    const unpinnedTasks = filteredTasks.filter(t => !t.pinned);
    const pinnedChunks = chunkArray(pinnedTasks, 10);
    const unpinnedChunks = chunkArray(unpinnedTasks, 10);
    pinnedChunks.forEach((chunk, idx) => {
      const col = document.createElement('div');
      col.className = 'task-column';
      const header = document.createElement('h2');
      header.textContent = pinnedChunks.length > 1 ? `${t.pinnedHeader} (${idx+1})` : t.pinnedHeader;
      col.appendChild(header);
      const ul = document.createElement('ul');
      ul.setAttribute('role', 'list');
      chunk.forEach(task => ul.appendChild(createTaskElement(task)));
      col.appendChild(ul);
      columnsContainer.appendChild(col);
    });
    unpinnedChunks.forEach((chunk, idx) => {
      const col = document.createElement('div');
      col.className = 'task-column';
      const colNum = pinnedChunks.length + idx;
      const header = document.createElement('h2');
      header.textContent = t.column ? t.column(colNum) : `Tasks (${colNum + 1})`;
      col.appendChild(header);
      const ul = document.createElement('ul');
      ul.setAttribute('role', 'list');
      chunk.forEach(task => ul.appendChild(createTaskElement(task)));
      col.appendChild(ul);
      columnsContainer.appendChild(col);
    });
    columnsContainer.style.justifyContent = (pinnedChunks.length + unpinnedChunks.length) === 1 ? 'center' : 'flex-start';
    checkAllTasksDone();
  }
  function createTaskElement(task) {
    const t = translations[currentLang];
    let li = document.createElement('li');
    li.dataset.id = task.id;
    li.draggable = true;
    if(task.completed) li.classList.add('completed');
    li.tabIndex = 0;
    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.setAttribute('aria-label', task.text + " checkbox");
    checkbox.addEventListener('change', () => {
      task.completed = checkbox.checked;
      saveTasks(); renderTasks();
    });
    let span = document.createElement('span');
    span.textContent = task.text;
    span.title = t.editBtn + ": double-click or click edit";
    span.addEventListener('dblclick', () => enableInlineEdit(task, span));
    if(task.due) {
      let small = document.createElement('small');
      let dt = new Date(task.due);
      if(!isNaN(dt)){
        small.textContent = t.dueLabel + dt.toLocaleString(currentLang, {year:'numeric',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'});
        span.appendChild(document.createElement('br'));
        span.appendChild(small);
      }
    }
    let pinBtn = document.createElement('button');
    pinBtn.textContent = task.pinned ? 'Unpin' : 'Pin';
    pinBtn.className = 'pin-btn';
    pinBtn.setAttribute('aria-label', (task.pinned ? 'Unpin ' : 'Pin ') + task.text);
    pinBtn.addEventListener('click', () => {
      task.pinned = !task.pinned;
      saveTasks(); renderTasks();
    });
    let editBtn = document.createElement('button');
    editBtn.textContent = t.editBtn;
    editBtn.className = 'edit-btn';
    editBtn.setAttribute('aria-label', t.editBtn + ' ' + task.text);
    editBtn.addEventListener('click', () => enableInlineEdit(task, span));
    let delBtn = document.createElement('button');
    delBtn.textContent = t.deleteBtn;
    delBtn.className = 'delete-btn';
    delBtn.setAttribute('aria-label', t.deleteBtn + ' ' + task.text);
    delBtn.addEventListener('click', () => {
      tasks = tasks.filter(t => t.id !== task.id);
      saveTasks(); renderTasks();
    });
    li.addEventListener('dragstart', dragStart);
    li.addEventListener('dragover', dragOver);
    li.addEventListener('drop', dropTask);
    li.appendChild(checkbox); li.appendChild(span); li.appendChild(pinBtn); li.appendChild(editBtn); li.appendChild(delBtn);
    return li;
  }
  function enableInlineEdit(task, span) {
    let input = document.createElement('input');
    input.type = 'text';
    input.className = 'edit-input';
    input.value = task.text;
    span.replaceWith(input);
    input.focus();
    input.select();
    function saveEdit() {
      let val = input.value.trim();
      if(!val) {
        alert(translations[currentLang].alertEmpty);
        input.focus();
        return;
      }
      task.text = val.charAt(0).toUpperCase() + val.slice(1);
      saveTasks(); renderTasks();
    }
    function cancelEdit() { input.replaceWith(span); }
    input.addEventListener('keydown', e => { if(e.key === 'Enter') saveEdit(); if(e.key === 'Escape') cancelEdit(); });
    input.addEventListener('blur', saveEdit);
  }
  let draggedId = null;
  function dragStart(e) {
    draggedId = e.currentTarget.dataset.id;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', draggedId);
  }
  function dragOver(e) { e.preventDefault(); e.currentTarget.classList.add('drop-highlight'); }
  function dropTask(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drop-highlight');
    const targetId = e.currentTarget.dataset.id;
    if(draggedId === targetId) return;
    let fromIndex = tasks.findIndex(t => t.id === draggedId);
    let toIndex = tasks.findIndex(t => t.id === targetId);
    if(fromIndex < 0 || toIndex < 0) return;
    const moved = tasks.splice(fromIndex, 1)[0];
    tasks.splice(toIndex, 0, moved);
    saveTasks(); renderTasks();
  }
  function renderCalendar(date) {
    calendarBody.innerHTML = "";
    const year = date.getFullYear();
    const month = date.getMonth();
    const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    calendarHeader.textContent = `${monthNames[month]} ${year}`;
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month+1, 0).getDate();
    let dayNum = 1;
    for(let i=0; i<6; i++) {
      let tr = document.createElement('tr');
      for(let j=0; j<7; j++) {
        let td = document.createElement('td');
        td.style.padding = '6px';
        td.style.textAlign = 'center';
        if(i === 0 && j < firstDay) { td.textContent = ""; }
        else if(dayNum > daysInMonth) { td.textContent = ""; }
        else {
          td.textContent = dayNum;
          let now = new Date();
          if(dayNum === now.getDate() && month === now.getMonth() && year === now.getFullYear()) {
            td.classList.add('today');
          }
          dayNum++;
        }
        tr.appendChild(td);
      }
      calendarBody.appendChild(tr);
    }
  }
  function updateDashboardStats() {
    const t = translations[currentLang];
    const completed = tasks.filter(t => t.completed).length;
    const uncompleted = tasks.length - completed;
    dashboardStats.innerHTML = `
      <div class="completed" role="region" aria-label="${t.completedTasks}">
        <h3>${completed}</h3>
        <p>${t.completedTasks}</p>
      </div>
      <div class="uncompleted" role="region" aria-label="${t.uncompletedTasks}">
        <h3>${uncompleted}</h3>
        <p>${t.uncompletedTasks}</p>
      </div>
    `;
    document.getElementById('dashboardTitle').textContent = t.dashboardTitle;
    backButton.textContent = t.backToList;
  }
  function launchConfetti() {
    confettiContainer.innerHTML = '';
    for(let i=0; i<30; i++) {
      let confetti = document.createElement('div');
      confetti.className = 'confetti-piece';
      confetti.style.left = (Math.random() * 100) + 'vw';
      confetti.style.top = '-10px';
      confetti.style.backgroundColor = `hsl(${Math.random()*360}, 70%, 60%)`;
      confetti.style.animationDelay = (Math.random() * 1.5).toFixed(2) + 's';
      confetti.style.animationDuration = (1.5 + Math.random()).toFixed(2) + 's';
      confettiContainer.appendChild(confetti);
      confetti.addEventListener('animationend', () => confetti.remove());
    }
  }
  // MAIN LOGIC for completion: show popup only, do not leave page!
  function checkAllTasksDone() {
    if (tasks.length > 0 && tasks.every(t => t.completed)) {
      allTasksDonePopup.classList.add('show');
      launchConfetti();
      // No page navigation! Just show the popup
    } else {
      allTasksDonePopup.classList.remove('show');
      confettiContainer.innerHTML = '';
    }
  }
  document.addEventListener('DOMContentLoaded', initialize);