// script.js
let timer;
let timeLeft;
let isPaused = true;
let isRunning = false;
let workSessionsCompleted = 0;

const timeDisplay = document.getElementById('time-display');
const toggleButton = document.getElementById('toggle-button');
const resetButton = document.getElementById('reset-button');
const taskInput = document.getElementById('task-input');
const addTaskButton = document.getElementById('add-task-button');
const taskList = document.getElementById('task-list');
const themeToggleButton = document.getElementById('theme-toggle-button');
const currentTime = document.getElementById('current-time');
const sessionTypeDisplay = document.getElementById('session-type');

const sessionTypes = [
    { duration: 15 * 60, color: 'bg-green-500' },
    { duration: 25 * 60, color: 'bg-yellow-500' },
    { duration: 35 * 60, color: 'bg-red-500' },
];

function getCurrentSessionType() {
    if (workSessionsCompleted < 2) return sessionTypes[0];
    if (workSessionsCompleted < 4) return sessionTypes[1];
    return sessionTypes[2];
}

function updateTimeDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timeDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function updateProgressCircle() {
    const sessionType = getCurrentSessionType();
    currentTime.className = `bg-black text-white px-2 py-1 rounded flex items-center space-x-1 ${sessionType.color}`;
    sessionTypeDisplay.textContent = sessionType.duration === 15 * 60 ? "Short" : sessionType.duration === 25 * 60 ? "Medium" : "Long";
}

function toggleTimer() {
    if (isRunning) {
        pauseTimer();
    } else {
        startTimer();
    }
}

function startTimer() {
    if (isPaused) {
        isPaused = false;
        isRunning = true;
        toggleButton.textContent = 'Pause';
        toggleButton.classList.add('pause');

        const sessionType = getCurrentSessionType();
        timeLeft = sessionType.duration;

        timer = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateTimeDisplay();
            } else {
                clearInterval(timer);
                alert('Time is up!');
                workSessionsCompleted++;
                resetTimer();
            }
        }, 1000);
    }
}

function pauseTimer() {
    isPaused = true;
    isRunning = false;
    clearInterval(timer);
    toggleButton.textContent = 'Start';
    toggleButton.classList.remove('pause');
}

function resetTimer() {
    isPaused = true;
    isRunning = false;
    clearInterval(timer);
    timeLeft = getCurrentSessionType().duration;
    updateTimeDisplay();
    toggleButton.textContent = 'Start';
    toggleButton.classList.remove('pause');
}

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText !== "") {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<span>${taskText}</span> <button class="delete-task-button">x</button>`;
        taskList.appendChild(listItem);
        taskInput.value = "";

        listItem.querySelector('.delete-task-button').addEventListener('click', () => {
            taskList.removeChild(listItem);
        });
    }
}

function toggleTheme() {
    document.body.classList.toggle('bg-black');
    document.body.classList.toggle('bg-white');
    const theme = document.body.classList.contains('bg-black') ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
}

function loadTheme() {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
        document.body.classList.add('bg-black');
        document.body.classList.remove('bg-white');
    } else {
        document.body.classList.add('bg-white');
        document.body.classList.remove('bg-black');
    }
}

toggleButton.addEventListener('click', toggleTimer);
resetButton.addEventListener('click', resetTimer);
addTaskButton.addEventListener('click', addTask);
themeToggleButton.addEventListener('click', toggleTheme);

loadTheme();
resetTimer();
