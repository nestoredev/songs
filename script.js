let songs = [];
let currentSongIndex = 0;

const songTitle = document.getElementById("song-title");
const albumArt = document.getElementById("album-art");
const songMeaning = document.getElementById("song-meaning");
const audioPlayer = document.getElementById("audio-player");
const audioSource = document.getElementById("audio-source");

const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const welcomeScreen = document.getElementById("welcome-screen");
const playlistScreen = document.getElementById("playlist-screen");
const startBtn = document.getElementById("start-btn");

// Fetch song data from the JSON file
fetch('songs.json')
    .then(response => response.json())
    .then(data => {
        songs = data;
    })
    .catch(error => {
        console.error('Error loading song data:', error);
    });

function loadSong(song) {
    songTitle.textContent = song.title;
    albumArt.src = song.albumArt;
    songMeaning.textContent = song.meaning;
    audioSource.src = song.mp3;
    audioPlayer.load();
}

function playNextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(songs[currentSongIndex]);
    audioPlayer.play();
}

function playPrevSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(songs[currentSongIndex]);
    audioPlayer.play();
}

// Play button on the welcome screen
startBtn.addEventListener('click', () => {
    welcomeScreen.style.opacity = 0; // Fade out the welcome screen
    setTimeout(() => {
        welcomeScreen.style.display = 'none'; // Hide the welcome screen
        playlistScreen.classList.remove('hidden'); // Show the playlist screen
        playlistScreen.style.opacity = 1; // Fade in the playlist screen
        loadSong(songs[currentSongIndex]); // Load the first song
        audioPlayer.play();
    }, 1000); // Wait for fade-out to finish before hiding
});

audioPlayer.addEventListener('ended', playNextSong);

prevBtn.addEventListener('click', playPrevSong);
nextBtn.addEventListener('click', playNextSong);
