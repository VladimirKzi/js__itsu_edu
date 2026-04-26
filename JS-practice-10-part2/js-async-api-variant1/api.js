const BASE_URL = 'https://api.github.com';

export async function fetchGitHubUser(username) {
    const response = await fetch(`${BASE_URL}/users/${username}`);
    if (!response.ok) {
        if (response.status === 404) throw new Error('Користувача не знайдено');
        if (response.status === 403) throw new Error('Ліміт запитів вичерпано (60/год)');
        throw new Error('Помилка сервера');
    }
    return await response.json();
}

export async function fetchUserRepos(username) {
    const response = await fetch(`${BASE_URL}/users/${username}/repos?per_page=100`);
    if (!response.ok) throw new Error('Не вдалося завантажити репозиторії');
    return await response.json();
}

export async function fetchRepoDetails(owner, repo) {
    const [langRes, contRes, readmeRes] = await Promise.all([
        fetch(`${BASE_URL}/repos/${owner}/${repo}/languages`),
        fetch(`${BASE_URL}/repos/${owner}/${repo}/contributors?per_page=5`)
    ]);
    
    return {
        languages: await langRes.json(),
        contributors: await contRes.json()
    };
}

export async function fetchRepoReadme(owner, repo) { ///repos/{owner}/{repo}/readme
    const response = await fetch(`${BASE_URL}/repos/${owner}/${repo}/readme`, {
        headers: {
            'Accept': 'application/vnd.github.v3.raw' // Отримуємо чистий текст замість JSON
        }
    });

    if (!response.ok) {
        if (response.status === 404) return "README файл не знайдено для цього репозиторію.";
        throw new Error('Не вдалося завантажити README');
    }

    return await response.text();
}