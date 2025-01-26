const songs = [
    {
        title: "Song 1",
        albumArt: "url-to-album-art1.jpg",
        meaning: "The meaning behind Song 1...",
        mp3: "path-to-song1.mp3"
    },
    {
        title: "Song 2",
        albumArt: "url-to-album-art2.jpg",
        meaning: "The meaning behind Song 2...",
        mp3: "path-to-song2.mp3"
    },
    // Add more songs as needed
];

let currentSongIndex = 0;

const songTitle = document.getElementById("song-title");
const albumArt = document.getElementById("album-art");
const songMeaning = document.getElementById("song-meaning");
const audioPlayer = document.getElementById("audio-player");
const audioSource = document.getElementById("audio-source");

const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");

function loadSong(song) {
    songTitle.textContent = song.title;
    albumArt.src = song.albumArt;
    songMeaning.textContent = song.meaning;
    audioSource.src = song.mp3;
    audioPlayer.load();
}

function playNextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(songs[currentSongIndex]);
    audioPlayer.play();
}

function playPrevSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(songs[currentSongIndex]);
    audioPlayer.play();
}

audioPlayer.addEventListener('ended', playNextSong);

prevBtn.addEventListener('click', playPrevSong);
nextBtn.addEventListener('click', playNextSong);

// Initialize the first song
loadSong(songs[currentSongIndex]);
