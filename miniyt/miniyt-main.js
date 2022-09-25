"use strict";

const ytTopPanel = document.getElementById("panel");
const ytSearch = document.getElementById("search");
const ytMainView = document.getElementById("mainview");
const ytPlaylist = document.getElementById("playlist");
const ytFavoritesInput = document.getElementById("favoritesInput")
const ytFavoritesList = document.getElementById("favoritesList")

ytFavoritesInput.onkeydown = function(e) {
    let code = (e.keyCode ? e.keyCode : e.which);
    if (code == 13) { // Enter
        e.preventDefault();
        createFavoritesList(ytFavoritesInput.value);
        selectFavoritesList(ytFavoritesInput.value);    
        this.blur();
    }
};
ytFavoritesInput.onclick = function(e) {
    this.value = "";
}
ytFavoritesInput.onchange = function(e) {
    selectFavoritesList(ytFavoritesInput.value);
}
ytSearch.onkeydown = function(e) {
    let code = (e.keyCode ? e.keyCode : e.which);
    if (code == 13) { // Enter
        e.preventDefault();
        addSearchVideos(e.srcElement.value);
        e.srcElement.value = "";
        this.blur();
    }
};
ytSearch.onfocus = function(e) {
    this.value = "";
};
var videoSelected = -1;
function selectVideo(index) {
    let videos = document.getElementsByClassName("yt-thumbnail");
    if (videos.length === 0) {
        return;
    }
    if (videos[videoSelected] !== undefined) {
        videos[videoSelected].style = videos[videoSelected]._saved;
        videos[videoSelected]._saved = undefined;
    }
    if (index >= videos.length) {
        index = 0;
    }
    if (index < 0) {
        index = videos.length - 1;
    }
    videos[index]._saved = videos[index].style;
    videos[index].style.boxShadow = "0px 0px 10px 5px #FFFFFFAA";
    videos[index].style.filter = "saturate(150%) brightness(175%)";
    scrollMainView(videos[index]);

    return index;
}
function scrollMainView(e) {
    let offset = 0;
    while(e) {
        offset += e.offsetTop;
        e = e.offsetParent;
    }
    ytMainView.scrollTo(0, offset - window.innerHeight / 3);
}
function configure() {
    //apiKey = "AIzaSyCaFQKaomLi5QQnKlqWjKoX2ExlGt6DHbQ"; // Mine.
    //apiKey = "AIzaSyAn7RSNQpIOEYPEhtvk8yzXo68VrSWiMu0"; // Mine, new key.
    // apiKey = "AIzaSyAAsY6pKwhHX2-G9FC0_V7VC3hHkja-h3Q"; // GitHub - remove after test, use sparingly.
    apiKey = "AIzaSyDz9EghbqyXnNVH5s56wWMvai-6E6kpBtA";
    videosPerSearch = 300;
    videosPerRelated = 200;
    document.title = "MiniYT 1.3";
}
document.body.onload = function() {
    configure();
    addRelatedVideos(getVidFromUrl());
    loadFavorites();
}
