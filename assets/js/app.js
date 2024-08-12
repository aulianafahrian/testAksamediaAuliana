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

    // Handle form submission
    const form = document.getElementById("editProfileForm");
    if (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();
            const newUsername = usernameInput.value.trim();

            if (newUsername) {
                localStorage.setItem("username", newUsername);
                profileName.textContent = newUsername;
                // Optionally, display a success message or notification here
                alert("Profile updated successfully!");
            } else {
                // Handle the case where the input is empty
                alert("Username cannot be empty!");
            }
        });
    }
});
