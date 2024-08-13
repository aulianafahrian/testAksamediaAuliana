
document.addEventListener("DOMContentLoaded", function () {
    const username = localStorage.getItem("username");
    const profileName = document.getElementById("navbarProfileName");
    const profileInfoName = document.getElementById("profileInfoName");
    const usernameInput = document.getElementById("username");

    // Set profile names and input field if they exist
    const displayName = username ? username : "Nama Pengguna";

    if (profileName) {
        profileName.textContent = displayName;
    }

    if (profileInfoName) {
        profileInfoName.textContent = displayName;
    }

    if (usernameInput) {
        usernameInput.value = displayName;
    }

    // Handle form submission
    const form = document.getElementById("editProfileForm");
    if (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();
            const newUsername = usernameInput.value.trim();

            if (newUsername) {
                localStorage.setItem("username", newUsername);
                const updatedDisplayName = newUsername;
                if (profileName) {
                    profileName.textContent = updatedDisplayName;
                }
                if (profileInfoName) {
                    profileInfoName.textContent = updatedDisplayName;
                }
                // Optionally, display a success message or notification here
                alert("Profile updated successfully!");
            } else {
                // Handle the case where the input is empty
                alert("Username cannot be empty!");
            }
        });
    }
});

