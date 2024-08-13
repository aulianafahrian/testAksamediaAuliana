document.addEventListener("DOMContentLoaded", function () {
    const username = localStorage.getItem("username");
    const profileName = document.getElementById("profileName");
    const usernameInput = document.getElementById("username");

    // Set profile name and input field if they exist
    if (profileName) {
        profileName.textContent = username ? username : "Nama Pengguna";
    }

    if (usernameInput) {
        usernameInput.value = username ? username : "";
    }

    

    // Initialize IndexedDB
    let db;
    const request = indexedDB.open("productDB", 1);

    request.onerror = function (event) {
        console.error("Database error: ", event.target.errorCode);
    };

    request.onsuccess = function (event) {
        db = event.target.result;
        loadProducts();
    };

    request.onupgradeneeded = function (event) {
        db = event.target.result;
        const objectStore = db.createObjectStore("products", { keyPath: "id", autoIncrement: true });

        objectStore.createIndex("name", "name", { unique: false });
        objectStore.createIndex("price", "price", { unique: false });

        console.log("Database setup complete");
    };

    // Load products from IndexedDB and display them
    function loadProducts() {
        const transaction = db.transaction(["products"], "readonly");
        const objectStore = transaction.objectStore("products");
        const productList = document.getElementById("productList");
        productList.innerHTML = "";

        objectStore.openCursor().onsuccess = function (event) {
            const cursor = event.target.result;
            if (cursor) {
                const product = cursor.value;
                productList.innerHTML += `
                    <tr>
                        <td class="px-6 py-4 whitespace-nowrap">${product.name}</td>
                        <td class="px-6 py-4 whitespace-nowrap">Rp${product.price.toLocaleString()}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-right">
                            <button onclick="showEditProductForm(${product.id})" class="text-indigo-600 dark:text-indigo-400 hover:underline">Edit</button>
                            <button onclick="deleteProduct(${product.id})" class="text-red-600 dark:text-red-400 hover:underline">Hapus</button>
                        </td>
                    </tr>`;
                cursor.continue();
            }
        };
    }

    // Show form to add new product
    window.showAddProductForm = function () {
        const name = prompt("Masukkan nama produk:");
        const price = prompt("Masukkan harga produk:");

        if (name && price) {
            const transaction = db.transaction(["products"], "readwrite");
            const objectStore = transaction.objectStore("products");
            const newProduct = { name: name, price: parseFloat(price) };
            objectStore.add(newProduct);
            transaction.oncomplete = function () {
                loadProducts();
                alert("Produk berhasil ditambahkan!");
            };
        } else {
            alert("Nama produk dan harga tidak boleh kosong!");
        }
    };

    // Show form to edit existing product
    window.showEditProductForm = function (id) {
        const transaction = db.transaction(["products"], "readonly");
        const objectStore = transaction.objectStore("products");
        const request = objectStore.get(id);

        request.onsuccess = function (event) {
            const product = event.target.result;
            const newName = prompt("Edit nama produk:", product.name);
            const newPrice = prompt("Edit harga produk:", product.price);

            if (newName && newPrice) {
                product.name = newName;
                product.price = parseFloat(newPrice);

                const updateTransaction = db.transaction(["products"], "readwrite");
                const updateObjectStore = updateTransaction.objectStore("products");
                updateObjectStore.put(product);

                updateTransaction.oncomplete = function () {
                    loadProducts();
                    alert("Produk berhasil diperbarui!");
                };
            } else {
                alert("Nama produk dan harga tidak boleh kosong!");
            }
        };
    };

    // Delete a product
    window.deleteProduct = function (id) {
        if (confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
            const transaction = db.transaction(["products"], "readwrite");
            const objectStore = transaction.objectStore("products");
            objectStore.delete(id);

            transaction.oncomplete = function () {
                loadProducts();
                alert("Produk berhasil dihapus!");
            };
        }
    };
});
