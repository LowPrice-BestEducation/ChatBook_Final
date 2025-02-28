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

    // Load JSON data
    fetch("chat.json")
        .then(response => response.json())
        .then(data => {
            chatData = data.map(chat => ({
                ...chat,
                date: new Date(chat.date) // Convert string date to Date object
            }));
            populateSenderFilter();
            renderChat();
        });

    function populateSenderFilter() {
        senderFilter.innerHTML = `<option value="">Select Sender</option>`;
        const senders = [...new Set(chatData.map(chat => chat.sender))];
        senders.forEach(sender => {
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
                (!selectedSender || chat.sender === selectedSender) &&
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
                <img src="${chat.profilePic || 'default-avatar.jpg'}" class="profile-pic">
                <div class="message-text">${chat.message}</div>
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
    
        // Force a repaint for chat name and username to apply transition smoothly
        const chatNames = document.querySelectorAll(".chat-name, .username");
        chatNames.forEach(el => {
            el.style.display = "none"; // Temporarily hide
            void el.offsetHeight; // Force reflow
            el.style.display = ""; // Restore display
        });
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

