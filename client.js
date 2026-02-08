async function auth(route) {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    const res = await fetch(`http://localhost:3000/${route}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, pass })
    });
    const data = await res.text();
    alert(data);
}

async function search() {
    const word = document.getElementById('keyword').value;
    const res = await fetch('http://localhost:3000/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word })
    });
    const users = await res.json();
    const list = document.getElementById('results');
    list.innerHTML = users.map(u => `<li>${u.username}</li>`).join('');
}