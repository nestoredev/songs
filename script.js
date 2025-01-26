document.addEventListener("DOMContentLoaded", function() {
    let currentSongIndex = 0;
    const songs = [
        {
            title: "All My Love",
            artist: "Led Zeppelin",
            description: "A song that reminds me of the special bond we share.",
            audioSrc: "songs/AllMyLove.mp3"
        },
        // Add more song objects here if needed
    ];

    const songElements = document.querySelectorAll('.song-section');
    const audioElement = document.getElementById('audioPlayer');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const welcomeMessage = document.getElementById('welcomeMessage');
    const startBtn = document.getElementById('startBtn');

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
    startBtn.addEventListener('click', function() {
        startPlaylist();
    });

    // Start Playlist automatically once the page is loaded
    // This will be useful for autoplay as soon as the page loads
    startPlaylist();
});
