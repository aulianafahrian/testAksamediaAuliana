document.addEventListener("DOMContentLoaded", function() {
    // Cek status autentikasi
    const isAuthenticated = localStorage.getItem("isAuthenticated");

    if (isAuthenticated !== "true") {
        // Jika tidak terautentikasi, arahkan ke halaman login
        window.location.href = "/index.html";
    } else {
        // Ambil nama pengguna dan tampilkan di navbar
        const username = localStorage.getItem("username");
        document.getElementById("usernameDisplay").textContent = username || "Nama Pengguna";
    }
});
