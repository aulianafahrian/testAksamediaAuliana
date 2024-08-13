// // Fungsi untuk menghapus IndexedDB
// function deleteDatabase() {
//     const dbName = "productDB";
//     const request = indexedDB.deleteDatabase(dbName);

//     request.onsuccess = function () {
//         console.log("Database deleted successfully");
//     };

//     request.onerror = function (event) {
//         console.error("Error deleting database:", event.target.errorCode);
//     };
// }

// Fungsi untuk logout
function logout() {
    // Hapus data pengguna dari localStorage
    localStorage.removeItem("username");
    localStorage.removeItem("currentPage");

    // Hapus database IndexedDB
    deleteDatabase();

    // Alihkan pengguna ke halaman login
    window.location.href = "/index.html";
}

// Tambahkan event listener pada tombol logout jika ada
document.getElementById("logoutButton")?.addEventListener("click", logout);
