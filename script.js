document.addEventListener("DOMContentLoaded", async () => {
    const welcomeMessage = document.querySelector(".welcome-message");
    const startBtn = document.getElementById("startBtn");
    const content = document.getElementById("content");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const songDescription = document.getElementById("songDescription");
    const audioPlayer = document.getElementById("audioPlayer");

    async function fetchSongs() {
        try {
            const response = await fetch("data/songs.json");
            return await response.json();
        } catch (error) {
            console.error("Error fetching song list:", error);
            return [];
        }
    }

    const songs = await fetchSongs();
    let currentIndex = 0;

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
        songDescription.innerHTML = `<strong>${track.title}</strong> by ${track.artist}<br>${track.description}`;
        audioPlayer.src = `songs/${track.name}.mp3`;

        if (playNext) {
            fadeInAudio();
        }

        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === songs.length - 1;
    }

    function nextSong() {
        fadeOutAudio(() => {
            if (currentIndex < songs.length - 1) {
                currentIndex++;
                updateUI(true);
            }
        });
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

    audioPlayer.addEventListener("ended", nextSong);

    startBtn.addEventListener("click", () => {
        welcomeMessage.style.display = "none";
        content.style.display = "block";
        updateUI(true);
    });

    content.style.display = "none";  
});
