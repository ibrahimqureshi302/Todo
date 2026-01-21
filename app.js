// iOS To-Do App - Complete JavaScript

// State management
let currentUser = null;
let users = JSON.parse(localStorage.getItem('users')) || [];
let tasks = JSON.parse(localStorage.getItem('tasks')) || {};
let editingTaskId = null;
let currentFilter = 'all';
let darkMode = false;
let currentPriority = 'medium';

// Stopwatch variables
let stopwatchInterval = null;
let stopwatchTime = 0;
let stopwatchRunning = false;

// DOM Elements for Landing Page
const landingScreen = document.getElementById('landing-screen');
const authScreen = document.getElementById('auth-screen');
const appScreen = document.getElementById('app-screen');
const getStartedButton = document.getElementById('get-started-button');
const learnMoreButton = document.getElementById('learn-more-button');
const finalCtaButton = document.getElementById('final-cta-button');
const backToLandingButton = document.getElementById('back-to-landing');
const themeToggleLanding = document.getElementById('theme-toggle-landing');
const themeIconLanding = document.getElementById('theme-icon-landing');
const themeToggleAuth = document.getElementById('theme-toggle-auth');
const themeIconAuth = document.getElementById('theme-icon-auth');

// Existing DOM Elements
const loginButton = document.getElementById('login-button');
const showRegisterButton = document.getElementById('show-register');
const backToLoginButton = document.getElementById('back-to-login');
const registerButton = document.getElementById('register-button');
const loginUsername = document.getElementById('login-username');
const loginPassword = document.getElementById('login-password');
const registerUsername = document.getElementById('register-username');
const registerPassword = document.getElementById('register-password');
const registerConfirmPassword = document.getElementById('register-confirm-password');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const addTaskButton = document.getElementById('add-task-button');
const mobileAddButton = document.getElementById('mobile-add-button');
const addTaskButtonMobile = document.getElementById('add-task-button-mobile');
const taskModal = document.getElementById('task-modal');
const cancelTaskButton = document.getElementById('cancel-task-button');
const closeModalButton = document.getElementById('close-modal');
const saveTaskButton = document.getElementById('save-task-button');
const taskTitle = document.getElementById('task-title');
const taskDescription = document.getElementById('task-description');
const taskDueDate = document.getElementById('task-due-date');
const logoutButton = document.getElementById('logout-button');
const userAvatar = document.getElementById('user-avatar');
const userAvatarMobile = document.getElementById('user-avatar-mobile');
const userMenu = document.getElementById('user-menu');
const menuUsername = document.getElementById('menu-username');
const welcomeUsername = document.getElementById('welcome-username');
const welcomeTaskCount = document.getElementById('welcome-task-count');
const tasksContainer = document.getElementById('tasks-container');
const noTasksMessage = document.getElementById('no-tasks-message');
const totalTasksEl = document.getElementById('total-tasks');
const completedTasksEl = document.getElementById('completed-tasks');
const pendingTasksEl = document.getElementById('pending-tasks');
const totalTasksMobileEl = document.getElementById('total-tasks-mobile');
const completedTasksMobileEl = document.getElementById('completed-tasks-mobile');
const pendingTasksMobileEl = document.getElementById('pending-tasks-mobile');
const modalTitle = document.getElementById('modal-title');
const alertContainer = document.getElementById('alert-container');
const themeToggleApp = document.getElementById('theme-toggle-app');
const themeToggleAppMobile = document.getElementById('theme-toggle-app-mobile');
const themeIconApp = document.getElementById('theme-icon-app');
const themeIconAppMobile = document.getElementById('theme-icon-app-mobile');
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const mainContent = document.querySelector('main');

// Date/Time/Stopwatch Elements
const currentTimeEl = document.getElementById('current-time');
const currentDateEl = document.getElementById('current-date');
const sidebarDateEl = document.getElementById('sidebar-date');
const sidebarDayEl = document.getElementById('sidebar-day');
const sidebarFullDateEl = document.getElementById('sidebar-full-date');
const sidebarTimeEl = document.getElementById('sidebar-time');
const sidebarPeriodEl = document.getElementById('sidebar-period');
const sidebarTimezoneEl = document.getElementById('sidebar-timezone');
const stopwatchDisplay = document.getElementById('stopwatch-display');
const stopwatchStart = document.getElementById('stopwatch-start');
const stopwatchPause = document.getElementById('stopwatch-pause');
const stopwatchReset = document.getElementById('stopwatch-reset');

// Initialize the app
function init() {
    // Initialize AOS animations
    AOS.init({
        duration: 800,
        once: true,
        offset: 100
    });
    
    // Load theme preference
    loadTheme();
    
    // Check if user is already logged in
    checkLoggedInUser();
    
    // Setup event listeners
    setupEventListeners();
    
    // Set default priority
    setPriority('medium');
    
    // Start date/time updates
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    // Initialize stopwatch
    updateStopwatchDisplay();
    
    // Set minimum date for due date input to today
    const today = new Date().toISOString().split('T')[0];
    if (taskDueDate) {
        taskDueDate.min = today;
    }
    
    // Show landing page by default
    showLandingScreen();
}

// Load theme from localStorage
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        enableDarkMode();
    } else if (savedTheme === 'light') {
        enableLightMode();
    } else {
        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            enableDarkMode();
        } else {
            enableLightMode();
        }
    }
}

// Enable dark mode
function enableDarkMode() {
    document.documentElement.classList.remove('light');
    document.documentElement.classList.add('dark');
    darkMode = true;
    
    // Update all theme icons
    if (themeIconLanding) themeIconLanding.className = 'fas fa-sun';
    if (themeIconAuth) themeIconAuth.className = 'fas fa-sun';
    if (themeIconApp) themeIconApp.className = 'fas fa-sun';
    if (themeIconAppMobile) themeIconAppMobile.className = 'fas fa-sun';
    
    localStorage.setItem('theme', 'dark');
    updateTextColors();
}

// Enable light mode
function enableLightMode() {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
    darkMode = false;
    
    // Update all theme icons
    if (themeIconLanding) themeIconLanding.className = 'fas fa-moon';
    if (themeIconAuth) themeIconAuth.className = 'fas fa-moon';
    if (themeIconApp) themeIconApp.className = 'fas fa-moon';
    if (themeIconAppMobile) themeIconAppMobile.className = 'fas fa-moon';
    
    localStorage.setItem('theme', 'light');
    updateTextColors();
}

// Update text colors for better visibility
function updateTextColors() {
    setTimeout(() => {
        const allTextElements = document.querySelectorAll('body, .text-gray-800, .text-gray-700, .text-gray-600, .text-gray-500, .text-gray-400');
        allTextElements.forEach(el => {
            el.style.display = 'none';
            el.offsetHeight;
            el.style.display = '';
        });
    }, 50);
}

// Toggle theme
function toggleTheme() {
    if (darkMode) {
        enableLightMode();
        showAlert('Switched to light mode', 'info');
    } else {
        enableDarkMode();
        showAlert('Switched to dark mode', 'info');
    }
}

// Update date and time displays
function updateDateTime() {
    const now = new Date();
    
    // Sidebar date card
    sidebarDateEl.textContent = now.getDate();
    sidebarDayEl.textContent = now.toLocaleDateString([], { weekday: 'long' });
    sidebarFullDateEl.textContent = now.toLocaleDateString([], { month: 'long', year: 'numeric' });
    
    // Sidebar time card
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    
    sidebarTimeEl.textContent = `${formattedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    sidebarPeriodEl.textContent = ampm;
    sidebarTimezoneEl.textContent = Intl.DateTimeFormat().resolvedOptions().timeZone;
}

// Update stopwatch display
function updateStopwatchDisplay() {
    const hours = Math.floor(stopwatchTime / 3600000);
    const minutes = Math.floor((stopwatchTime % 3600000) / 60000);
    const seconds = Math.floor((stopwatchTime % 60000) / 1000);
    const milliseconds = Math.floor((stopwatchTime % 1000) / 10);
    
    stopwatchDisplay.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
}

// Start stopwatch
function startStopwatch() {
    if (!stopwatchRunning) {
        stopwatchRunning = true;
        const startTime = Date.now() - stopwatchTime;
        
        stopwatchInterval = setInterval(() => {
            stopwatchTime = Date.now() - startTime;
            updateStopwatchDisplay();
        }, 10);
        
        stopwatchStart.innerHTML = '<i class="fas fa-play mr-1 md:mr-2"></i> Running';
        stopwatchStart.disabled = true;
        stopwatchPause.disabled = false;
        
        showAlert('Stopwatch started', 'info');
    }
}

// Pause stopwatch
function pauseStopwatch() {
    if (stopwatchRunning) {
        stopwatchRunning = false;
        clearInterval(stopwatchInterval);
        
        stopwatchStart.innerHTML = '<i class="fas fa-play mr-1 md:mr-2"></i> Resume';
        stopwatchStart.disabled = false;
        
        showAlert('Stopwatch paused', 'info');
    }
}

// Reset stopwatch
function resetStopwatch() {
    stopwatchRunning = false;
    clearInterval(stopwatchInterval);
    stopwatchTime = 0;
    
    updateStopwatchDisplay();
    
    stopwatchStart.innerHTML = '<i class="fas fa-play mr-1 md:mr-2"></i> Start';
    stopwatchStart.disabled = false;
    stopwatchPause.disabled = true;
    
    showAlert('Stopwatch reset', 'info');
}

// Toggle mobile menu
function toggleMobileMenu() {
    if (mobileMenu) {
        mobileMenu.classList.toggle('hidden');
        const icon = mobileMenuToggle.querySelector('i');
        if (mobileMenu.classList.contains('hidden')) {
            icon.className = 'fas fa-bars text-base';
            if (mainContent) {
                mainContent.style.marginTop = '0';
                mainContent.style.transition = 'margin-top 0.3s ease';
            }
        } else {
            icon.className = 'fas fa-times text-base';
            if (mainContent) {
                const menuHeight = mobileMenu.offsetHeight;
                mainContent.style.marginTop = `${menuHeight + 20}px`;
                mainContent.style.transition = 'margin-top 0.3s ease';
            }
        }
    }
}

// Close mobile menu
function closeMobileMenu() {
    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
        const icon = mobileMenuToggle.querySelector('i');
        icon.className = 'fas fa-bars text-base';
        if (mainContent) {
            mainContent.style.marginTop = '0';
            mainContent.style.transition = 'margin-top 0.3s ease';
        }
    }
}

// Screen Navigation Functions
function showLandingScreen() {
    landingScreen.classList.remove('hidden');
    authScreen.classList.add('hidden');
    appScreen.classList.add('hidden');
    
    // Reset forms
    loginUsername.value = '';
    loginPassword.value = '';
    registerUsername.value = '';
    registerPassword.value = '';
    registerConfirmPassword.value = '';
    
    // Make sure login form is visible
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
}

function showAuthScreen() {
    landingScreen.classList.add('hidden');
    authScreen.classList.remove('hidden');
    appScreen.classList.add('hidden');
    
    // Center the auth screen
    authScreen.classList.add('flex');
    authScreen.classList.add('items-center');
    authScreen.classList.add('justify-center');
}

function showAppScreen() {
    landingScreen.classList.add('hidden');
    authScreen.classList.add('hidden');
    appScreen.classList.remove('hidden');
    
    // Update UI with user info
    if (currentUser) {
        const initial = currentUser.username.charAt(0).toUpperCase();
        userAvatar.textContent = initial;
        if (userAvatarMobile) userAvatarMobile.textContent = initial;
        menuUsername.textContent = currentUser.username;
        welcomeUsername.textContent = currentUser.username;
        
        // Load user's tasks
        loadTasks();
    }
    
    // Force a theme update
    setTimeout(() => {
        if (darkMode) {
            enableDarkMode();
        } else {
            enableLightMode();
        }
    }, 100);
}

// Check if user is already logged in
function checkLoggedInUser() {
    const loggedInUser = localStorage.getItem('currentUser');
    if (loggedInUser) {
        try {
            currentUser = JSON.parse(loggedInUser);
            showAppScreen();
        } catch (e) {
            console.error('Error parsing user data:', e);
            localStorage.removeItem('currentUser');
        }
    }
}

// Setup all event listeners
function setupEventListeners() {
    // Landing page buttons
    if (getStartedButton) {
        getStartedButton.addEventListener('click', () => showAuthScreen());
    }
    
    if (learnMoreButton) {
        learnMoreButton.addEventListener('click', () => {
            // Scroll to features section
            document.querySelector('.features-section').scrollIntoView({ 
                behavior: 'smooth' 
            });
        });
    }
    
    if (finalCtaButton) {
        finalCtaButton.addEventListener('click', () => showAuthScreen());
    }
    
    if (backToLandingButton) {
        backToLandingButton.addEventListener('click', () => showLandingScreen());
    }
    
    // Theme toggles
    if (themeToggleLanding) {
        themeToggleLanding.addEventListener('click', toggleTheme);
    }
    
    if (themeToggleAuth) {
        themeToggleAuth.addEventListener('click', toggleTheme);
    }
    
    themeToggleApp.addEventListener('click', toggleTheme);
    
    if (themeToggleAppMobile) {
        themeToggleAppMobile.addEventListener('click', () => {
            toggleTheme();
            closeMobileMenu();
        });
    }
    
    // Mobile menu toggle
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Auth form toggling
    showRegisterButton.addEventListener('click', () => {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
    });
    
    backToLoginButton.addEventListener('click', () => {
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    });
    
    // Auth listeners
    loginButton.addEventListener('click', handleLogin);
    registerButton.addEventListener('click', handleRegister);
    
    // Enter key for login
    loginUsername.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleLogin();
    });
    
    loginPassword.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleLogin();
    });
    
    // Enter key for register
    registerUsername.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleRegister();
    });
    
    registerPassword.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleRegister();
    });
    
    registerConfirmPassword.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleRegister();
    });
    
    // Task management listeners
    addTaskButton.addEventListener('click', () => {
        openTaskModal();
        closeMobileMenu();
    });
    
    mobileAddButton.addEventListener('click', () => openTaskModal());
    
    if (addTaskButtonMobile) {
        addTaskButtonMobile.addEventListener('click', () => {
            openTaskModal();
            closeMobileMenu();
        });
    }
    
    cancelTaskButton.addEventListener('click', closeTaskModal);
    closeModalButton.addEventListener('click', closeTaskModal);
    saveTaskButton.addEventListener('click', saveTask);
    
    // User management listeners
    logoutButton.addEventListener('click', handleLogout);
    userAvatar.addEventListener('click', toggleUserMenu);
    
    if (userAvatarMobile) {
        userAvatarMobile.addEventListener('click', toggleUserMenu);
    }
    
    // Filter button listeners
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            setActiveFilter(filter);
            if (window.innerWidth < 768) {
                closeMobileMenu();
            }
        });
    });
    
    // Priority selection
    document.querySelectorAll('.priority-option').forEach(btn => {
        btn.addEventListener('click', function() {
            const priority = this.getAttribute('data-priority');
            setPriority(priority);
        });
    });
    
    // Stopwatch listeners
    stopwatchStart.addEventListener('click', startStopwatch);
    stopwatchPause.addEventListener('click', pauseStopwatch);
    stopwatchReset.addEventListener('click', resetStopwatch);
    
    // Close modals when clicking outside
    taskModal.addEventListener('click', (e) => {
        if (e.target === taskModal) {
            closeTaskModal();
        }
    });
    
    // Close user menu when clicking outside
    document.addEventListener('click', (e) => {
        if (userMenu && !userMenu.contains(e.target) && 
            userAvatar && !userAvatar.contains(e.target) &&
            (!userAvatarMobile || !userAvatarMobile.contains(e.target))) {
            userMenu.classList.add('hidden');
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', handleResize);
    
    // Close mobile menu when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (mobileMenu && !mobileMenu.contains(e.target) && 
            mobileMenuToggle && !mobileMenuToggle.contains(e.target)) {
            closeMobileMenu();
        }
    });
}

// Handle window resize
function handleResize() {
    if (window.innerWidth >= 768 && mobileMenu && !mobileMenu.classList.contains('hidden')) {
        closeMobileMenu();
    }
    
    if (currentUser) {
        loadTasks();
    }
}

// Set priority
function setPriority(priority) {
    currentPriority = priority;
    
    document.querySelectorAll('.priority-option').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const activeBtn = document.querySelector(`[data-priority="${priority}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
}

// Handle user login
function handleLogin() {
    const username = loginUsername.value.trim();
    const password = loginPassword.value;
    
    if (!username || !password) {
        showAlert('Please enter both username and password', 'error');
        return;
    }
    
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        showAppScreen();
        showAlert(`Welcome back, ${username}!`, 'success');
        
        // Clear login form
        loginUsername.value = '';
        loginPassword.value = '';
    } else {
        showAlert('Invalid username or password', 'error');
    }
}

// Handle user registration
function handleRegister() {
    const username = registerUsername.value.trim();
    const password = registerPassword.value;
    const confirmPassword = registerConfirmPassword.value;
    
    if (!username || !password || !confirmPassword) {
        showAlert('Please fill in all fields', 'error');
        return;
    }
    
    if (username.length < 3) {
        showAlert('Username must be at least 3 characters', 'error');
        return;
    }
    
    if (password.length < 6) {
        showAlert('Password must be at least 6 characters', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showAlert('Passwords do not match', 'error');
        return;
    }
    
    if (users.find(u => u.username === username)) {
        showAlert('Username already exists', 'error');
        return;
    }
    
    const newUser = {
        id: Date.now().toString(),
        username: username,
        password: password,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    if (!tasks[username]) {
        tasks[username] = [];
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    // Switch back to login form and show success
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
    
    // Clear register form
    registerUsername.value = '';
    registerPassword.value = '';
    registerConfirmPassword.value = '';
    
    // Auto-fill login form
    loginUsername.value = username;
    loginPassword.value = password;
    
    showAlert(`Account created successfully! Welcome, ${username}!`, 'success');
}

// Handle user logout
function handleLogout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    if (userMenu) userMenu.classList.add('hidden');
    if (mobileMenu) closeMobileMenu();
    showLandingScreen();
    showAlert('Logged out successfully', 'info');
}

// Toggle user menu
function toggleUserMenu() {
    if (userMenu) {
        userMenu.classList.toggle('hidden');
    }
}

// Open task modal for adding or editing
function openTaskModal(taskId = null) {
    if (taskId) {
        modalTitle.textContent = 'Edit Task';
        const task = getTaskById(taskId);
        if (task) {
            taskTitle.value = task.title;
            taskDescription.value = task.description || '';
            taskDueDate.value = task.dueDate || '';
            setPriority(task.priority || 'medium');
            editingTaskId = taskId;
        }
    } else {
        modalTitle.textContent = 'Add New Task';
        taskTitle.value = '';
        taskDescription.value = '';
        taskDueDate.value = '';
        setPriority('medium');
        editingTaskId = null;
    }
    
    taskModal.classList.add('active');
    taskTitle.focus();
}

// Close task modal
function closeTaskModal() {
    taskModal.classList.remove('active');
}

// Save task (add or edit)
function saveTask() {
    const title = taskTitle.value.trim();
    const description = taskDescription.value.trim();
    const dueDate = taskDueDate.value;
    const priority = currentPriority;
    
    if (!title) {
        showAlert('Task title is required', 'error');
        taskTitle.focus();
        return;
    }
    
    if (!currentUser) {
        showAlert('You must be logged in to save tasks', 'error');
        return;
    }
    
    const userTasks = tasks[currentUser.username] || [];
    
    if (editingTaskId) {
        const taskIndex = userTasks.findIndex(t => t.id === editingTaskId);
        if (taskIndex !== -1) {
            userTasks[taskIndex] = {
                ...userTasks[taskIndex],
                title,
                description,
                dueDate,
                priority,
                updatedAt: new Date().toISOString()
            };
        }
    } else {
        const newTask = {
            id: Date.now().toString(),
            title,
            description,
            dueDate,
            priority,
            completed: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        userTasks.push(newTask);
    }
    
    tasks[currentUser.username] = userTasks;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    
    loadTasks();
    closeTaskModal();
    
    showAlert(editingTaskId ? 'Task updated successfully' : 'Task added successfully', 'success');
}

// Load and display tasks for current user
function loadTasks() {
    if (!currentUser) return;
    
    const userTasks = tasks[currentUser.username] || [];
    tasksContainer.innerHTML = '';
    
    let filteredTasks = userTasks;
    if (currentFilter === 'pending') {
        filteredTasks = userTasks.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = userTasks.filter(task => task.completed);
    } else if (currentFilter === 'high') {
        filteredTasks = userTasks.filter(task => task.priority === 'high');
    }
    
    filteredTasks.sort((a, b) => {
        if (a.completed !== b.completed) {
            return a.completed ? 1 : -1;
        }
        
        if (a.dueDate && b.dueDate) {
            return new Date(a.dueDate) - new Date(b.dueDate);
        } else if (a.dueDate) {
            return -1;
        } else if (b.dueDate) {
            return 1;
        }
        
        return new Date(b.createdAt) - new Date(a.createdAt);
    });
    
    if (filteredTasks.length === 0) {
        noTasksMessage.classList.remove('hidden');
    } else {
        noTasksMessage.classList.add('hidden');
        
        filteredTasks.forEach((task, index) => {
            const taskElement = createTaskElement(task);
            taskElement.style.animationDelay = `${index * 0.05}s`;
            tasksContainer.appendChild(taskElement);
        });
    }
    
    updateTaskStats(userTasks);
    
    const pendingCount = userTasks.filter(t => !t.completed).length;
    welcomeTaskCount.textContent = pendingCount;
    welcomeTaskCount.className = pendingCount > 5 ? 'font-bold text-red-500 dark:text-red-400' : 'font-bold text-gray-800 dark:text-white';
}

// Create HTML element for a task
function createTaskElement(task) {
    const taskEl = document.createElement('div');
    taskEl.className = 'task-item';
    taskEl.setAttribute('data-task-id', task.id);
    
    let dueDateText = '';
    let dueDateClass = 'text-gray-500 dark:text-gray-400';
    let dueDateIcon = 'fas fa-calendar';
    
    if (task.dueDate) {
        const dueDate = new Date(task.dueDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        dueDate.setHours(0, 0, 0, 0);
        
        if (dueDate < today && !task.completed) {
            dueDateText = 'Overdue';
            dueDateClass = 'text-red-500 dark:text-red-400 font-semibold';
            dueDateIcon = 'fas fa-exclamation-triangle';
        } else if (dueDate.getTime() === today.getTime()) {
            dueDateText = 'Today';
            dueDateClass = 'text-orange-500 dark:text-orange-400 font-semibold';
            dueDateIcon = 'fas fa-bolt';
        } else if (dueDate.getTime() === tomorrow.getTime()) {
            dueDateText = 'Tomorrow';
            dueDateClass = 'text-blue-500 dark:text-blue-400';
            dueDateIcon = 'fas fa-forward';
        } else {
            dueDateText = dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    }
    
    const priorityClass = `priority-${task.priority}`;
    const priorityText = task.priority.charAt(0).toUpperCase() + task.priority.slice(1);
    const priorityColors = {
        high: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
        medium: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300',
        low: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
    };
    
    taskEl.innerHTML = `
        <div class="checkbox ${task.completed ? 'checked' : ''} mr-3 md:mr-4" data-task-id="${task.id}">
            <i class="fas fa-check"></i>
        </div>
        <div class="flex-1 min-w-0">
            <div class="flex justify-between items-start mb-1 md:mb-2">
                <h3 class="font-bold text-sm md:text-lg ${task.completed ? 'line-through text-gray-500 dark:text-gray-500' : 'text-gray-800 dark:text-white'} truncate">${task.title}</h3>
                <div class="flex items-center ml-1 md:ml-2 flex-shrink-0">
                    ${dueDateText ? `
                        <div class="flex items-center ${dueDateClass} mr-2 md:mr-3">
                            <i class="${dueDateIcon} mr-1 md:mr-2 text-xs md:text-sm"></i>
                            <span class="text-xs md:text-sm font-medium">${dueDateText}</span>
                        </div>
                    ` : ''}
                    <span class="priority-indicator ${priorityClass}" title="${priorityText} Priority"></span>
                </div>
            </div>
            ${task.description ? `<p class="text-gray-600 dark:text-gray-300 text-xs md:text-sm mb-2 md:mb-3 line-clamp-2">${task.description}</p>` : ''}
            <div class="flex items-center text-xs flex-wrap gap-2 md:gap-3">
                <span class="px-2 py-1 md:px-3 md:py-1.5 rounded-full ${task.completed ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'} font-semibold">
                    <i class="fas ${task.completed ? 'fa-check-circle' : 'fa-clock'} mr-1 md:mr-1.5"></i>
                    ${task.completed ? 'Completed' : 'Pending'}
                </span>
                <span class="px-2 py-1 md:px-3 md:py-1.5 rounded-full ${priorityColors[task.priority]} font-semibold">
                    <i class="fas fa-flag mr-1 md:mr-1.5"></i> ${priorityText}
                </span>
                <span class="text-gray-600 dark:text-gray-400 hidden sm:inline">
                    <i class="fas fa-calendar mr-1 md:mr-1.5"></i> ${new Date(task.createdAt).toLocaleDateString()}
                </span>
            </div>
        </div>
        <div class="ml-2 md:ml-4 flex space-x-1 md:space-x-2">
            <button class="edit-task-btn w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300" data-task-id="${task.id}" title="Edit">
                <i class="fas fa-edit text-xs md:text-sm"></i>
            </button>
            <button class="delete-task-btn w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300" data-task-id="${task.id}" title="Delete">
                <i class="fas fa-trash-alt text-xs md:text-sm"></i>
            </button>
        </div>
    `;
    
    const checkbox = taskEl.querySelector('.checkbox');
    const editBtn = taskEl.querySelector('.edit-task-btn');
    const deleteBtn = taskEl.querySelector('.delete-task-btn');
    
    checkbox.addEventListener('click', () => toggleTaskCompletion(task.id));
    editBtn.addEventListener('click', () => editTask(task.id));
    deleteBtn.addEventListener('click', () => deleteTask(task.id));
    
    return taskEl;
}

// Toggle task completion status
function toggleTaskCompletion(taskId) {
    if (!currentUser) return;
    
    const userTasks = tasks[currentUser.username] || [];
    const taskIndex = userTasks.findIndex(t => t.id === taskId);
    
    if (taskIndex !== -1) {
        userTasks[taskIndex].completed = !userTasks[taskIndex].completed;
        userTasks[taskIndex].updatedAt = new Date().toISOString();
        
        tasks[currentUser.username] = userTasks;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        
        loadTasks();
        
        const task = userTasks[taskIndex];
        showAlert(`Task marked as ${task.completed ? 'completed' : 'pending'}`, 'info');
    }
}

// Edit task
function editTask(taskId) {
    openTaskModal(taskId);
}

// Delete task
function deleteTask(taskId) {
    if (!currentUser) return;
    
    if (!confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
        return;
    }
    
    const userTasks = tasks[currentUser.username] || [];
    const updatedTasks = userTasks.filter(t => t.id !== taskId);
    
    tasks[currentUser.username] = updatedTasks;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    
    loadTasks();
    showAlert('Task deleted successfully', 'success');
}

// Get task by ID
function getTaskById(taskId) {
    if (!currentUser) return null;
    
    const userTasks = tasks[currentUser.username] || [];
    return userTasks.find(t => t.id === taskId);
}

// Update task statistics
function updateTaskStats(userTasks) {
    const total = userTasks.length;
    const completed = userTasks.filter(t => t.completed).length;
    const pending = total - completed;
    
    totalTasksEl.textContent = total;
    completedTasksEl.textContent = completed;
    pendingTasksEl.textContent = pending;
    
    if (totalTasksMobileEl) totalTasksMobileEl.textContent = total;
    if (completedTasksMobileEl) completedTasksMobileEl.textContent = completed;
    if (pendingTasksMobileEl) pendingTasksMobileEl.textContent = pending;
}

// Set active filter
function setActiveFilter(filter) {
    currentFilter = filter;
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        const btnFilter = btn.getAttribute('data-filter');
        if (btnFilter === filter) {
            btn.classList.add('active');
            btn.classList.remove('bg-white', 'dark:bg-gray-800', 'text-gray-800', 'dark:text-gray-200');
            btn.classList.add('bg-gradient-to-r', 'from-blue-500', 'to-teal-400', 'text-white');
        } else {
            btn.classList.remove('active');
            btn.classList.remove('bg-gradient-to-r', 'from-blue-500', 'to-teal-400', 'text-white');
            btn.classList.add('bg-white', 'dark:bg-gray-800', 'text-gray-800', 'dark:text-gray-200');
        }
    });
    
    loadTasks();
}

// Show alert message
function showAlert(message, type = 'info') {
    const alertEl = document.createElement('div');
    
    let bgColor, icon;
    switch(type) {
        case 'error':
            bgColor = 'bg-gradient-to-r from-red-500 to-pink-500';
            icon = 'fas fa-exclamation-circle';
            break;
        case 'success':
            bgColor = 'bg-gradient-to-r from-green-500 to-teal-500';
            icon = 'fas fa-check-circle';
            break;
        case 'warning':
            bgColor = 'bg-gradient-to-r from-yellow-500 to-orange-500';
            icon = 'fas fa-exclamation-triangle';
            break;
        default:
            bgColor = 'bg-gradient-to-r from-blue-500 to-teal-400';
            icon = 'fas fa-info-circle';
    }
    
    alertEl.className = `${bgColor} text-white px-3 py-2 md:px-4 md:py-3 rounded-xl shadow-2xl transform transition-all duration-500 translate-x-full flex items-center text-sm`;
    alertEl.innerHTML = `
        <i class="${icon} mr-2 md:mr-3 text-base"></i>
        <span class="font-medium">${message}</span>
    `;
    
    alertContainer.appendChild(alertEl);
    
    setTimeout(() => {
        alertEl.classList.remove('translate-x-full');
    }, 10);
    
    setTimeout(() => {
        alertEl.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => {
            if (alertContainer.contains(alertEl)) {
                alertContainer.removeChild(alertEl);
            }
        }, 500);
    }, 4000);
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);