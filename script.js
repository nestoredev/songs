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

let currentSongIndex = 0; // Track the current song index
let songs = []; // Store songs globally

// Function to load song data from JSON file
async function loadSongs() {
    try {
        const response = await fetch('songs.json'); // Correct reference to the main directory
        if (!response.ok) {
            throw new Error('Failed to load songs');
        }
        songs = await response.json();
        console.log("Songs loaded:", songs); // Debug log to see the song data
    } catch (error) {
        console.error("Error loading the songs data:", error);
    }
}

// Function to load and display a song
function loadSong(songIndex) {
    if (songs.length === 0) return; // Prevent errors if songs are not loaded

    const song = songs[songIndex];

    songTitle.textContent = song.title;
    artistName.textContent = `Artist: ${song.artist}`;
    songMeaning.textContent = `Meaning: ${song.meaning}`;
    songLyrics.innerHTML = song.lyrics.replace(/\n/g, '<br>'); // Preserve line breaks in lyrics

    // Set the audio source
    audioSource.src = song.file;
    audioPlayer.load();

    // Show or hide buttons based on song position
    prevButton.style.display = currentSongIndex === 0 ? 'none' : 'inline-block'; // Hide on first song
    nextButton.style.display = currentSongIndex === songs.length - 1 ? 'none' : 'inline-block'; // Hide on last song
}

// Event listener for the start button
startButton.addEventListener('click', async () => {
    await loadSongs();

    if (songs.length > 0) {
        // Fade out the welcome screen
        welcomeScreen.style.transition = "opacity 0.5s ease-in-out";
        welcomeScreen.style.opacity = 0;

        setTimeout(() => {
            welcomeScreen.style.display = 'none'; // Hide after fade-out
            playlistScreen.style.display = 'flex';

            setTimeout(() => {
                playlistScreen.style.opacity = 1; // Fade in the playlist screen
            }, 100);

            loadSong(currentSongIndex);
        }, 500); // Delay should match CSS transition time
    }
});

// Event listener for next song button
nextButton.addEventListener('click', () => {
    if (songs.length === 0) return;
    currentSongIndex = (currentSongIndex + 1) % songs.length; // Loop to start
    loadSong(currentSongIndex);
    audioPlayer.play();
});

// Event listener for previous song button
prevButton.addEventListener('click', () => {
    if (songs.length === 0) return;
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length; // Loop to end
    loadSong(currentSongIndex);
    audioPlayer.play();
});

// Auto-play next song when the current one ends
audioPlayer.addEventListener('ended', () => {
    if (songs.length === 0) return;
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
    audioPlayer.play();
});
