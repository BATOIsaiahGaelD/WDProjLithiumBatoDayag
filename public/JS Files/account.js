document.addEventListener('DOMContentLoaded', () => {
    
    
    const signupForm = document.getElementById('signupForm');
    
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const username = document.getElementById('username').value.trim();
            const email = document.getElementById('email').value.trim();
            const jersey = document.getElementById('jersey').value.trim();
            const password = document.getElementById('password').value.trim();

            
            const existingUsers = JSON.parse(localStorage.getItem('frisbeeUsers')) || [];
            
            const userExists = existingUsers.some(user => user.username === username || user.email === email);

            if (userExists) {
                alert('Username or Email already taken');
                return;
            }

            
            const newUser = {
                username: username,
                email: email,
                jersey: jersey,
                password: password 
            };

          
            existingUsers.push(newUser);
            localStorage.setItem('frisbeeUsers', JSON.stringify(existingUsers));

            alert('Account created successfully, Redirecting to login...');
            window.location.href = './login.html';
        });
    }

   
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const identifier = document.getElementById('loginIdentifier').value.trim(); 
            const password = document.getElementById('loginPassword').value.trim();

            const users = JSON.parse(localStorage.getItem('frisbeeUsers')) || [];

           
            const validUser = users.find(user => 
                (user.username === identifier || user.email === identifier) && user.password === password
            );

            if (validUser) {
                
                localStorage.setItem('currentUser', JSON.stringify(validUser));
                
                alert(`Welcome back, ${validUser.username}! Your jersey number is ${validUser.jersey}.`);
                window.location.href = './profile.html'; 
            } else {
                alert('Invalid credentials. Please try again.');
            }
        });
    }

    const logoutBtn = document.getElementById('logoutBtn');

    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault(); 
            
            localStorage.removeItem('currentUser');
            
            alert('You have logged out.');
            
            window.location.href = './index.html'; 
        })
    };
    
});