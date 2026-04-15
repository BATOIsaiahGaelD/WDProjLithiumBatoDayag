document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('currentUser'));

    
    document.getElementById('displayUsername').textContent = user.username;
    document.getElementById('displayEmail').textContent = user.email;
 
    document.getElementById('viewJersey').textContent = user.jersey || "--";
    document.getElementById('viewPosition').textContent = user.position || "Not Set";

    document.getElementById('statReaction').textContent = user.bestReaction ? `${user.bestReaction} ms` : "-- ms";
    document.getElementById('statLoot').textContent = user.bestLootName ? `${user.bestLootName} (${user.bestLootRarity})` : "None";
    document.getElementById('statQA').textContent = user.bestQA ? `${user.bestQA.score} / ${user.bestQA.total}` : "0 / 0";

    const avatarImg = document.getElementById('avatarImg');
    const dropArea = document.getElementById('dropArea');
    const avatarInput = document.getElementById('avatarInput');
    const uploadBtn = document.getElementById('uploadBtn');
    const dragText = document.getElementById('dragText') 

    if (user.avatar) {
        avatarImg.src = user.avatar;
    }

    const editBtn = document.getElementById('editBtn');
    const saveBtn = document.getElementById('saveBtn');
    const viewModes = document.querySelectorAll('.view-mode');
    const editModes = document.querySelectorAll('.edit-mode');
    
    if (editBtn && saveBtn) {
        editBtn.onclick = () => {
            editBtn.style.display = 'none';
            saveBtn.style.display = 'inline-block';

            if (uploadBtn) uploadBtn.style.display = 'block';

            viewModes.forEach(el => el.style.display = 'none');
            editModes.forEach(el => el.style.display = 'block');
            
            document.getElementById('editJersey').value = user.jersey || "";
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
    }
    if (uploadBtn) {
        uploadBtn.addEventListener('click', (e) => {
            e.stopPropagation(); 
            avatarInput.click();
        });
    }
     function handleFile(file) {
        if (!file || !file.type.startsWith("image/")) return;

        const reader = new FileReader();

        reader.onload = function (e) {
            avatarImg.src = e.target.result;
            user.avatar = e.target.result;
        };

        reader.readAsDataURL(file);
    }

     if (dropArea) {
        dropArea.addEventListener('click', () => {
            if (saveBtn.style.display === 'inline-block') {
                avatarInput.click();
            }
        });
    }

    if (avatarInput) {
        avatarInput.addEventListener('change', function () {
            handleFile(this.files[0]);
        });
    }

       if (dropArea) {
        dropArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropArea.classList.add('dragover');
        });

        dropArea.addEventListener('dragleave', () => {
            dropArea.classList.remove('dragover');
        });

        dropArea.addEventListener('drop', (e) => {
            e.preventDefault();
            dropArea.classList.remove('dragover');

            if (saveBtn.style.display === 'inline-block') {
                const file = e.dataTransfer.files[0];
                handleFile(file);
            }
        });
    }

    const enlargeBtn = document.getElementById('enlargeBtn');
    const pfpModal = document.getElementById('pfpModal');
    const enlargedImg = document.getElementById('enlargedImg');


    if (enlargeBtn) {
        enlargeBtn.onclick = () => {
        
        enlargedImg.src = document.getElementById('avatarImg').src;
        pfpModal.style.display = 'flex';
        };
    }


    pfpModal.onclick = () => {
        pfpModal.style.display = 'none';
    };


    const originalEditBtnClick = editBtn.onclick;
    editBtn.onclick = () => {
        originalEditBtnClick(); 
        enlargeBtn.style.display = 'none'; 
    };

    const originalSaveBtnClick = saveBtn.onclick;
    saveBtn.onclick = () => {
        originalSaveBtnClick(); 
    };

    const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.onclick = (e) => {
                e.preventDefault();
                localStorage.removeItem('currentUser');
                window.location.href = "login.html";
            };
        }
    });

    const clearDataBtn = document.getElementById('clearDataBtn');

        if (clearDataBtn) {
            clearDataBtn.onclick = () => {
            const confirmClear = confirm("Are you sure you want to delete ALL data?");
        
            if (confirmClear) {
                localStorage.clear();
                alert("All data cleared.");
                window.location.href = "login.html";
            }
        };
    }
