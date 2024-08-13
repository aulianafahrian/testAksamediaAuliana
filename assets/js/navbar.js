// Toggle mobile menu
function toggleMobileMenu() {
    const mobileMenu = document.getElementById("mobile-menu");
    if (mobileMenu) {
        mobileMenu.classList.toggle("hidden");
    }
}

document.getElementById("mobile-menu-button")?.addEventListener("click", toggleMobileMenu);

// Toggle dropdown menu
function toggleDropdown() {
    const dropdownMenu = document.getElementById("dropdownMenu");
    if (dropdownMenu) {
        dropdownMenu.classList.toggle("hidden");
    }
}

document.getElementById("dropdownButton")?.addEventListener("click", toggleDropdown);


// Close dropdown if clicked outside
window.addEventListener("click", function (event) {
    const dropdownButton = document.getElementById("dropdownButton");
    const dropdownMenu = document.getElementById("dropdownMenu");

    if (dropdownButton && dropdownMenu && !dropdownButton.contains(event.target) && !dropdownMenu.contains(event.target)) {
        dropdownMenu.classList.add("hidden");
    }
});
