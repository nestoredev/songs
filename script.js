document.addEventListener("DOMContentLoaded", async () => {
    const welcomeMessage = document.querySelector(".welcome-message");
    const startBtn = document.getElementById("startBtn");
    const content = document.getElementById("content");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const playPauseBtn = document.getElementById("playPauseBtn");
    const songTitle = document.getElementById("songTitle");
    const songDescription = document.getElementById("songDescription");
    const audioPlayer = document.getElementById("audioPlayer");

    let songs = [];
    let currentIndex = 0;

    async function fetchSongs() {
        try {
            const response = await fetch("data/songs.json");
            songs = await response.json();
            updateUI();
        } catch (error) {
            console.error("Error fetching song list:", error);
        }
    }

    function fadeOutAudio(callback) {
        let volume = 1.0;
        const fade = setInterval(() => {
            if (volume > 0.05) {
                volume -= 0.05;
                audioPlayer.volume = volume;
            } else {
                clearInterval(fade);
                audioPlayer.pause();
                audioPlayer.volume = 1.0;
                callback();
            }
        }, 100);
    }

    function fadeInAudio() {
        audioPlayer.volume = 0;
        audioPlayer.play();
        let volume = 0;
        const fade = setInterval(() => {
            if (volume < 1.0) {
                volume += 0.05;
                audioPlayer.volume = volume;
            } else {
                clearInterval(fade);
            }
        }, 100);
    }

    function updateUI(playNext = false) {
        if (songs.length === 0) return;
        
        const track = songs[currentIndex];
        const encodedFileName = encodeURIComponent(track.name) + ".mp3";
        audioPlayer.src = `songs/${encodedFileName}`;
        songTitle.innerText = `${track.title} - ${track.artist}`;
        songDescription.innerText = track.description;

        prevBtn.style.display = currentIndex === 0 ? "none" : "inline-block";
        nextBtn.style.display = currentIndex === songs.length - 1 ? "none" : "inline-block";

        if (playNext) {
            fadeInAudio();
            playPauseBtn.innerText = "⏸️ Pause";
        }
    }

    function nextSong() {
        fadeOutAudio(() => {
            if (currentIndex < songs.length - 1) {
                currentIndex++;
                updateUI(true);
            }
        });
    }

    function togglePlayPause() {
        if (audioPlayer.paused) {
            audioPlayer.play();
            playPauseBtn.innerText = "⏸️ Pause";
        } else {
            audioPlayer.pause();
            playPauseBtn.innerText = "▶️ Play";
        }
    }

    prevBtn.addEventListener("click", () => {
        if (currentIndex > 0) {
            fadeOutAudio(() => {
                currentIndex--;
                updateUI(true);
            });
        }
    });

    nextBtn.addEventListener("click", () => {
        nextSong();
    });

    playPauseBtn.addEventListener("click", togglePlayPause);
    audioPlayer.addEventListener("ended", nextSong);

    startBtn.addEventListener("click", () => {
        welcomeMessage.classList.add("hidden");
        content.classList.remove("hidden");
        fetchSongs();
    });

    content.classList.add("hidden");
});
