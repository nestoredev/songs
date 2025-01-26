let songs = [];
let currentSongIndex = 0;

const songTitle = document.getElementById("song-title");
const albumArt = document.getElementById("album-art");
const artistName = document.getElementById("artist-name");
const songMeaning = document.getElementById("song-meaning");
const songLyrics = document.getElementById("song-lyrics");
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
    songTitle.textContent = song.title; // Title of the song
    albumArt.src = song.albumArt ? song.albumArt : "assets/images/pink_heart.jpeg"; // If no album art, use the pink heart
    albumArt.alt = song.albumArt ? `Album art for ${song.title}` : "Pink Heart"; // Set alt text based on the album art
    artistName.textContent = `Artist: ${song.artist}`; // Artist name
    songMeaning.textContent = song.meaning; // Song meaning
    
    // Replace line breaks with <br> in the lyrics
    songLyrics.innerHTML = song.lyrics.replace(/\n/g, '<br>'); // Lyrics with line breaks
    
    audioSource.src = song.mp3; // Song MP3 source
    audioPlayer.load(); // Reload audio player
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
        albumArt.style.display = 'block'; // Ensure album art is visible on the playlist screen
        loadSong(songs[currentSongIndex]); // Load the first song
        audioPlayer.play();
    }, 1000); // Wait for fade-out to finish before hiding
});

audioPlayer.addEventListener('ended', playNextSong);

prevBtn.addEventListener('click', playPrevSong);
nextBtn.addEventListener('click', playNextSong);
