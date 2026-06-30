// Day 1: grab the input fields
let titleInput = document.querySelector(".title");
let artistInput = document.querySelector(".artist");
let linkInput = document.querySelector(".link");

// Arrays that hold all the playlist data (parallel arrays - same index = same song)
// Try to load any previously saved playlist from localStorage first
let songs = JSON.parse(localStorage.getItem("songs")) || [];
let artists = JSON.parse(localStorage.getItem("artists")) || [];
let links = JSON.parse(localStorage.getItem("links")) || [];
let embeds = JSON.parse(localStorage.getItem("embeds")) || [];

// Saves the current arrays to localStorage so they persist after refresh/close
function savePlaylist() {
  localStorage.setItem("songs", JSON.stringify(songs));
  localStorage.setItem("artists", JSON.stringify(artists));
  localStorage.setItem("links", JSON.stringify(links));
  localStorage.setItem("embeds", JSON.stringify(embeds));
}

// Fetches the real Spotify embed code for a track URL
// using Spotify's public oEmbed endpoint (no API key needed)
function getSpotifyEmbed(trackUrl) {
  let oembedUrl = `https://open.spotify.com/oembed?url=${encodeURIComponent(trackUrl)}`;
  return fetch(oembedUrl).then((response) => {
    if (!response.ok) throw new Error("Spotify oEmbed request failed");
    return response.json();
  });
}

function displaySongInfo() {
  emptySongInfo();
  for (let i = 0; i < songs.length; i++) {
    $(".display").append(`
      <div class="song-row">
        <div class="embed-cell">${embeds[i]}</div>
        <div class="text-cell">
          <p class="title-text">${songs[i]}</p>
          <p class="artist-text">${artists[i]}</p>
        </div>
        <div class="link-cell">
          <a href="${links[i]}" target="_blank">Open in Spotify</a>
        </div>
      </div>
    `);
  }
}

function emptySongInfo() {
  $(".display").empty();
}

function addSongInfo() {
  let songName = titleInput.value;
  let artistName = artistInput.value;
  let spotifyUrl = linkInput.value;

  if (!songName || !artistName || !spotifyUrl) {
    alert("Please fill in the song title, artist, and Spotify link.");
    return;
  }

  getSpotifyEmbed(spotifyUrl)
    .then((data) => {
      // Spotify's oEmbed returns a compact embed by default (height ~152).
      // Bump the height so the full player (cover art + controls) shows.
      let fullSizeEmbed = data.html.replace(/height="\d+"/, 'height="352"');

      songs.push(songName);
      artists.push(artistName);
      links.push(spotifyUrl);
      embeds.push(fullSizeEmbed);

      titleInput.value = "";
      artistInput.value = "";
      linkInput.value = "";

      savePlaylist();
      displaySongInfo();
    })
    .catch((error) => {
      console.error("Could not fetch Spotify embed:", error);
      alert("Couldn't find an embed for that link. Make sure it's a valid Spotify track URL.");
    });
}

$(".add-input").click(function () {
  addSongInfo();
});

displaySongInfo();