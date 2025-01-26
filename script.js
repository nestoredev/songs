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
const startOverButton = document.getElementById('start-over-btn');
const fullPlaylistButton = document.getElementById('full-playlist-btn');
const fullPlaylistScreen = document.getElementById('full-playlist-screen');
const backToPlayerButton = document.getElementById('back-to-player-btn');
const playlistList = document.getElementById('playlist');

let currentSongIndex = 0;
let songs = [];

// Function to load song data from JSON file
async function loadSongs() {
    try {
        const response = await fetch('songs.json');
        if (!response.ok) {
            throw new Error('Failed to load songs');
        }
        songs = await response.json();
        console.log("Songs loaded:", songs);

        // Ensure playlist updates after songs are loaded
        updatePlaylistList();
    } catch (error) {
        console.error("Error loading the songs data:", error);
    }
}

// Function to update the playlist list
function updatePlaylistList() {
    if (songs.length === 0) return; // Ensure songs are loaded before populating playlist

    playlistList.innerHTML = ''; // Clear existing list
    songs.forEach((song, index) => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.textContent = `${song.title} - ${song.artist}`;
        link.href = '#';
        link.addEventListener('click', () => {
            currentSongIndex = index;
            loadSong(currentSongIndex);
            showPlaylistScreen();
        });
        listItem.appendChild(link);
        playlistList.appendChild(listItem);
    });

    console.log("Playlist updated:", songs);
}

// Function to show the main player screen
function showPlaylistScreen() {
    fullPlaylistScreen.style.display = 'none';
    playlistScreen.style.display = 'flex';
}

// Function to show the full playlist screen
function showFullPlaylistScreen() {
    fullPlaylistScreen.style.display = 'flex';
    playlistScreen.style.display = 'none';
}

// Function to load and display a song
async function loadSong(songIndex) {
    if (songs.length === 0) return;

    const song = songs[songIndex];

    songTitle.textContent = song.title;
    artistName.textContent = `Artist: ${song.artist}`;
    songMeaning.textContent = `Meaning: ${song.meaning}`;
    songLyrics.innerHTML = song.lyrics.replace(/\n/g, '<br>') || 'Lyrics not available.';

    audioSource.src = song.file;
    audioPlayer.load();
    audioPlayer.play();

    prevButton.style.display = songIndex === 0 ? 'none' : 'inline-block';
    nextButton.style.display = songIndex === songs.length - 1 ? 'none' : 'inline-block';
    startOverButton.style.display = songIndex === songs.length - 1 ? 'inline-block' : 'none';
}

// Event listener for the start button
startButton.addEventListener('click', async () => {
    await loadSongs();

    if (songs.length > 0) {
        welcomeScreen.style.transition = "opacity 0.5s ease-in-out";
        welcomeScreen.style.opacity = 0;

        setTimeout(() => {
            welcomeScreen.style.display = 'none';
            playlistScreen.style.display = 'flex';

            setTimeout(() => {
                playlistScreen.style.opacity = 1;
            }, 100);

            loadSong(currentSongIndex);
        }, 500);
    }
});

// Event listener for next song button
nextButton.addEventListener('click', () => {
    if (songs.length === 0) return;
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
});

// Event listener for previous song button
prevButton.addEventListener('click', () => {
    if (songs.length === 0) return;
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(currentSongIndex);
});

// Event listener for the "Start Over" button
startOverButton.addEventListener('click', () => {
    currentSongIndex = 0;
    loadSong(currentSongIndex);
});

// Event listener for the "Full Playlist" button
fullPlaylistButton.addEventListener('click', () => {
    console.log("Full Playlist button clicked");
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    showFullPlaylistScreen();
});

// Event listener for the "Back to Player" button
backToPlayerButton.addEventListener('click', showPlaylistScreen);

// Auto-play next song when the current one ends
audioPlayer.addEventListener('ended', () => {
    if (songs.length === 0) return;
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
});
