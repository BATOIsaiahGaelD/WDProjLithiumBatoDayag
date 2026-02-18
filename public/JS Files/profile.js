document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('currentUser'));

    if (!user) {
        alert("Please log in first!");
        window.location.href = "login.html";
        return;
    }

    document.getElementById('displayUsername').textContent = user.username;
    document.getElementById('displayEmail').textContent = user.email;
    document.getElementById('viewJersey').textContent = user.jersey || "--";
    document.getElementById('viewPosition').textContent = user.position || "Not Set";

    
    document.getElementById('statReaction').textContent = user.bestReaction ? `${user.bestReaction} ms` : "-- ms";
    document.getElementById('statLoot').textContent = user.bestLootName ? `${user.bestLootName} (${user.bestLootRarity})` : "None";
    document.getElementById('statQA').textContent = user.bestQA ? `${user.bestQA.score} / ${user.bestQA.total}` : "0 / 0";

    const editBtn = document.getElementById('editBtn');
    const saveBtn = document.getElementById('saveBtn');
    const viewModes = document.querySelectorAll('.view-mode');
    const editModes = document.querySelectorAll('.edit-mode');

    editBtn.onclick = () => {
        editBtn.style.display = 'none';
        saveBtn.style.display = 'inline-block';
        viewModes.forEach(el => el.style.display = 'none');
        editModes.forEach(el => el.style.display = 'block');
        
        document.getElementById('editJersey').value = user.jersey;
        document.getElementById('editPosition').value = user.position || "Not Set";
    };

    saveBtn.onclick = () => {
        user.jersey = document.getElementById('editJersey').value;
        user.position = document.getElementById('editPosition').value;

        localStorage.setItem('currentUser', JSON.stringify(user));

        let users = JSON.parse(localStorage.getItem('frisbeeUsers')) || [];
        const index = users.findIndex(u => u.username === user.username);
        if (index !== -1) {
            users[index] = user;
            localStorage.setItem('frisbeeUsers', JSON.stringify(users));
        }

        location.reload(); 
    };

    document.getElementById('logoutBtn').onclick = () => {
        localStorage.removeItem('currentUser');
        window.location.href = "login.html";
    };
});