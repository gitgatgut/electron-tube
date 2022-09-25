var playingFavorites = false;
var favorites = {};

function loadFavorites() {
    if (window.localStorage['favorites'] == undefined) {
        window.localStorage['favorites'] = "{}";
    }
    favorites = JSON.parse(window.localStorage['favorites']);
    $("#favoritesInput").autocomplete({
        source: function(request, response) { 
            let names = Object.keys(favorites).filter((n) => {
                return n.toLowerCase().indexOf(request.term.toLowerCase()) != -1;
            });
            response(names.sort());
        },
        minLength: 0,
        scroll: true
    }).focus(function() {
        $(this).autocomplete("search", "");
    });
}
function saveFavorites() {
    window.localStorage['favorites'] = JSON.stringify(favorites);
}
function addSelectedToFavorites() {
    let video = document.getElementsByClassName("yt-thumbnail")[videoSelected];
    let vid = video.getAttribute("vid");
    let title = video.getAttribute("title");
    addToCurrentFavoriteList(title, vid);
}
function addToCurrentFavoriteList(title, vid) {
    let name = ytFavoritesInput.value;
    if (favorites[name] != undefined) {
        let track = { vid: vid, title: title };
        favorites[name] = favorites[name].concat(track)
        saveFavorites();
        selectFavoritesList(name);
    }
}
function createFavoritesList(name) {
    if (name in favorites) {
        return;
    }
    favorites[name] = [];
    saveFavorites();
}
function selectFavoritesList(name) {
    ytFavoritesInput.blur();
    playlist = [];
    for (let v in favorites[name]) {
        let e = favorites[name][v];
        playlist.push({
            vid: e.vid,
            title: e.title,
            time: 0,
            isFavorite: true
        });
    }
    playIndex = playlist.length;
    renderPlaylist();
    playNextVideo();
}
function deleteCurrentFavoriteList() {
    let name = ytFavoritesInput.value;
    if (name == "") {
        return;
    }
    delete favorites[name];
    saveFavorites();
    
    let next = Object.keys(favorites)[0];
    ytFavoritesInput.value = next;
    if (next != "" && next != undefined) {
        selectFavoritesList(next);
    } else {
        ytFavoritesInput.value = "";
        playlist = [];
        renderPlaylist();
    }
}
function removeFavorite(entry) {
    let vid = entry.vid;
    let fl = favorites[ytFavoritesInput.value];
    for (let track in fl) {
        if (fl[track].vid == vid) {
            fl.splice(track, 1);
            saveFavorites();
            return;
        }
    }
}
function sortFavorites() {
    let name = ytFavoritesInput.value;
    if (name == "") {
        return;
    }
    sorted = favorites[name].sort((a,b) => -a.title.localeCompare(b.title))
    favorites[name] = sorted;
    selectFavoritesList(name);
    saveFavorites();
    playIndex = playlist.length - 1;
}