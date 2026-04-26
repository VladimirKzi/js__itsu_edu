import * as api from './api.js';

const searchBtn = document.getElementById('searchBtn');
const usernameInput = document.getElementById('usernameInput');
const profileEl = document.getElementById('profile');
const reposEl = document.getElementById('reposList');
const modal = document.getElementById('modal');
const reposD = document.getElementById('reposDetails');
const loader = document.getElementById('loader');
const errorEl = document.getElementById('errorMessage');

searchBtn.onclick = handleSearch;

async function handleSearch() {
    const username = usernameInput.value.trim();
    if (!username) return;

    // Скидання стану
    profileEl.innerHTML = '';
    reposEl.innerHTML = '';
	reposD.innerHTML = '';
    errorEl.textContent = '';
    loader.style.display = 'block';

    try {
        // ПАРАЛЕЛЬНЕ ЗАВАНТАЖЕННЯ (Технічна вимога)
        const [user, repos] = await Promise.all([
            api.fetchGitHubUser(username),
            api.fetchUserRepos(username)
        ]);

        renderProfile(user);
        renderRepos(repos);
    } catch (err) {
        errorEl.textContent = `${err.message}`;
    } finally {
        loader.style.display = 'none';
    }
}

function renderProfile(user) {
    profileEl.innerHTML = `
        <div class="profile-card">
            <img src="${user.avatar_url}" alt="Avatar">
            <h2>${user.name || user.login}</h2>
            <p>${user.bio || 'Bio відсутнє'}</p>
            <div class="stats">
                <span>Repos: ${user.public_repos}</span>
                <span>Followers: ${user.followers}</span>
            </div>
        </div>
    `;
}

function renderRepos(repos) {
    // Сортування за зірками (Технічна вимога)
    const sorted = repos.sort((a, b) => b.stargazers_count - a.stargazers_count);
    
    reposEl.innerHTML = '<h3>Популярні репозиторії:</h3>' + sorted.slice(0, 10).map(repo => `
        <div class="repo-item" onclick="showDetails('${repo.owner.login}', '${repo.name}')">
            <strong>${repo.name}</strong>
            <span>⭐ ${repo.stargazers_count}</span>
        </div>
    `).join('');
}

// Функція для деталей (README/Мови)
window.showDetails = async (owner, repoName) => {
	console.log(`Завантаження деталей для ${repoName}...`);
	modal.classList.remove('hidden');
    try {
        const [details, readme] = await Promise.all([
            api.fetchRepoDetails(owner, repoName),
            api.fetchRepoReadme(owner, repoName)
        ]);
		const langs = Object.keys(details.languages).join(', ') || 'Не вказано';
        const contributors = details.contributors.map(c => c.login).join(', ');
		const readm = readme.substring(0, 1000) + (readme.length > 1000 ? '...' : '');
		
		
		reposD.innerHTML = `<h2>Репозиторій: ${repoName}</h2>
		<p><b>Мови:</b> ${langs}</p>
		<p><b>Топ контріб'юторів(${details.contributors.length}):</b> ${contributors}</p>
		<hr>
		<h3>README.md (фрагмент):</h3>
		<pre class="readme">${readm}</pre>`;
    } catch (err) {
        reposD.innerHTML = '<p>Помилка завантаження деталей</p>';
    }
};

document.getElementById('closeModal').onclick = () => { modal.classList.add('hidden'); reposD.innerHTML = ''; }