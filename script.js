document.addEventListener("DOMContentLoaded", async () => {
    const welcomeMessage = document.querySelector(".welcome-message");
    const startBtn = document.getElementById("startBtn");
    const content = document.getElementById("content");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const playPauseBtn = document.getElementById("playPauseBtn");
    const songTitle = document.getElementById("songTitle");
    const songArtist = document.getElementById("songArtist"); // Artist name
    const songDescription = document.getElementById("songDescription");
    const audioPlayer = document.getElementById("audioPlayer");
    const songSection = document.querySelector(".song-section");

    let songs = [];
    let currentIndex = 0;

    // Fetch songs from the JSON file
    async function fetchSongs() {
        try {
            const response = await fetch("data/songs.json");
            songs = await response.json();
            if (songs.length > 0) {
                currentIndex = 0;
                updateUI();
                audioPlayer.play();  // Start playing the first song immediately
            }
        } catch (error) {
            console.error("Error fetching song list:", error);
        }
    }

    // Update the UI with the song title, artist, description, and audio
    function updateUI() {
        if (songs.length === 0) return;

        const track = songs[currentIndex];
        const encodedFileName = encodeURIComponent(track.name) + ".mp3";
        audioPlayer.src = `songs/${encodedFileName}`;
        songTitle.innerText = track.title;
        songArtist.innerText = track.artist; // Set the artist name
        songDescription.innerText = track.description;

        // Display the song section and update button visibility
        songSection.classList.add("active");
        prevBtn.style.display = currentIndex === 0 ? "none" : "inline-block";
        nextBtn.style.display = currentIndex === songs.length - 1 ? "none" : "inline-block";
    }

    // Handle song change when the previous button is clicked
    function previousSong() {
        if (currentIndex > 0) {
            currentIndex--;
            updateUI();
            audioPlayer.play();  // Auto-play the previous song
        }
    }

    // Handle song change when the next button is clicked
    function nextSong() {
        if (currentIndex < songs.length - 1) {
            currentIndex++;
            updateUI();
            audioPlayer.play();  // Auto-play the next song
        } else {
            currentIndex = 0;
            updateUI();
            audioPlayer.play();  // Auto-play from the beginning if it's the last song
        }
    }

    // Auto-advance to the next song when the current song ends
    audioPlayer.addEventListener("ended", nextSong);

    // Event listeners for the buttons
    prevBtn.addEventListener("click", previousSong);
    nextBtn.addEventListener("click", nextSong);

    // Event listener to start the music playlist
    startBtn.addEventListener("click", () => {
        welcomeMessage.classList.add("hidden");
        content.classList.remove("hidden");
        fetchSongs();
    });

    content.classList.add("hidden");
});
