// 1. Password Configuration
const DARKROOM_PASSWORD = "doors"; // Change this to your chosen custom password!
let isAdminUnlocked = false;

// 2. Hardcoded Core Memories (Always visible to everyone)
const initialMemories = [
    {
        img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=400", 
        caption: "Our first official date night ⚡"
    },
    {
        img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=400", 
        caption: "Catching the seaside breeze 🌊"
    }
];

const gallery = document.getElementById('gallery');

// 3. Render function with conditional Delete Triggers
function createPolaroid(imgSrc, captionText, index, isCustomMemory) {
    const frame = document.createElement('div');
    frame.classList.add('polaroid');

    // Build frame internals
    let deleteHTML = '';
    if (isAdminUnlocked && isCustomMemory) {
        // Only provide the delete option for added custom memories if authenticated
        deleteHTML = `<div class="delete-badge" onclick="removeMemory(${index})">×</div>`;
    }

    frame.innerHTML = `
        ${deleteHTML}
        <img src="${imgSrc}" alt="Memory">
        <div class="caption">${captionText}</div>
    `;
    
    gallery.appendChild(frame);
}

// 4. Controller to Fetch and Assemble Gallery
function loadGallery() {
    gallery.innerHTML = ''; 
    
    // Render persistent base photos
    initialMemories.forEach((item) => createPolaroid(item.img, item.caption, null, false));

    // Render user uploaded dynamic photos from storage
    const savedMemories = JSON.parse(localStorage.getItem('savedMemories')) || [];
    savedMemories.forEach((item, index) => createPolaroid(item.img, item.caption, index, true));
}

// 5. Authentication Engine
function checkPassword() {
    const input = prompt("Enter password to unlock photo editing actions:");
    if (input === DARKROOM_PASSWORD) {
        isAdminUnlocked = true;
        document.getElementById('unlock-btn').classList.add('hidden');
        document.getElementById('admin-actions').classList.remove('hidden');
        loadGallery(); // Reload to show the active "×" delete markers
    } else if (input !== null) {
        alert("Incorrect password! Try again. ❤️");
    }
}

function lockDarkroom() {
    isAdminUnlocked = false;
    document.getElementById('unlock-btn').classList.remove('hidden');
    document.getElementById('admin-actions').classList.add('hidden');
    loadGallery(); // Reload to hide delete markers safely
}

// 6. Add Picture Handler
function handleUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const captionInput = prompt("Write a handwritten caption for this photo:");
    if (captionInput === null) return; 

    const reader = new FileReader();
    reader.onload = function(e) {
        const base64Image = e.target.result;
        
        const savedMemories = JSON.parse(localStorage.getItem('savedMemories')) || [];
        savedMemories.push({ img: base64Image, caption: captionInput || "A sweet memory..." });
        localStorage.setItem('savedMemories', JSON.stringify(savedMemories));
        
        loadGallery();
    };
    reader.readAsDataURL(file);
}

// 7. Delete Picture Handler
function removeMemory(index) {
    if (confirm("Are you sure you want to permanently remove this polaroid print?")) {
        const savedMemories = JSON.parse(localStorage.getItem('savedMemories')) || [];
        savedMemories.splice(index, 1); // Extract the target item out of the array
        localStorage.setItem('savedMemories', JSON.stringify(savedMemories));
        loadGallery(); // Refresh display state instantly
    }
}

// Initialize on page load
window.onload = loadGallery;