var player;

$(document).ready(function() {
    // global variable for the player

    if($('.fixed-hero__play-btn')) {
        // Inject youtub API script
        youtubeAPI();
    }

    $(".fixed-hero__play-btn").click(function() {
        $(this).parents('.fixed-hero__container').addClass('video__frame--show');
        player.playVideo();
    });
});

function onYouTubePlayerAPIReady() {
    // create the global player from the specific iframe (#video)
    player = new YT.Player('video', {
        events: {
            // call this function when player is ready to use
            'onReady': onPlayerReady,
            'onStateChange': function (event) {
                switch (event.data) {
                    case -1:
                        console.log ('unstarted');
                        break;
                    case 0:
                        console.log ('ended');
                        $('.fixed-hero__container').removeClass('video__frame--show');
                        break;
                    case 1:
                        console.log ('playing');
                        break;
                    case 2:
                        console.log ('paused');
                        break;
                    case 3:
                        console.log ('buffering');
                        break;
                    case 5:
                        console.log ('video cued');
                        break;
                    default:
                        console.log('default');
                }
            }
        }
    });
}

function youtubeAPI() {
    var tag = document.createElement('script');
    tag.src = "//www.youtube.com/player_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

function onPlayerReady(event) {
    // bind events
    $('.fixed-hero__container').addClass('video__frame--show');
    player.playVideo();
}
