// DOM Elements
const startButton = document.getElementById('start-btn');
const welcomeScreen = document.getElementById('welcome-screen');
const playlistScreen = document.getElementById('playlist-screen');
const songTitle = document.getElementById('song-title');
const artistName = document.getElementById('artist-name');
const songMeaning = document.getElementById('song-meaning'); 
const favoriteLyricsContainer = document.createElement('div'); // Container for favorite lyrics
const favoriteLyricsLabel = document.createElement('p'); // Label for "Favorite Lyrics"
const favoriteLyricsText = document.createElement('p'); // Text for favorite lyrics
const songLyrics = document.getElementById('song-lyrics');
const audioPlayer = document.getElementById('audio-player');
const audioSource = document.getElementById('audio-source');
const prevButton = document.getElementById('prev-btn');
const nextButton = document.getElementById('next-btn');
const startOverButton = document.getElementById('start-over-btn');

let currentSongIndex = 0;
let songs = [];

// Function to load song data from JSON file
async function loadSongs() {
    try {
        const response = await fetch('songs.json');
        if (!response.ok) throw new Error('Failed to load songs');
        songs = await response.json();
    } catch (error) {
        console.error("Error loading the songs data:", error);
    }
}

// Function to clean up lyrics
function cleanUpLyrics(lyrics) {
    return lyrics.replace(/\n\s*\n/g, '\n').replace(/\n{2,}/g, '\n\n');
}

// Function to load and display a song
async function loadSong(songIndex) {
    if (songs.length === 0) return;

    const song = songs[songIndex];

    songTitle.textContent = song.title;
    artistName.textContent = `Artist: ${song.artist}`;
    songMeaning.innerHTML = `<em>${song.meaning}</em>`;

    // Favorite Lyrics Section
    if (song.favoriteLyrics) {
        favoriteLyricsLabel.textContent = "Favorite Lyrics";
        favoriteLyricsLabel.style.fontWeight = "bold"; 
        favoriteLyricsText.textContent = song.favoriteLyrics;
        favoriteLyricsContainer.innerHTML = ''; // Clear previous content
        favoriteLyricsContainer.appendChild(favoriteLyricsLabel);
        favoriteLyricsContainer.appendChild(favoriteLyricsText);
        favoriteLyricsContainer.style.marginBottom = "10px";
    } else {
        favoriteLyricsContainer.innerHTML = ''; // Remove if no favorite lyrics
    }

    // Insert favorite lyrics before the lyrics box
    songLyrics.parentNode.insertBefore(favoriteLyricsContainer, songLyrics);

    // Set the audio source
    audioSource.src = song.file;
    audioPlayer.load();
    audioPlayer.play();

    // Show or hide buttons based on song position
    prevButton.style.display = songIndex === 0 ? 'none' : 'inline-block';
    nextButton.style.display = songIndex === songs.length - 1 ? 'none' : 'inline-block';
    startOverButton.style.display = songIndex === songs.length - 1 ? 'inline-block' : 'none';

    // Scroll lyrics section to the top
    songLyrics.scrollTop = 0;

    // Set and clean up lyrics
    songLyrics.innerHTML = cleanUpLyrics(song.lyrics || 'Lyrics not available.').replace(/\n/g, '<br>');
}

// Event listener for the start button
startButton.addEventListener('click', async () => {
    await loadSongs();
    if (songs.length > 0) {
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
    if (songs.length === 0 || currentSongIndex >= songs.length - 1) return;
    currentSongIndex++;
    loadSong(currentSongIndex);
});

// Event listener for previous song button
prevButton.addEventListener('click', () => {
    if (songs.length === 0 || currentSongIndex === 0) return;
    currentSongIndex--;
    loadSong(currentSongIndex);
});

// Event listener for the "Start Over" button
startOverButton.addEventListener('click', () => {
    currentSongIndex = 0;
    loadSong(currentSongIndex);
});

// Auto-play next song when the current one ends (but don't loop back to the first song)
audioPlayer.addEventListener('ended', () => {
    if (currentSongIndex < songs.length - 1) {
        currentSongIndex++;
        loadSong(currentSongIndex);
    }
});
