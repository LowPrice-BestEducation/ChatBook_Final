

// Check authentication on page load
document.addEventListener("DOMContentLoaded", () => {
    if (!sessionStorage.getItem("authenticated")) {
        window.location.href = "index.html"; // Redirect to login page if not authenticated
    }
});

// Secure Logout Function
function logout() {
    sessionStorage.removeItem("authenticated"); // Clear session
    window.location.href = "index.html"; // Redirect to login page
}

// Prevent going back to dashboard after logout
window.addEventListener("pageshow", function (event) {
    if (event.persisted || window.performance && window.performance.navigation.type === 2) {
        sessionStorage.removeItem("authenticated"); // Ensure session is cleared
        window.location.href = "index.html"; // Redirect to login page
    }
});

document.addEventListener("DOMContentLoaded", function () {
    let chatData = [];
    const chatList = document.getElementById("chatList");
    const searchBox = document.getElementById("searchBox");
    const senderFilter = document.getElementById("senderFilter");
    const fromDate = document.getElementById("fromDate");
    const toDate = document.getElementById("toDate");
    const sortOrder = document.getElementById("sortOrder");
    const themeToggle = document.getElementById("themeToggle");

    // Name mapping (Modify this object as needed)
    const nameMapping = {
        "Maha": "Maha",
        "A B H I S H E K G O W D A": "Abhi"
    };

    // Default profile pictures for known users
    const profilePictures = {
        "Maha": "icon3.jpg",
        "A B H I S H E K G O W D A": "icon1.jpg"
    };

    // Load JSON data
    fetch("sample_chat.json")
        .then(response => response.json())
        .then(data => {
            chatData = data.messages.map(chat => ({
                sender: chat.sender_name,
                displayName: nameMapping[chat.sender_name] || chat.sender_name, // Apply name mapping
                message: chat.content,
                date: new Date(chat.timestamp_ms), // Convert milliseconds to Date object
                profilePic: profilePictures[chat.sender_name] || "default-avatar.jpg"
            }));
            populateSenderFilter();
            renderChat();
        });

    function populateSenderFilter() {
        senderFilter.innerHTML = `<option value="">Select Sender</option>`;
        const uniqueSenders = [...new Set(chatData.map(chat => chat.displayName))]; // Use mapped names
        uniqueSenders.forEach(sender => {
            let option = document.createElement("option");
            option.value = sender;
            option.textContent = sender;
            senderFilter.appendChild(option);
        });
    }

    function renderChat() {
        chatList.innerHTML = "";

        const searchText = searchBox.value.toLowerCase();
        const selectedSender = senderFilter.value;
        const fromDateValue = fromDate.value ? new Date(fromDate.value) : null;
        const toDateValue = toDate.value ? new Date(toDate.value) : null;
        const sortValue = sortOrder.value || "oldest"; // Default to oldest

        let filteredData = chatData.filter(chat => {
            return chat.message.toLowerCase().includes(searchText) &&
                (!selectedSender || chat.displayName === selectedSender) &&
                (!fromDateValue || chat.date >= fromDateValue) &&
                (!toDateValue || chat.date <= toDateValue);
        });

        // Default sorting (oldest first)
        filteredData.sort((a, b) => a.date - b.date);

        if (sortValue === "newest") {
            filteredData.reverse();
        }

        filteredData.forEach(chat => {
            let div = document.createElement("div");
            div.classList.add("chat-message", chat.sender === "Maha" ? "sent" : "received");
        
            div.innerHTML = `
                <img src="${chat.profilePic}" class="profile-pic">
                <div class="message-text">
                    <strong>${chat.displayName}</strong><br> <!-- Name in bold, new line -->
                    ${chat.message.replace(/\n/g, "<br>")} <!-- Message in normal text -->
                </div>
            `;
        
            chatList.appendChild(div);
        });
        

        chatList.scrollTop = chatList.scrollHeight;
    }

    // Event listeners for filtering
    searchBox.addEventListener("input", renderChat);
    senderFilter.addEventListener("change", renderChat);
    fromDate.addEventListener("change", renderChat);
    toDate.addEventListener("change", renderChat);
    sortOrder.addEventListener("change", renderChat);

    // Dark mode toggle
    themeToggle.addEventListener("click", function () {
        document.body.classList.toggle("dark-mode");
        themeToggle.textContent = document.body.classList.contains("dark-mode") ? "☀️ Light Mode" : "🌙 Dark Mode";
    });
});


    // Disable right-click
    document.addEventListener("contextmenu", function (event) {
        event.preventDefault();
    });

    // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, and Ctrl+U (both uppercase & lowercase)
    document.addEventListener("keydown", function (event) {
        const key = event.key.toLowerCase(); // Convert key to lowercase

        if (
            event.ctrlKey && 
            (event.key === "u" || event.key === "U" || event.key === "s" || event.key === "S") ||
            event.key === "F12" ||
            (event.ctrlKey && event.shiftKey && (event.key === "I" || event.key === "i" || event.key === "J" || event.key === "j" || event.key === "C" || event.key === "c"))
        ) {
            event.preventDefault();
        }
    });

    if (document.documentElement) {
        Object.defineProperty(document, 'documentElement', {
            get: function () {
                window.location.href = "about:blank";
                return null;
            }
        });
    }

    setInterval(() => {
        if (window.outerHeight - window.innerHeight > 200 || window.outerWidth - window.innerWidth > 200) {
            document.body.innerHTML = "";
            window.location.replace("about:blank");
        }
    }, 1000);
