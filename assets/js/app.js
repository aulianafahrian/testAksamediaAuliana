document.addEventListener("DOMContentLoaded", function () {
    const username = localStorage.getItem("username");
    const profileName = document.getElementById("profileName");
    const usernameInput = document.getElementById("username");
    const searchInput = document.getElementById("search-input");

    // Set profile name and input field if they exist
    if (profileName) {
        profileName.textContent = username ? username : "Nama Pengguna";
    }

    if (usernameInput) {
        usernameInput.value = username ? username : "";
    }

    // Initialize IndexedDB
    const dbName = "productDB";
    const storeName = "products";
    let db;
    let currentPage = 1;
    const itemsPerPage = 5;

    // Initialize IndexedDB
    const request = indexedDB.open(dbName, 1);

    request.onerror = function (event) {
        console.error("Database error: ", event.target.errorCode);
    };

    request.onsuccess = function (event) {
        db = event.target.result;
        loadProducts(currentPage);
    };

    request.onupgradeneeded = function (event) {
        const db = event.target.result;
        const objectStore = db.createObjectStore(storeName, { keyPath: "id", autoIncrement: true });

        objectStore.createIndex("name", "name", { unique: false });
        objectStore.createIndex("price", "price", { unique: false });

        console.log("Database setup complete");
    };

    // Load products from IndexedDB and display them
    function loadProducts(page, searchTerm = '') {
        const transaction = db.transaction([storeName], "readonly");
        const objectStore = transaction.objectStore(storeName);
        const productList = document.getElementById("productList");
        const pagination = document.getElementById("pagination");
        productList.innerHTML = "";

        const countRequest = objectStore.count();

        countRequest.onsuccess = function () {
            const totalItems = countRequest.result;
            const totalPages = Math.ceil(totalItems / itemsPerPage);

            const start = (page - 1) * itemsPerPage;
            const end = page * itemsPerPage;

            const cursorRequest = objectStore.openCursor();
            let index = 0;

            cursorRequest.onsuccess = function (event) {
                const cursor = event.target.result;
                if (cursor && index < end) {
                    if (index >= start) {
                        const product = cursor.value;
                        if (product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                            productList.innerHTML += `
                                <tr>
                                    <td class="px-6 py-4 whitespace-nowrap">${product.name}</td>
                                    <td class="px-6 py-4 whitespace-nowrap">Rp${product.price.toLocaleString()}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-center">
                                        <button onclick="showEditProductForm(${product.id})" class="text-indigo-600 dark:text-indigo-400 hover:underline">Edit</button>
                                        <button onclick="deleteProduct(${product.id})" class="text-red-600 dark:text-red-400 hover:underline">Hapus</button>
                                    </td>
                                </tr>`;
                        }
                    }
                    index++;
                    cursor.continue();
                } else {
                    // Render pagination controls
                    pagination.innerHTML = '';
                    if (totalPages > 1) {
                        const prevButton = document.createElement('button');
                        prevButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>`;
                        prevButton.disabled = page === 1;
                        prevButton.className = `px-4 py-2 rounded ${page === 1 ? 'bg-gray-300' : 'bg-gray-500 text-white'} hover:bg-gray-600`;
                        prevButton.addEventListener('click', () => {
                            if (page > 1) {
                                loadProducts(page - 1, searchInput.value);
                            }
                        });
                        pagination.appendChild(prevButton);

                        for (let i = 1; i <= totalPages; i++) {
                            const button = document.createElement('button');
                            button.textContent = i;
                            button.className = `px-4 py-2 rounded ${i === page ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'} hover:bg-blue-600`;
                            button.addEventListener('click', () => {
                                loadProducts(i, searchInput.value);
                            });
                            pagination.appendChild(button);
                        }

                        const nextButton = document.createElement('button');
                        nextButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>`;
                        nextButton.disabled = page === totalPages;
                        nextButton.className = `px-4 py-2 rounded ${page === totalPages ? 'bg-gray-300' : 'bg-gray-500 text-white'} hover:bg-gray-600`;
                        nextButton.addEventListener('click', () => {
                            if (page < totalPages) {
                                loadProducts(page + 1, searchInput.value);
                            }
                        });
                        pagination.appendChild(nextButton);
                    }
                }
            };

            cursorRequest.onerror = function (event) {
                console.error("Cursor error:", event.target.errorCode);
            };

            transaction.onerror = function (event) {
                console.error("Transaction error:", event.target.errorCode);
            };
        };
    }

    // Handle search input change
    searchInput.addEventListener("input", function () {
        loadProducts(currentPage, searchInput.value);
    });

    // Show form to add new product
    window.showAddProductForm = function () {
        const name = prompt("Masukkan nama produk:");
        const price = prompt("Masukkan harga produk:");

        if (name && price) {
            const transaction = db.transaction([storeName], "readwrite");
            const objectStore = transaction.objectStore(storeName);
            const newProduct = { name: name, price: parseFloat(price) };
            objectStore.add(newProduct);

            transaction.oncomplete = function () {
                loadProducts(currentPage, searchInput.value); // Reload products with the current search term
                alert("Produk berhasil ditambahkan!");
            };

            transaction.onerror = function (event) {
                console.error("Transaction error:", event.target.errorCode);
            };
        } else {
            alert("Nama produk dan harga tidak boleh kosong!");
        }
    };

    // Show form to edit existing product
    window.showEditProductForm = function (id) {
        const transaction = db.transaction([storeName], "readonly");
        const objectStore = transaction.objectStore(storeName);
        const request = objectStore.get(id);

        request.onsuccess = function (event) {
            const product = event.target.result;
            const newName = prompt("Edit nama produk:", product.name);
            const newPrice = prompt("Edit harga produk:", product.price);

            if (newName && newPrice) {
                product.name = newName;
                product.price = parseFloat(newPrice);

                const updateTransaction = db.transaction([storeName], "readwrite");
                const updateObjectStore = updateTransaction.objectStore(storeName);
                updateObjectStore.put(product);

                updateTransaction.oncomplete = function () {
                    loadProducts(currentPage, searchInput.value); // Reload products with the current search term
                    alert("Produk berhasil diperbarui!");
                };

                updateTransaction.onerror = function (event) {
                    console.error("Transaction error:", event.target.errorCode);
                };
            } else {
                alert("Nama produk dan harga tidak boleh kosong!");
            }
        };

        transaction.onerror = function (event) {
            console.error("Transaction error:", event.target.errorCode);
        };
    };

    // Delete a product
    window.deleteProduct = function (id) {
        if (confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
            const transaction = db.transaction([storeName], "readwrite");
            const objectStore = transaction.objectStore(storeName);
            objectStore.delete(id);

            transaction.oncomplete = function () {
                loadProducts(currentPage, searchInput.value); // Reload products with the current search term
                alert("Produk berhasil dihapus!");
            };

            transaction.onerror = function (event) {
                console.error("Transaction error:", event.target.errorCode);
            };
        }
    };

    // Initialize the database and add sample data if necessary
    function initDB() {
        const request = indexedDB.open(dbName, 1);

        request.onupgradeneeded = function (event) {
            const db = event.target.result;

            // Create an object store for products
            const objectStore = db.createObjectStore(storeName, { keyPath: "id", autoIncrement: true });

            // Define the data fields in each product
            objectStore.createIndex("name", "name", { unique: false });
            objectStore.createIndex("price", "price", { unique: false });
        };

        request.onsuccess = function (event) {
            db = event.target.result;
            console.log("IndexedDB initialized");

            // Check if data already exists, if not, add sample data
            const transaction = db.transaction([storeName], "readonly");
            const objectStore = transaction.objectStore(storeName);
            const countRequest = objectStore.count();

            countRequest.onsuccess = function () {
                if (countRequest.result === 0) {
                    addSampleData(db);
                } else {
                    console.log("Sample data already exists");
                }
            };
        };

        request.onerror = function (event) {
            console.error("IndexedDB error:", event.target.errorCode);
        };
    }

    // Add sample data to the database
    function addSampleData(db) {
        const transaction = db.transaction([storeName], "readwrite");
        const objectStore = transaction.objectStore(storeName);

        const sampleData = [
            { "name": "Tent Camping 2-Person", "price": 150000 },
            { "name": "Portable Camping Stove", "price": 50000 },
            { "name": "Sleeping Bag - 3 Season", "price": 120000 },
            { "name": "Backpacking Backpack - 40L", "price": 200000 },
            { "name": "Outdoor Hiking Boots", "price": 250000 },
            { "name": "Waterproof Hiking Jacket", "price": 180000 },
            { "name": "Compact Binoculars", "price": 80000 },
            { "name": "Portable Solar Charger", "price": 70000 },
            { "name": "Camping Lantern LED", "price": 60000 },
            { "name": "Outdoor First Aid Kit", "price": 40000 },
            { "name": "Multi-Tool Survival Kit", "price": 90000 },
            { "name": "Insulated Water Bottle - 1L", "price": 55000 },
            { "name": "Fishing Rod and Reel Combo", "price": 150000 },
            { "name": "Outdoor Hammock with Straps", "price": 130000 },
            { "name": "Campfire Cooking Set", "price": 110000 },
            { "name": "Portable Camping Chair", "price": 65000 },
            { "name": "Emergency Survival Blanket", "price": 25000 },
            { "name": "Outdoor GPS Device", "price": 220000 },
            { "name": "Binoculars with Night Vision", "price": 300000 },
            { "name": "Camping Table and Chairs Set", "price": 170000 }
        ];

        sampleData.forEach(product => {
            objectStore.add(product);
        });

        transaction.oncomplete = function () {
            console.log("Sample data added successfully");
        };

        transaction.onerror = function (event) {
            console.error("Transaction error:", event.target.errorCode);
        };
    }

    initDB(); // Call initDB on page load
});
