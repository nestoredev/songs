// DOM Elements
const startButton = document.getElementById('start-btn');
const welcomeScreen = document.getElementById('welcome-screen');
const playlistScreen = document.getElementById('playlist-screen');
const songTitle = document.getElementById('song-title');
const artistName = document.getElementById('artist-name');
const songMeaning = document.getElementById('song-meaning'); // Displays meaning without "Meaning:"
const favoriteLyricsContainer = document.createElement('div'); // Container for favorite lyrics
const favoriteLyricsLabel = document.createElement('p'); // Label for "Favorite Lyrics"
const favoriteLyricsText = document.createElement('p'); // Text for favorite lyrics
const songLyrics = document.getElementById('song-lyrics');
const audioPlayer = document.getElementById('audio-player');
const audioSource = document.getElementById('audio-source');
const prevButton = document.getElementById('prev-btn');
const nextButton = document.getElementById('next-btn');
const startOverButton = document.getElementById('start-over-btn');
const videoContainer = document.createElement('div'); // Container for embedded YouTube videos

// Insert video container after the audio player
audioPlayer.parentNode.insertBefore(videoContainer, audioPlayer.nextSibling);

let currentSongIndex = 0;
let songs = [];
let manualRestart = false; // Prevents automatic looping to the first song

// Function to load song data from JSON file
async function loadSongs() {
    try {
        const response = await fetch('songs.json');
        if (!response.ok) throw new Error('Failed to load songs');
        songs = await response.json();
        console.log("Songs loaded:", songs);
    } catch (error) {
        console.error("Error loading the songs data:", error);
    }
}

// Function to fetch lyrics from Lyrics.ovh API
async function fetchLyrics(title, artist) {
    try {
        const lyricsResponse = await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`);

        if (!lyricsResponse.ok) return null;

        const lyricsData = await lyricsResponse.json();
        return lyricsData.lyrics ? lyricsData.lyrics.replace(/(?:\r\n|\r|\n)/g, '\n') : null;
    } catch (error) {
        console.error("Error fetching lyrics:", error);
        return null;
    }
}

// Function to clean up lyrics
function cleanUpLyrics(lyrics) {
    return lyrics.replace(/\n\s*\n/g, '\n').replace(/\n{2,}/g, '\n\n');
}

// Function to handle line breaks in the favorite lyrics
function handleLineBreaks(text) {
    return text.replace(/\n/g, '<br>');
}

// Function to embed YouTube videos
function embedYouTubeVideos(videoUrls) {
    videoContainer.innerHTML = ''; // Clear previous videos

    if (!videoUrls || videoUrls.length === 0) return; // No videos, do nothing

    videoUrls.forEach(url => {
        const videoId = url.split('v=')[1]?.split('&')[0]; // Extract video ID
        if (videoId) {
            const iframe = document.createElement('iframe');
            iframe.src = `https://www.youtube.com/embed/${videoId}`;
            iframe.width = "560";
            iframe.height = "315";
            iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
            iframe.allowFullscreen = true;
            iframe.style.marginTop = "15px"; // Add spacing above videos
            videoContainer.appendChild(iframe);
        }
    });
}

// Function to load and display a song
async function loadSong(songIndex) {
    if (songs.length === 0) return;

    const song = songs[songIndex];

    songTitle.textContent = song.title;
    artistName.textContent = `${song.artist}`; // Removed "Artist:" label

    // Set meaning text as plain text (not italic)
    songMeaning.textContent = song.meaning;

    // Favorite Lyrics Section
    favoriteLyricsContainer.innerHTML = ''; // Clear previous content
    if (song.favoriteLyrics) {
        favoriteLyricsLabel.textContent = "Favorite Lyrics";
        favoriteLyricsLabel.style.fontWeight = "bold";

        // Handle line breaks in favorite lyrics and italicize the text
        favoriteLyricsText.innerHTML = `<em>${handleLineBreaks(song.favoriteLyrics)}</em>`;
        favoriteLyricsContainer.appendChild(favoriteLyricsLabel);
        favoriteLyricsContainer.appendChild(favoriteLyricsText);
        favoriteLyricsContainer.style.marginBottom = "10px";
    }

    // Insert favorite lyrics before the lyrics box
    songLyrics.parentNode.insertBefore(favoriteLyricsContainer, songLyrics);

    // Fetch and set lyrics
    const lyrics = await fetchLyrics(song.title, song.artist);
    const displayedLyrics = lyrics || song.lyrics || 'Lyrics not available.';
    songLyrics.innerHTML = cleanUpLyrics(displayedLyrics).replace(/\n/g, '<br>');

    // Scroll lyrics section to the top
    songLyrics.scrollTop = 0;

    // Set the audio source
    audioSource.src = song.file;
    audioPlayer.load();
    audioPlayer.play();

    // Embed YouTube videos
    embedYouTubeVideos(song.videos || []);

    // Show or hide buttons based on song position
    prevButton.style.display = songIndex === 0 ? 'none' : 'inline-block';
    nextButton.style.display = songIndex === songs.length - 1 ? 'none' : 'inline-block';
    startOverButton.style.display = songIndex === songs.length - 1 ? 'inline-block' : 'none';

    // ... inside loadSong(songIndex) at the end, after setting everything
    window.scrollTo(0, 0);
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
    if (songs.length === 0 || currentSongIndex >= songs.length - 1) return;
    currentSongIndex++;
    loadSong(currentSongIndex);
    manualRestart = false; // Reset manual restart flag
});

// Event listener for previous song button
prevButton.addEventListener('click', () => {
    if (songs.length === 0 || currentSongIndex === 0) return;
    currentSongIndex--;
    loadSong(currentSongIndex);
    manualRestart = false; // Reset manual restart flag
});

// Event listener for the "Start Over" button
startOverButton.addEventListener('click', () => {
    currentSongIndex = 0;
    loadSong(currentSongIndex);
    manualRestart = true; // Indicate the restart was manual
});

// Auto-play next song when the current one ends, but don't loop back unless "Start Over" is clicked
audioPlayer.addEventListener('ended', () => {
    if (currentSongIndex < songs.length - 1) {
        currentSongIndex++;
        loadSong(currentSongIndex);
    } else if (manualRestart) {
        currentSongIndex = 0;
        loadSong(currentSongIndex);
    }
});
