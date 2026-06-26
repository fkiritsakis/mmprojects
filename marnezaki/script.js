// --- YOUR DATA HERE ---
// 1. Find a playlist on Spotify.
// 2. Click (...) > Share > 'Embed playlist'.
// 3. Find the `src="..."` URL (e.g., https://open.spotify.com/embed/playlist/XYZ...)
// 4. Also find a square image URL for the center (often the playlist cover art).

//<iframe data-testid="embed-iframe" style="border-radius:12px" src="https://open.spotify.com/embed/playlist/5dt41rBah4TpgYOsSMl24b?utm_source=generator&si=96a1f533900345c5" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>


const myPlaylists = [
    {
        title: "Morning Vibes",
        // The center image for the vinyl (must be square for best look)
        centerImageUrl: "https://images.unsplash.com/photo-1596238612185-3006d649d29c?q=80&w=400&auto=format&fit=crop", 
        // The URL from the Spotify Embed code (DO NOT use the main share link)
        spotifyEmbedUrl: "https://open.spotify.com/embed/playlist/5dt41rBah4TpgYOsSMl24b?utm_source=generator&si=96a1f533900345c5" 
    },
    {
        title: "Late Night Drive",
        centerImageUrl: "https://images.unsplash.com/photo-1518640165980-d3e0e2ba6c1e?q=80&w=400&auto=format&fit=crop",
        spotifyEmbedUrl: "https://www.youtube.com/embed/JWdZEumNRmI?si=B8haoUpAzPxdGeCL"
    },
    {
        title: "Chill Cafe",
        centerImageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=400&auto=format&fit=crop",
        spotifyEmbedUrl: "https://open.spotify.com/embed/playlist/37i9dQZF1DX9R4G7g8N6oM?utm_source=generator"
    },
     {
        title: "Workout Power",
        centerImageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=400&auto=format&fit=crop",
        spotifyEmbedUrl: "https://open.spotify.com/embed/playlist/37i9dQZF1DX705w6Z5qOor?utm_source=generator"
    }
];

// --- Jukebox Logic (Do not edit below unless you know JS) ---
const gridContainer = document.getElementById('jukebox-grid');
const playerContainer = document.getElementById('spotify-player-container');

// Initial setup: Render the records
myPlaylists.forEach((playlist, index) => {
    // 1. Create the button element
    const recordBtn = document.createElement('button');
    recordBtn.classList.add('record-item');
    recordBtn.setAttribute('aria-label', `Play ${playlist.title}`);

    // 2. Create the inner structure (the vinyl and its center image)
    const wrapper = document.createElement('div');
    wrapper.classList.add('vinyl-wrapper');

    const vinyl = document.createElement('div');
    vinyl.classList.add('vinyl-record');

    const center = document.createElement('div');
    center.classList.add('vinyl-center');
    center.style.backgroundImage = `url(${playlist.centerImageUrl})`;

    // Assemble the record visual
    vinyl.appendChild(center);
    wrapper.appendChild(vinyl);
    recordBtn.appendChild(wrapper);
    
    // 3. Handle the click interaction
    recordBtn.addEventListener('click', () => {
        handleRecordClick(recordBtn, playlist.spotifyEmbedUrl);
    });

    // Add it to the main grid
    gridContainer.appendChild(recordBtn);
});


// Core function that runs when a record is clicked
function handleRecordClick(clickedButton, embedUrl) {
    // A. STOP all existing spins and remove active states
    document.querySelectorAll('.record-item').forEach(btn => {
        btn.classList.remove('active');
        btn.querySelector('.vinyl-wrapper').classList.remove('spinning');
    });

    // B. START the spin on the clicked record and mark as active
    clickedButton.classList.add('active');
    clickedButton.querySelector('.vinyl-wrapper').classList.add('spinning');

    // C. LOAD the Spotify Player (this cannot autostart)
    // We generate the iframe dynamically when they click.
    const spotifyIframe = `
        <iframe 
            src="${embedUrl}" 
            width="100%" 
            height="100%" 
            frameborder="0" 
            allowfullscreen="" 
            referrerpolicy="strict-origin-when-cross-origin"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
            loading="lazy">
        </iframe>
    `;
    
    playerContainer.innerHTML = spotifyIframe;
}