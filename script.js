document.addEventListener("DOMContentLoaded", function() {
    let currentSongIndex = 0;
    const songs = []; // Populate this array with your song data
    const songElements = document.querySelectorAll('.song-section');
    const audioElement = document.getElementById('audioPlayer');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const welcomeMessage = document.getElementById('welcomeMessage');

    // Function to update song details
    function updateSongDetails() {
        const currentSong = songs[currentSongIndex];
        document.getElementById('songTitle').innerText = currentSong.title;
        document.getElementById('songArtist').innerText = currentSong.artist;
        document.getElementById('songDescription').innerText = currentSong.description;
        audioElement.src = currentSong.audioSrc;
        audioElement.play();
    }

    // Function to change to the next song
    function nextSong() {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        updateSongDetails();
    }

    // Function to change to the previous song
    function prevSong() {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        updateSongDetails();
    }

    // Hide welcome message and start playlist
    function startPlaylist() {
        welcomeMessage.style.display = 'none';
        songElements[currentSongIndex].classList.add('active');
        updateSongDetails();
    }

    // Event listeners
    playPauseBtn.addEventListener('click', () => {
        if (audioElement.paused) {
            audioElement.play();
        } else {
            audioElement.pause();
        }
    });

    nextBtn.addEventListener('click', nextSong);
    prevBtn.addEventListener('click', prevSong);
    audioElement.addEventListener('ended', nextSong);

    // Start Playlist when user clicks start button
    document.getElementById('startBtn').addEventListener('click', startPlaylist);

    // Load first song automatically
    startPlaylist();
});
