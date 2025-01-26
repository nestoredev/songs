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
const startOverButton = document.getElementById('start-over-btn'); // New "Start Over" button
const fullPlaylistButton = document.getElementById('full-playlist-btn'); // New "Full Playlist" button
const fullPlaylistScreen = document.getElementById('full-playlist-screen'); // Full Playlist screen
const backToPlayerButton = document.getElementById('back-to-player-btn'); // Back to player button
const playlistList = document.getElementById('playlist'); // Playlist list

let currentSongIndex = 0; // Track the current song index
let songs = []; // Store songs globally

// Function to load song data from JSON file
async function loadSongs() {
    try {
        const response = await fetch('songs.json');
        if (!response.ok) {
            throw new Error('Failed to load songs');
        }
        songs = await response.json();
        console.log("Songs loaded:", songs); // Debug log to see the song data
    } catch (error) {
        console.error("Error loading the songs data:", error);
    }
}

// Function to fetch lyrics from Lyrics.ovh API
async function fetchLyrics(title, artist) {
    try {
        // Use encodeURIComponent to ensure spaces are encoded in the query
        const lyricsResponse = await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`);

        if (!lyricsResponse.ok) {
            return null; // Return null if the API call fails
        }

        const lyricsData = await lyricsResponse.json();

        if (lyricsData.lyrics) {
            return lyricsData.lyrics.replace(/(?:\r\n|\r|\n)/g, '\n'); // Clean up line breaks
        } else {
            return null; // Return null if no lyrics found
        }
    } catch (error) {
        console.error("Error fetching lyrics:", error);
        return null; // Return null in case of any error
    }
}

// Function to clean up lyrics
function cleanUpLyrics(lyrics) {
    let cleanedLyrics = lyrics.replace(/\n\s*\n/g, '\n'); // Remove extra blank lines within verses
    cleanedLyrics = cleanedLyrics.replace(/\n{2,}/g, '\n\n'); // Replace multiple newlines with one
    return cleanedLyrics;
}

// Function to load and display a song
async function loadSong(songIndex) {
    if (songs.length === 0) return; // Prevent errors if songs are not loaded

    const song = songs[songIndex];

    songTitle.textContent = song.title;
    artistName.textContent = `Artist: ${song.artist}`;
    songMeaning.textContent = `Meaning: ${song.meaning}`;

    // First, try to fetch lyrics from Lyrics.ovh API
    const lyrics = await fetchLyrics(song.title, song.artist);

    // If no lyrics are found from Lyrics.ovh, fall back to the lyrics in the JSON file
    const displayedLyrics = lyrics || song.lyrics || 'Lyrics not available.';

    // Clean up the lyrics before displaying
    const cleanedLyrics = cleanUpLyrics(displayedLyrics);

    songLyrics.innerHTML = cleanedLyrics.replace(/\n/g, '<br>'); // Preserve line breaks in lyrics

    // Set the audio source
    audioSource.src = song.file;
    audioPlayer.load();

    // Play the audio after loading the song
    audioPlayer.play();

    // Show or hide buttons based on song position
    if (currentSongIndex === 0) {
        prevButton.style.display = 'none'; // Hide previous button on first song
    } else {
        prevButton.style.display = 'inline-block'; // Show previous button on other songs
    }

    if (currentSongIndex === songs.length - 1) {
        nextButton.style.display = 'none'; // Hide next button on last song
        startOverButton.style.display = 'inline-block'; // Show the "Start Over" button on the last song
    } else {
        nextButton.style.display = 'inline-block'; // Show next button on other songs
        startOverButton.style.display = 'none'; // Hide the "Start Over" button on non-last songs
    }
}

// Function to update the playlist list
function updatePlaylistList() {
    playlistList.innerHTML = ''; // Clear existing list
    songs.forEach((song, index) => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.textContent = `${song.title} - ${song.artist}`;
        link.href = '#';
        link.addEventListener('click', () => {
            currentSongIndex = index;
            loadSong(currentSongIndex);
            playlistScreen.style.display = 'flex';
            fullPlaylistScreen.style.display = 'none'; // Hide full playlist screen
        });
        listItem.appendChild(link);
        playlistList.appendChild(listItem);
    });
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

            loadSong(currentSongIndex); // Load the first song
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

// Event listener for the "Start Over" button
startOverButton.addEventListener('click', () => {
    currentSongIndex = 0; // Set the index to the first song
    loadSong(currentSongIndex); // Load the first song
    audioPlayer.play(); // Play the audio
});

// Event listener for the "Full Playlist" button
fullPlaylistButton.addEventListener('click', () => {
    // Stop the current song before showing the playlist
    audioPlayer.pause();
    audioPlayer.currentTime = 0;

    fullPlaylistScreen.style.display = 'flex'; // Show full playlist screen
    playlistScreen.style.display = 'none'; // Hide the player screen
    updatePlaylistList(); // Update the playlist list with song titles and artists
});

// Event listener for the "Back to Player" button
backToPlayerButton.addEventListener('click', () => {
    fullPlaylistScreen.style.display = 'none'; // Hide full playlist screen
    playlistScreen.style.display = 'flex'; // Show player screen
});

// Auto-play next song when the current one ends
audioPlayer.addEventListener('ended', () => {
    if (songs.length === 0) return;
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
    audioPlayer.play();
});
