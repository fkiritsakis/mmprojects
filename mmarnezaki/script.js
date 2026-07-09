// ==========================================
// 1. CONFETTI SCROLL TRIGGER LOGIC
// ==========================================
const scrollOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.6 // Fires when 60% of Chapter 10 card enters the viewport
};

let confettiFired = false;

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !confettiFired) {
            confettiFired = true;
            
            const defaults = { 
                spread: 360, 
                ticks: 100, 
                gravity: 0.8, 
                decay: 0.94, 
                startVelocity: 30, 
                colors: ['#ff7b90', '#ffafcc', '#ffcad4'] 
            };
            
            // Shoot immediate bursts of heart shapes
            confetti({ ...defaults, particleCount: 50, scalar: 1.2, shapes: ['heart'] });
            confetti({ ...defaults, particleCount: 30, scalar: 1.5, shapes: ['heart'] });
        }
    });
}, scrollOptions);

const targetNode = document.querySelector('#final-node');
scrollObserver.observe(targetNode);


// ==========================================
// 2. AUDIO PLAYBACK TOGGLE LOGIC
// ==========================================
let currentPlayingAudio = null;
let currentPlayingButton = null;

function toggleAudio(audioId, buttonElement) {
    const audio = document.getElementById(audioId);

    // If another song is currently playing, stop it cleanly first
    if (currentPlayingAudio && currentPlayingAudio !== audio) {
        currentPlayingAudio.pause();
        currentPlayingAudio.currentTime = 0;
        currentPlayingButton.classList.remove('playing');
        currentPlayingButton.innerHTML = '<span class="btn-icon">▶️</span> Play Song';
    }

    // Toggle playback state of chosen track
    if (audio.paused) {
        audio.play();
        buttonElement.classList.add('playing');
        buttonElement.innerHTML = '<span class="btn-icon">⏸️</span> Pause Song';
        currentPlayingAudio = audio;
        currentPlayingButton = buttonElement;
    } else {
        audio.pause();
        buttonElement.classList.remove('playing');
        buttonElement.innerHTML = '<span class="btn-icon">▶️</span> Play Song';
        currentPlayingAudio = null;
        currentPlayingButton = null;
    }

    // Reset UI automatically when the track finishes playing
    audio.onended = function() {
        buttonElement.classList.remove('playing');
        buttonElement.innerHTML = '<span class="btn-icon">▶️</span> Play Song';
        currentPlayingAudio = null;
        currentPlayingButton = null;
    };
}