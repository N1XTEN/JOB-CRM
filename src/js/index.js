import '../sass/reset.sass';
import '../sass/index.sass';
import data from './MOCK_DATA.json';

document.addEventListener('DOMContentLoaded', function () {

	// Функция для получения видимых страниц с учетом многоточий
	function getVisiblePages(totalPages, currentPage) {
		const delta = 2;
		const range = [];
		const rangeWithDots = [];
		let l;

		// Добавляем первую страницу
		range.push(1);
		// Добавляем диапазон страниц вокруг текущей страницы
		for (let i = currentPage - delta; i <= currentPage + delta; i++) {
			if (i < totalPages && i > 1) {
				range.push(i);
			}
		}
		// Добавляем последнюю страницу
		range.push(totalPages);

		// Добавляем страницы и многоточия в финальный массив
		range.forEach((page) => {
			if (l) {
				if (page - l === 2) {
					rangeWithDots.push(l + 1);
				} else if (page - l !== 1) {
					rangeWithDots.push('...');
				}
			}
			rangeWithDots.push(page);
			l = page;
		});

		return rangeWithDots;
	}

	// Функция для настройки событий на ссылки пагинации
	function setupPaginationLinks() {
		const paginationLinks = document.querySelectorAll('.pagination__link');

		paginationLinks.forEach((link) => {
			link.addEventListener('click', function (event) {
				event.preventDefault();
				const page = parseInt(this.dataset.page);
				if (page >= 1) {
					updateTable(page);
				}
			});
		});
	}

	// Функция для обновления таблицы на заданной странице
	function updateTable(page) {
		const pageSize = 8; // Количество элементов на странице
		const start = (page - 1) * pageSize;
		const end = page * pageSize;
		const paginatedData = data.slice(start, end);

		const tbody = document.querySelector('#customer-table tbody');
		tbody.innerHTML = '';

		// Заполнение таблицы данными
		paginatedData.forEach((item) => {
			const tr = document.createElement('tr');
			if (item.status) {
				tr.classList.add('active');
			}

			tr.innerHTML = `
        <td>${item.customer_name}</td>
        <td>${item.company}</td>
        <td>${item.phone_number.replace(/(\d{3})-(\d{3})-(\d{4})/, '($1)-$2-$3')}</td>
        <td>${item.email}</td>
        <td>${item.country}</td>
        <td class="status">
          ${item.status ? '<span class="status__active">Активный</span>' : '<span class="status__inactive">Неактивный</span>'}
        </td>
      `;
			tbody.appendChild(tr);
		});

		// Обновление активного класса для ссылок пагинации
		const paginationLinks = document.querySelectorAll('.pagination__link');
		paginationLinks.forEach((link) => link.classList.remove('active'));
		const activeLink = document.querySelector(`.pagination__link[data-page="${page}"]`);
		if (activeLink) {
			activeLink.classList.add('active');
		}

		updatePaginationLinks(page);
	}

	// Функция для обновления ссылок пагинации
	function updatePaginationLinks(currentPage) {
		const totalPages = Math.ceil(data.length / 8);
		const paginationContainer = document.querySelector('nav.pagination');
		paginationContainer.innerHTML = '';

		// Добавление ссылки на предыдущую страницу
		if (currentPage > 1) {
			const prevLink = document.createElement('a');
			prevLink.classList.add('pagination__link');
			prevLink.href = '#';
			prevLink.dataset.page = currentPage - 1;
			prevLink.innerHTML = '&lt;';
			paginationContainer.appendChild(prevLink);
		}

		// Добавление видимых страниц и многоточий
		getVisiblePages(totalPages, currentPage).forEach((page) => {
			if (page !== '...') {
				const pageLink = document.createElement('a');
				pageLink.classList.add('pagination__link');
				pageLink.href = '#';
				pageLink.dataset.page = page;
				pageLink.textContent = page;
				if (currentPage === page) {
					pageLink.classList.add('active');
				}
				paginationContainer.appendChild(pageLink);
			} else {
				const span = document.createElement('span');
				span.textContent = '...';
				paginationContainer.appendChild(span);
			}
		});

		// Добавление ссылки на следующую страницу
		if (currentPage < totalPages) {
			const nextLink = document.createElement('a');
			nextLink.classList.add('pagination__link');
			nextLink.href = '#';
			nextLink.dataset.page = currentPage + 1;
			nextLink.innerHTML = '&gt;';
			paginationContainer.appendChild(nextLink);
		}

		setupPaginationLinks();
	}

	// Функция для обработки открытия меню
	function handlerOpenMenu() {
		const menu = document.getElementById('menu');
		const sidebar = document.querySelector('.sidebar');

		menu.addEventListener('click', function ({ target }) {
			sidebar.style.left = 0;
		});

		document.addEventListener('click', function ({ target }) {
			if (target.id === 'menu') return;
			if (window.innerWidth < 1200) {
				sidebar.style.left = '-100%';
			}
		});

		window.addEventListener('resize', () => {
			if (window.innerWidth > 1200) {
				sidebar.style.left = '0'; 
				menu.style.display = 'none'; 
			} else {
				sidebar.style.left = '-100%'; 
				menu.style.display = 'block'; 
			}
		});
	}

	// Инициализация функций при загрузке страницы
	handlerOpenMenu();
	updatePaginationLinks(1);
	updateTable(1);
	setupPaginationLinks();
});
