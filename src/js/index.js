import '../sass/reset.sass';
import '../sass/index.sass';
import data from './MOCK_DATA.json';
// Assuming you have access to the `data` array and `customerTable` function

document.addEventListener('DOMContentLoaded', function () {
	function getVisiblePages(totalPages, currentPage) {
		const visiblePages = [];
		for (let page = 1; page <= totalPages; page++) {
			if (
				page === 1 ||
				page === totalPages ||
				(currentPage - 2 <= page && currentPage + 2 >= page)
			) {
				visiblePages.push(page);
			} else if (page === currentPage - 3 || page === currentPage + 3) {
				visiblePages.push('...');
			}
		}
		return visiblePages;
	}

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

	function updateTable(page) {
		const pageSize = 8; // припускаємо, що pageSize дорівнює 8
		const start = (page - 1) * pageSize;
		const end = page * pageSize;
		const paginatedData = data.slice(start, end);

		// Очищуємо поточну таблицю
		const tbody = document.querySelector('#customer-table tbody');
		tbody.innerHTML = '';

		// Додаємо нові рядки до таблиці
		paginatedData.forEach((item) => {
			const tr = document.createElement('tr');
			if (item.status) {
				tr.classList.add('active');
			}

			tr.innerHTML = `
        <td>${item.customer_name}</td>
        <td>${item.company}</td>
        <td>${item.phone_number.replace(
					/(\d{3})-(\d{3})-(\d{4})/,
					'($1)-$2-$3'
				)}</td>
				<td>${item.email}</td>
        <td>${item.country}</td>
        <td class="status">
          ${
						item.status
							? '<span class="status__active">Active</span>'
							: '<span class="status__inactive">Inactive</span>'
					}
        </td>
      `;
			tbody.appendChild(tr);
		});

		// Оновлюємо активний клас для пагінації
		const paginationLinks = document.querySelectorAll('.pagination__link');
		paginationLinks.forEach((link) => link.classList.remove('active'));
		const activeLink = document.querySelector(
			`.pagination-link[data-page="${page}"]`
		);
		if (activeLink) {
			activeLink.classList.add('active');
		}

		// Оновити посилання пагінації
		updatePaginationLinks(page);
	}

	function updatePaginationLinks(currentPage) {
		const totalPages = Math.ceil(data.length / 8);
		const paginationContainer = document.querySelector('nav.pagination');
		paginationContainer.innerHTML = '';

		if (currentPage >= 1) {
			const prevLink = document.createElement('a');
			prevLink.classList.add('pagination__link');
			prevLink.href = '#';
			prevLink.dataset.page = currentPage - 1;
			prevLink.innerHTML = '&lt;';
			paginationContainer.appendChild(prevLink);
		}

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

		if (currentPage < totalPages) {
			const nextLink = document.createElement('a');
			nextLink.classList.add('pagination__link');
			nextLink.href = '#';
			nextLink.dataset.page = currentPage + 1;
			nextLink.innerHTML = '&gt;';
			paginationContainer.appendChild(nextLink);
		}

		// Після оновлення посилань, встановлюємо обробники подій
		setupPaginationLinks();
	}

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
				sidebar.style.left = '0'; // Відкрити бічну панель на більших екранах
				menu.style.display = 'none'; // Приховати меню
			} else {
				sidebar.style.left = '-100%'; // Закрити бічну панель на менших екранах
				menu.style.display = 'block'; // Показати меню
			}
		});
	}

	// Запускаємо обробники подій
	handlerOpenMenu();
	updatePaginationLinks(1);
	setupPaginationLinks();
});
