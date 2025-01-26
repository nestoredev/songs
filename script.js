document.addEventListener("DOMContentLoaded", function() {
    let currentSongIndex = 0;
    const songElements = document.querySelectorAll('.song-section');
    const audioElement = document.getElementById('audioPlayer');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const welcomeMessage = document.getElementById('welcomeMessage');
    const startBtn = document.getElementById('startBtn');
    const songTitle = document.getElementById('songTitle');
    const songArtist = document.getElementById('songArtist');
    const songDescription = document.getElementById('songDescription');
    
    let songs = [];

    // Fetch songs from the JSON file
    fetch('songs.json')
        .then(response => response.json())
        .then(data => {
            songs = data;  // Store the songs data
            console.log('Songs loaded:', songs); // Check the data to ensure it's loaded
            startBtn.style.display = 'block';  // Show the start button once songs are loaded
        })
        .catch(err => {
            console.error('Error loading songs:', err);
        });

    // Function to update song details
    function updateSongDetails() {
        const currentSong = songs[currentSongIndex];
        songTitle.innerText = currentSong.title;
        songArtist.innerText = currentSong.artist;
        songDescription.innerText = currentSong.description;
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

    // Hide the welcome message and show the first song
    function startPlaylist() {
        if (songs.length > 0) {
            welcomeMessage.style.display = 'none'; // Hide welcome message
            songElements[0].classList.add('active'); // Show the first song
            updateSongDetails(); // Start playing the first song
        }
    }

    // Event listeners for the buttons
    nextBtn.addEventListener('click', nextSong);
    prevBtn.addEventListener('click', prevSong);
    audioElement.addEventListener('ended', nextSong);

    // Start Playlist when the start button is clicked
    startBtn.addEventListener('click', function() {
        startPlaylist();
        startBtn.style.display = 'none'; // Hide the start button after the playlist starts
    });

    // Automatically start the playlist after the page is loaded (if songs are available)
    window.onload = function() {
        if (songs.length > 0) {
            startPlaylist();
            startBtn.style.display = 'none'; // Hide the start button once the playlist starts
        }
    };
});
