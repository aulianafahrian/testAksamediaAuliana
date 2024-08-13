// Fungsi untuk menghapus IndexedDB
function deleteDatabase(callback) {
    const dbName = "productDB";
    const request = indexedDB.deleteDatabase(dbName);

    request.onsuccess = function () {
        console.log("Database deleted successfully");
        if (callback) callback(); // Panggil callback setelah sukses
    };

    request.onerror = function (event) {
        console.error("Error deleting database:", event.target.errorCode);
        if (callback) callback(); // Panggil callback meski terjadi error
    };

    request.onblocked = function () {
        console.warn("Database deletion blocked");
        if (callback) callback(); // Panggil callback jika penghapusan diblokir
    };
}

// Fungsi untuk logout
function logout() {
    // Hapus data pengguna dari localStorage
    localStorage.removeItem("username");
    localStorage.removeItem("currentPage");

    // Hapus database IndexedDB dan alihkan pengguna setelah selesai
    deleteDatabase(() => {
        window.location.href = "/index.html";
    });
}

// Tambahkan event listener pada tombol logout jika ada
document.getElementById("logoutButton")?.addEventListener("click", logout);
