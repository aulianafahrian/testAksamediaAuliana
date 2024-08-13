document.addEventListener("DOMContentLoaded", function () {
    // Fungsi untuk menampilkan atau menyembunyikan password
    const showpw = document.getElementById('showpw');
    const password = document.getElementById('password');

    showpw.addEventListener('click', () => {
        if (password.type === 'password') {
            password.type = 'text';
            showpw.textContent = 'Hide'; // Update button text to 'Hide'
        } else {
            password.type = 'password';
            showpw.textContent = 'Show'; // Update button text to 'Show'
        }
    });

    // Fungsi untuk login
    function login() {
        const usernameInput = document.getElementById("username").value;
        const passwordInput = document.getElementById("password").value;

        // Contoh sederhana untuk validasi username dan password
        const validUsername = "aufa";
        const validPassword = "123";

        if (usernameInput === validUsername && passwordInput === validPassword) {
            // Simpan status autentikasi ke localStorage
            localStorage.setItem("isAuthenticated", "true");
            localStorage.setItem("username", usernameInput);

            // Alert berhasil login
            alert("Login berhasil");
            // Redirect ke halaman utama
            window.location.href = "../pages/dashboard.html";
        } else {
            alert("Username atau password salah");
        }
    }

    // Event listener untuk tombol login
    document.getElementById("loginButton").addEventListener("click", login);

    // Cek apakah pengguna sudah login
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated === "true") {
        window.location.href = "../pages/dashboard.html"; // Jika sudah login, arahkan ke halaman utama
    }
});
