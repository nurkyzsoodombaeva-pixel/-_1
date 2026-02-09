//1 

const regExp = /^\d+$/;

const containsOnlyDigits = (str) => {
	return regExp.test(String(str));
}

console.log(containsOnlyDigits("12345")); // true
console.log(containsOnlyDigits("12a45")); // false
window.addEventListener('load', () => {
	const inputEl = document.querySelector('#input');
	const btn = document.querySelector('#checkBtn');
	const output = document.querySelector('#output');

	if (btn && inputEl && output) {
		btn.addEventListener('click', () => {
			const value = inputEl.value;
			const result = containsOnlyDigits(value);
			output.textContent = result ? 'Да' : 'Нет';
		});
	}
});

//2

let secondTimerId = null;

const startSecondTimer = () => {
	if (secondTimerId !== null) return; 
	secondTimerId = setInterval(() => {
		console.log('Прошла секунда');
	}, 1000);
}

const stopSecondTimer = () => {
	if (secondTimerId === null) return;
	clearInterval(secondTimerId);
	secondTimerId = null;
}
setTimeout(() => {
    startSecondTimer(); 
}, 1000);

//3
const count = () => {
    let i = 1;
    const interval = setInterval(() => {
        console.log(i++);
        if (i > 10) {
            clearInterval(interval);
        }
    }, 1000);
}
count();

//4

const start = document.querySelector('#start');
const stop = document.querySelector('#stop');
const reset = document.querySelector('#reset'); 
let countdownId = null;
let qwerty1 = 0;
const secondsEl = document.querySelector('#seconds');
const startValueInput = document.querySelector('#startValue');

const getStartValue = () => {
	const v = Number(startValueInput?.value);
	return Number.isFinite(v) && v >= 0 ? Math.floor(v) : 10;
}

const updateDisplay = () => {
	if (secondsEl) secondsEl.textContent = String(qwerty1);
}

const startCountdown = () => {
	if (countdownId !== null) return; 
	if (qwerty1 <= 0) qwerty1 = getStartValue();
	updateDisplay();
	countdownId = setInterval(() => {
		qwerty1--;
		updateDisplay();
		if (qwerty1 <= 0) {
			clearInterval(countdownId);
			countdownId = null;
			console.log('Таймер достиг нуля');
		}
	}, 1000);
}

const stopCountdown = () => {
	if (countdownId !== null) {
		clearInterval(countdownId);
		countdownId = null;
	}
}

const resetCountdown = () => {
	stopCountdown();
	qwerty1 = getStartValue();
	updateDisplay();
}
if (start) start.addEventListener('click', startCountdown);
if (stop) stop.addEventListener('click', stopCountdown);
if (reset) reset.addEventListener('click', resetCountdown);

qwerty1 = getStartValue();
updateDisplay();

//5

const qwerty2 = document.querySelector('.qwerty');

// Обработчик клика: переключаем фон через classList
if (qwerty2) {
	qwerty2.addEventListener('click', () => {
		if (qwerty2.classList.contains('colored')) {
			qwerty2.classList.remove('colored');
		} else {
			qwerty2.classList.add('colored');
		}
	});
}

// 6

(() => {
	const zxcv = new XMLHttpRequest();
	zxcv.open('GET', 'data.json', true);
	zxcv.onreadystatechange = function () {
		if (zxcv.readyState === 4) {
			if (zxcv.status >= 200 && zxcv.status < 300) {
				try {
					const data = JSON.parse(zxcv.responseText);
					console.log('Полученные данные джейсон:', data);
				} catch (err) {
					console.error('Ошибка парсинга JSON:', err);
				}
			} else {
				console.error('XHR ошибка. Статус:', zxcv.status);
			}
		}
	};
	zxcv.send();
})();


//7

(() => {
	// Попытаемся загрузить users.json, иначе используем встроенный массив
	const defaultUsers = [
		{ login: 'admin', role: 'Администратор', email: 'admin@gmail.com', image: '' },
		{ login: 'user', role: 'Пользователь', email: 'user@gmail.com', image: '' }
	];

	const loadUsers = (callback) => {
		const xhr = new XMLHttpRequest();
		xhr.open('GET', 'users.json', true);
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4) {
				if (xhr.status >= 200 && xhr.status < 300) {
					try {
						const data = JSON.parse(xhr.responseText);
						if (Array.isArray(data)) callback(data);
						else callback(defaultUsers);
					} catch (e) {
						console.warn('Не удалось распарсить users.json, используем дефолт', e);
						callback(defaultUsers);
					}
				} else {
					// файл не найден или ошибка — используем дефолт
					callback(defaultUsers);
				}
			}
		};
		xhr.send();
	};

	const renderUserCard = (user, container) => {
		if (!container) return;
		container.innerHTML = '';
		const card = document.createElement('div');
		card.className = 'user-card';
		const img = document.createElement('div');
		img.className = 'user-img';
		if (user.image) {
			const i = document.createElement('img');
			i.src = user.image;
			i.alt = user.login;
			i.style.maxWidth = '100%';
			img.appendChild(i);
		} else {
			img.textContent = user.login[0]?.toUpperCase() ?? '';
			img.style.display = 'flex';
			img.style.alignItems = 'center';
			img.style.justifyContent = 'center';
			img.style.fontSize = '32px';
			img.style.background = '#ddd';
			img.style.width = '80px';
			img.style.height = '80px';
			img.style.borderRadius = '8px';
		}

		const info = document.createElement('div');
		info.className = 'user-info';
		info.innerHTML = `<div><strong>Логин:</strong> ${user.login}</div>` +
			`<div><strong>Роль:</strong> ${user.role}</div>` +
			`<div><strong>Email:</strong> ${user.email}</div>`;

		card.style.display = 'flex';
		card.style.gap = '12px';
		card.style.alignItems = 'center';
		card.appendChild(img);
		card.appendChild(info);
		container.appendChild(card);
	};


	const loginInput = document.getElementById('loginInput');
	let loginBtn = document.getElementById('checkLoginBtn');
	if (!loginBtn) loginBtn = document.getElementById('checkBtn');
	const userCard = document.getElementById('userCard');
	const messageEl = document.getElementById('message');

	if (!loginInput || !loginBtn || !userCard || !messageEl) return; 

	loadUsers((users) => {
		loginBtn.addEventListener('click', () => {
			const query = loginInput.value.trim();
			if (!query) {
				messageEl.textContent = 'Введите логин для поиска';
				userCard.innerHTML = '';
				return;
			}
			const found = users.find(u => String(u.login) === query);
			if (found) {
				messageEl.textContent = '';
				renderUserCard(found, userCard);
			} else {
				userCard.innerHTML = '';
				messageEl.textContent = 'Пользователь не найден';
			}
		});
	});

})();







