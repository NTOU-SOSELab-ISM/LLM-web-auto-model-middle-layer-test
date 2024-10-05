// 全局變量
let events = [];
let currentDate = new Date();
let selectedDate = new Date();
let editingEventId = null;

// 初始化函數
window.onload = function() {
    loadEvents();
    initCalendar();
    initWeekView();
    initEventModal();
    initSearchAndFilter();
    initTodayTodo();
};

// 從localStorage或JSON文件加載事件
function loadEvents() {
    if (localStorage.getItem('events')) {
        events = JSON.parse(localStorage.getItem('events'));
    } else {
        fetch('events.json')
            .then(response => response.json())
            .then(data => {
                events = data;
                saveEvents();
            });
    }
}

// 保存事件到localStorage
function saveEvents() {
    localStorage.setItem('events', JSON.stringify(events));
}

// 初始化小日曆
function initCalendar() {
    updateCalendar();
    document.getElementById('prev-month').onclick = () => changeMonth(-1);
    document.getElementById('next-month').onclick = () => changeMonth(1);
}

// 更新小日曆
function updateCalendar() {
    const monthYearLabel = document.getElementById('current-month-year');
    monthYearLabel.textContent = `${currentDate.getFullYear()}年${currentDate.getMonth() + 1}月`;
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const calendarBody = document.createElement('table');
    const daysOfWeek = ['日', '一', '二', '三', '四', '五', '六'];

    // 表頭
    const headerRow = document.createElement('tr');
    daysOfWeek.forEach(day => {
        const th = document.createElement('th');
        th.textContent = day;
        headerRow.appendChild(th);
    });
    calendarBody.appendChild(headerRow);

    // 日期
    let date = 1;
    for (let i = 0; i < 6; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < 7; j++) {
            const cell = document.createElement('td');
            if (i === 0 && j < firstDay.getDay()) {
                cell.textContent = '';
            } else if (date > lastDay.getDate()) {
                break;
            } else {
                cell.textContent = date;
                const cellDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), date);
                if (isSameDay(cellDate, new Date())) {
                    cell.classList.add('today');
                }
                if (isSameDay(cellDate, selectedDate)) {
                    cell.classList.add('selected');
                }
                cell.onclick = () => {
                    selectedDate = cellDate;
                    updateCalendar();
                    initWeekView();
                };
                date++;
            }
            row.appendChild(cell);
        }
        calendarBody.appendChild(row);
    }
    const miniCalendar = document.getElementById('mini-calendar');
    miniCalendar.innerHTML = '';
    miniCalendar.appendChild(calendarBody);
}

// 切換月份
function changeMonth(delta) {
    currentDate.setMonth(currentDate.getMonth() + delta);
    updateCalendar();
}

// 判斷是否為同一天
function isSameDay(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
}

// 初始化週視圖
function initWeekView() {
    const weekView = document.getElementById('week-view');
    weekView.innerHTML = '';
    weekView.style.display = 'flex'; // 添加這一行
    weekView.style.flexWrap = 'wrap'; // 添加這一行
    const startOfWeek = getStartOfWeek(selectedDate);
    for (let i = 0; i < 7; i++) {
        const dayDate = new Date(startOfWeek);
        dayDate.setDate(dayDate.getDate() + i);
        const dayColumn = document.createElement('div');
        dayColumn.classList.add('day-column');
        dayColumn.innerHTML = `<h3>${getDayName(dayDate.getDay())} (${dayDate.getMonth() + 1}/${dayDate.getDate()})</h3>`;
        const dayEvents = events.filter(event => isSameDay(new Date(event.date), dayDate));
        dayEvents.forEach(event => {
            const eventCard = document.createElement('div');
            eventCard.classList.add('event-card', event.type);
            eventCard.innerHTML = `<strong>${event.time}</strong> ${event.title}`;
            eventCard.onclick = () => openEventModal(event);
            dayColumn.appendChild(eventCard);
        });
        weekView.appendChild(dayColumn);
    }
}

// 獲取星期名稱
function getDayName(dayIndex) {
    const days = ['日', '一', '二', '三', '四', '五', '六'];
    return days[dayIndex];
}

// 獲取當週的開始日期
function getStartOfWeek(date) {
    const day = date.getDay();
    const diff = date.getDate() - day;
    return new Date(date.setDate(diff));
}

// 初始化事件模態框
function initEventModal() {
    const modal = document.getElementById('event-modal');
    const closeButton = document.querySelector('.close-button');
    const addEventButton = document.getElementById('add-event-button');
    const saveButton = document.getElementById('save-button');
    const deleteButton = document.getElementById('delete-button');
    const eventForm = document.getElementById('event-form');

    addEventButton.onclick = () => openEventModal();
    closeButton.onclick = () => closeEventModal();
    window.onclick = event => {
        if (event.target == modal) {
            closeEventModal();
        }
    };

    saveButton.onclick = event => {
        event.preventDefault();
        saveEvent();
    };

    deleteButton.onclick = event => {
        event.preventDefault();
        deleteEvent();
    };
}

// 打開事件模態框
function openEventModal(event = null) {
    const modal = document.getElementById('event-modal');
    modal.style.display = 'block';
    if (event) {
        document.getElementById('modal-title').textContent = '編輯事件';
        document.getElementById('event-date').value = event.date;
        document.getElementById('event-time').value = event.time;
        document.getElementById('event-title').value = event.title;
        document.getElementById('event-description').value = event.description;
        document.getElementById('event-type').value = event.type;
        document.getElementById('delete-button').style.display = 'inline-block';
        editingEventId = event.id;
    } else {
        document.getElementById('modal-title').textContent = '新增事件';
        document.getElementById('event-form').reset();
        document.getElementById('delete-button').style.display = 'none';
        editingEventId = null;
    }
}

// 關閉事件模態框
function closeEventModal() {
    const modal = document.getElementById('event-modal');
    modal.style.display = 'none';
}

// 保存事件
function saveEvent() {
    const event = {
        id: editingEventId || Date.now(),
        date: document.getElementById('event-date').value,
        time: document.getElementById('event-time').value,
        title: document.getElementById('event-title').value,
        description: document.getElementById('event-description').value,
        type: document.getElementById('event-type').value
    };
    if (editingEventId) {
        const index = events.findIndex(e => e.id === editingEventId);
        events[index] = event;
    } else {
        events.push(event);
    }
    saveEvents();
    initWeekView();
    initTodayTodo();
    closeEventModal();
}

// 刪除事件
function deleteEvent() {
    if (confirm('確定要刪除這個事件嗎？')) {
        events = events.filter(e => e.id !== editingEventId);
        saveEvents();
        initWeekView();
        initTodayTodo();
        closeEventModal();
    }
}

// 初始化搜索和過濾功能
function initSearchAndFilter() {
    const searchButton = document.getElementById('search-button');
    searchButton.onclick = () => {
        const keyword = document.getElementById('search-input').value.toLowerCase();
        const filterType = document.getElementById('filter-select').value;
        const filteredEvents = events.filter(event => {
            const matchesKeyword = event.title.toLowerCase().includes(keyword) ||
                                   event.description.toLowerCase().includes(keyword);
            const matchesType = filterType === 'all' || event.type === filterType;
            return matchesKeyword && matchesType;
        });
        displaySearchResults(filteredEvents);
    };
}

// 顯示搜索結果
function displaySearchResults(results) {
    const weekView = document.getElementById('week-view');
    weekView.innerHTML = '';
    weekView.style.display = 'block'; // 添加這一行
    const groupedEvents = groupEventsByWeek(results);
    const sortedWeeks = Object.keys(groupedEvents).sort((a, b) => b - a); // 近期的在上面
    sortedWeeks.forEach(weekStart => {
        const weekContainer = document.createElement('div');
        weekContainer.classList.add('week-container');
        const date = new Date(Number(weekStart));
        const weekHeader = document.createElement('h2');
        weekHeader.textContent = `週開始於 ${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
        weekContainer.appendChild(weekHeader);
        const weekEvents = groupedEvents[weekStart];
        weekEvents.forEach(event => {
            const eventCard = document.createElement('div');
            eventCard.classList.add('event-card', event.type);
            eventCard.innerHTML = `<strong>${event.date} ${event.time}</strong> ${event.title}`;
            eventCard.onclick = () => openEventModal(event);
            weekContainer.appendChild(eventCard);
        });
        weekView.appendChild(weekContainer);
    });
}


// 按週分組事件
function groupEventsByWeek(events) {
    const groups = {};
    events.forEach(event => {
        const eventDate = new Date(event.date);
        const startOfWeek = getStartOfWeek(eventDate).getTime();
        if (!groups[startOfWeek]) {
            groups[startOfWeek] = [];
        }
        groups[startOfWeek].push(event);
    });
    return groups;
}

// 初始化今日待辦
function initTodayTodo() {
    const todayTodo = document.getElementById('today-todo');
    const todayEvents = events.filter(event => isSameDay(new Date(event.date), new Date()));
    if (todayEvents.length > 0) {
        todayTodo.innerHTML = '<h2>今日待辦事項</h2>';
        todayEvents.forEach(event => {
            const eventItem = document.createElement('div');
            eventItem.classList.add('event-card', event.type);
            eventItem.innerHTML = `<strong>${event.time}</strong> ${event.title}`;
            eventItem.onclick = () => openEventModal(event);
            todayTodo.appendChild(eventItem);
        });
    } else {
        todayTodo.innerHTML = '';
    }
}
