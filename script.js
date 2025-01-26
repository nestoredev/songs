// DOM Elements
const startButton = document.getElementById('start-btn');
const welcomeScreen = document.getElementById('welcome-screen');
const playlistScreen = document.getElementById('playlist-screen');
const songTitle = document.getElementById('song-title');
const artistName = document.getElementById('artist-name');
const songMeaning = document.getElementById('song-meaning');
const songLyrics = document.getElementById('song-lyrics');
const audioPlayer = document.getElementById('audio-player');
const audioSource = document.getElementById('audio-source');
const prevButton = document.getElementById('prev-btn');
const nextButton = document.getElementById('next-btn');

// Current song index
let currentSongIndex = 0;

// Load the song data from the JSON file
async function loadSongs() {
    try {
        const response = await fetch('assets/songs.json');
        const data = await response.json();
        return data.songs;
    } catch (error) {
        console.error("Error loading the songs data:", error);
        return [];
    }
}

// Show the first song
async function loadSong(songIndex, songs) {
    const song = songs[songIndex];
    
    songTitle.textContent = song.title;
    artistName.textContent = `Artist: ${song.artist}`;
    songMeaning.textContent = `Meaning: ${song.meaning}`;
    songLyrics.innerHTML = song.lyrics.replace(/\n/g, '<br>'); // Break lyrics into multiple lines
    
    // Set the audio source
    audioSource.src = song.file;
    audioPlayer.load();  // Reload the player with the new song
}

// Start the playlist
startButton.addEventListener('click', async () => {
    const songs = await loadSongs();
    if (songs.length > 0) {
        welcomeScreen.style.display = 'none';
        playlistScreen.style.display = 'block';
        playlistScreen.style.opacity = 1;  // Fade in
        loadSong(currentSongIndex, songs);  // Load the first song
    }
});

// Play the next song
nextButton.addEventListener('click', async () => {
    const songs = await loadSongs();
    currentSongIndex = (currentSongIndex + 1) % songs.length;  // Loop to the first song if at the end
    loadSong(currentSongIndex, songs);
    audioPlayer.play();
});

// Play the previous song
prevButton.addEventListener('click', async () => {
    const songs = await loadSongs();
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;  // Loop to the last song if at the beginning
    loadSong(currentSongIndex, songs);
    audioPlayer.play();
});

// Auto-play next song after current one finishes
audioPlayer.addEventListener('ended', async () => {
    const songs = await loadSongs();
    currentSongIndex = (currentSongIndex + 1) % songs.length;  // Loop to the first song if at the end
    loadSong(currentSongIndex, songs);
    audioPlayer.play();
});
