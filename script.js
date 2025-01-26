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

// Genius API setup
const GENIUS_API_KEY = 'mQHb9mFQpoeCIvl34ioZr7Pkl6lQ4PloTDovbk2QIjH5qYeCOuLiirFO0RcL519-'; // Replace with your actual Genius API key
const GENIUS_API_URL = 'https://api.genius.com';

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

// Function to fetch lyrics from Genius API
async function fetchLyrics(title, artist) {
    try {
        // Use encodeURIComponent to ensure spaces are encoded in the query
        const searchResponse = await fetch(`${GENIUS_API_URL}/search?q=${encodeURIComponent(title)}%20${encodeURIComponent(artist)}`, {
            headers: {
                Authorization: `Bearer ${GENIUS_API_KEY}`,
            },
        });

        const searchData = await searchResponse.json();
        const songPath = searchData.response.hits[0]?.result?.path;

        if (!songPath) {
            return null; // Return null if no song path is found
        }

        // Get the lyrics from Genius
        const lyricsResponse = await fetch(`https://genius.com${songPath}`);
        const lyricsPage = await lyricsResponse.text();

        // Use a regular expression to extract the lyrics
        const lyricsMatch = lyricsPage.match(/<div class="lyrics">([\s\S]*?)<\/div>/);
        if (lyricsMatch && lyricsMatch[1]) {
            return lyricsMatch[1].replace(/<br>/g, '\n'); // Clean up HTML <br> tags
        } else {
            return null; // Return null if no lyrics found
        }
    } catch (error) {
        console.error("Error fetching lyrics:", error);
        return null; // Return null in case of any error
    }
}

// Function to load and display a song
async function loadSong(songIndex) {
    if (songs.length === 0) return; // Prevent errors if songs are not loaded

    const song = songs[songIndex];

    songTitle.textContent = song.title;
    artistName.textContent = `Artist: ${song.artist}`;
    songMeaning.textContent = `Meaning: ${song.meaning}`;

    // First, try to fetch lyrics from the Genius API
    const lyrics = await fetchLyrics(song.title, song.artist);

    // If no lyrics are found from Genius, fall back to the lyrics in the JSON file
    const displayedLyrics = lyrics || song.lyrics || 'Lyrics not available.';

    songLyrics.innerHTML = displayedLyrics.replace(/\n/g, '<br>'); // Preserve line breaks in lyrics

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
    } else {
        nextButton.style.display = 'inline-block'; // Show next button on other songs
    }
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

// Auto-play next song when the current one ends
audioPlayer.addEventListener('ended', () => {
    if (songs.length === 0) return;
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
    audioPlayer.play();
});
