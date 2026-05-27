var tabs = {
    "sptab": {
        "name": "Staff Picks",
        "id": "sp",
        "rssfile": "StaffPicks"
    },
    "mrtab": {
        "name": "Most Recent",
        "id": "mr",
        "rssfile": "Latest"
    },
    "mptab": {
        "name": "Top Animations",
        "id": "mp",
        "rssfile": "TopScored"
    },
    "mvtab": {
        "name": "Most Watched",
        "id": "mv",
        "rssfile": "MostWatched"
    }
};
var playerFlashvars = {
    "movieLid": "6",
    "pwm": "0",
    "ut": "-1",
    "apiserver": "https:\/\/flashthemes.net\/",
    "playcount": 1,
    "copyable": "0",
    "isPublished": "1",
    "ctc": "go",
    "tlang": "en_US",
    "is_private_shared": "0",
    "autostart": "0",
    "isInitFromExternal": "0",
    "appCode": "go",
    "is_slideshow": "0",
    "is_emessage": "0",
    "clientThemePath": "https://lightspeed.flashthemes.net\/static\/ct\/ad44370a650793d9\/<client_theme>",
    "animationPath": "",
    "isEmbed": "1",
    "refuser": null,
    "utm_source": null,
    "uid": null,
    "isTemplate": "0",
    "showButtons": "1",
    "chain_mids": "",
    "endStyle": 0,
    "showshare": true,
};
var movielist = {
    "sp": [],
    "mr": [],
    "mp": [],
    "mv": []
};
var currentMovie = 0;
var currentTab = 0;
var currentMoviePage = 0;
var selectedMoviePage = 0;
var endscreenTimer;

function initRSSTabs(startTab) {
    var tabids = Object.keys(tabs);
    for (var i = 0; i < tabids.length; i++) {
        $('#' + tabids[i]).on("click", function (e) {
            var element = e["currentTarget"];
            if (element["className"] == "tabactive") {
                return;
            }
            switchRSSTab(element["id"])
        });
    }
    $('#' + startTab).trigger('click');
    $('#pagnationprev').on("click", function () {
        movieListPage('prev');
    })
    $('#pagnationnext').on("click", function () {
        movieListPage('next');
    })
}

function switchRSSTab(tab) {
    currentTab = tabs[tab]["id"];
    $('.tabactive').attr("class", "tabinactive");
    $('#' + tab).attr("class", "tabactive");
    currentMovie = 0;
    currentMoviePage = 0;
    selectedMoviePage = 0;

    if (movielist[currentTab].length <= 0) {
        $.ajax({
            type: "GET",
            url: '/ajax/rss/' + tabs[tab]["rssfile"],
            success: function (A) {
                var rssfeed = { code: '0', response: A };
                if (rssfeed["code"] != 0) {
                    console.error('Error getting RSS feed', rssfeed);
                    return 1;
                }
                var movies = $(rssfeed.response).find("ga_info");
                var pagenum = 0;
                var pagemovies = [];
                for (var i = 0; i < movies.length; i++) {
                    if ((i % 5) == 0) {
                        if (i > 0) {
                            movielist[currentTab][pagenum] = pagemovies;
                            pagemovies = [];
                            pagenum++
                        }
                        if (i != movies.length - 1) {
                            movielist[currentTab].push([])
                        }
                    }
                    pagemovies.push({
                        movieId: $(movies[i]).find("movieId").text(),
                        movieOwnerId: $(movies[i]).find("movieOwnerId").text(),
                        thumbnailUrl: $(movies[i]).find("thumbnailURL").text(),
                        title: $(movies[i]).find("title").text(),
                        movieViews: $(movies[i]).find("movieViews").text(),
                        movieOwner: $(movies[i]).find("movieOwner").text(),
                        movieViews: $(movies[i]).find("movieViews").text()
                    });
                    if (movies.length % 5) {
                        movielist[currentTab][pagenum] = pagemovies;
                    }
                }

                movieListPage('init');
                var autoplay = false;
                if ($('#playbutton').length <= 0) {
                    autoplay = true;
                }
                initMovie(movielist[currentTab][currentMoviePage][currentMovie], autoplay);
            },
            failure: function () {
                //add error handler here
                //res({ code: '1', response: "Error contacting the server" });
            },
            error: function (A) {
                //add error handler here
                //res({ code: '1', response: A });
            }
        });
    }
}

function initMovie(data, autoplay) {
    if(typeof autoplay === "undefined") { autoplay = true }
    stopEndscreenTimer();
    $('#endscreen').fadeOut(0);
    $('#endscreentitle').html('<a href="/movie/' + data["movieId"] + '">' + data["title"] + '</a>')
    $('#endscreenowner').html('By <a href="/user/' + data["movieOwnerId"] + '">' + data["movieOwner"] + '</a>')
    $('#replaybutton').off("click")
    $('#sharebutton').off("click")
    $('#nextbutton').off("click")
    $("#movietitle").html('<a href="https://flashthemes.net/movie/' + data["movieId"] + '">' + data["title"] + '</a>');
    $("#ownername").html('<a href="https://flashthemes.net/user/' + data["movieOwnerId"] + '">' + data["movieOwner"] + '</a>');
    $("#views").text(data["movieViews"]);
    /*if ($("#playbutton").length > 0) {
        $("#moviepreview").css('background-image', 'url(' + data["thumbnailUrl"] + ')');
        $("#playbutton").css('display', 'inline-block');
        $("#playbutton").on('click', function () {
            createRSSPlayer(data["movieId"], data["thumbnailUrl"], data["movieOwnerId"])
            $("#playbutton").off('click');
        })
    }*/
    //if (autoplay) {
    createRSSPlayer(data["movieId"], data["thumbnailUrl"], data["movieOwnerId"], data["isWide"])
    return;
    //}
}

function createRSSPlayer(movieId, thumbnailUrl, ownerId, isWide) {
    fvars = {
        "movieId": movieId,
        "storePath": "\/static\/store\/<store>",
        "userV": ownerId,
        "thumbnailURL": thumbnailUrl,
        "isWide": isWide,
    };
    fvars = Object.assign({}, fvars, playerFlashvars); 
    $("#player").flash({
        id: "Player",
        swf: "https://lightspeed.flashthemes.net/static/animation/new82/player.swf",
        height: 384,
        width: 550,
        bgcolor: "#000000",
        scale: "exactfit",
        quality: "low",
        allowScriptAccess: "always",
        allowFullScreen: "true",
        hasVersion: "10.0.12",
        flashvars: fvars
    });
}

function startEndscreenTimer() {
    if (!movielist[currentTab][selectedMoviePage + 1][currentMovie] && movielist[currentTab][selectedMoviePage][currentMovie + 1]) {
        $('#nextbutton .endscreenbutton').addClass('disabled');
        return;
    }
    endscreenTimer = setInterval(function () {
        var timeleft = $('#nextbutton .endscreenbutton').text();
        if (timeleft <= 0) {
            stopEndscreenTimer();
            playNextVideo();
            return;
        }
        $('#nextbutton .endscreenbutton').text(--timeleft);
    }, 1000);
}

function stopEndscreenTimer() {
    clearInterval(endscreenTimer);
    $('#nextbutton .endscreenbutton').text(5);
}

function playNextVideo() {
    if (!movielist[currentTab][selectedMoviePage + 1][0] && movielist[currentTab][selectedMoviePage][currentMovie + 1]) {
        return;
    }
    if (!movielist[currentTab][selectedMoviePage][currentMovie + 1]) {
        selectedMoviePage++;
        currentMovie = 0;
    } else {
        currentMovie++;
    }
    $('.rssmovie.active').attr('class', 'rssmovie');
    if (selectedMoviePage == currentMoviePage) {
        $('#rssmovie_' + currentMovie).find('.rssmovie').addClass('active');
    }
    initMovie(movielist[currentTab][selectedMoviePage][currentMovie]);
}

function shareMovie() {
    $.ajax({
        type: "POST",
        url: 'https://flashthemes.net/ajax/getMovieEmbedInfo/' + movielist[currentTab][selectedMoviePage][currentMovie]["movieId"],
        success: function (A) {
            showOverlay(A);
            $('#embedmovie_' + movielist[currentTab][selectedMoviePage][currentMovie]["movieId"] + ' .close_button').on('click', function(e) {
                startEndscreenTimer();
            })
        },
        failure: function () {
            displayFeedback('1' + GT.gettext("Error contacting the server"))
        },
        error: function (A) {
            displayFeedback('1' + A)
        }
    });
}

function movieListPage(nav) {
    if ((currentMoviePage == movielist[currentTab].length - 1 && nav == 'next') || (currentMoviePage == 0 && nav == 'prev')) {
        return;
    }
    $('#rssmovies').html('');
    switch (nav) {
        case 'next': {
            currentMoviePage++;
            break;
        }
        case 'prev': {
            --currentMoviePage;
            break;
        }
    }
    for (var i = 0; i < movielist[currentTab][currentMoviePage].length; i++) {
        $('#rssmovies').append('<a id="rssmovie_' + i + '"><div class="rssmovie" title="' + movielist[currentTab][currentMoviePage][i]["title"] + '" id="' + movielist[currentTab][currentMoviePage][i]["movieId"] + '" style="background-image: url(\'' + movielist[currentTab][currentMoviePage][i]["thumbnailUrl"] + '\'); background-size: 100% 100%;"></div></a>')
        $('#rssmovie_' + i).on('click', function (e) {
            selectedMoviePage = currentMoviePage;
            currentMovie = Number(e["currentTarget"]["id"].split('rssmovie_')[1]);
            $('.rssmovie.active').attr('class', 'rssmovie');
            $('#' + e["currentTarget"]["id"]).find('.rssmovie').addClass('active');
            initMovie(movielist[currentTab][selectedMoviePage][currentMovie]);
        })
        if (nav == 'init' && i == 0) {
            $('#rssmovie_' + i).find('.rssmovie').addClass('active');
        }
    }
    if (currentMoviePage == movielist[currentTab].length - 1) {
        $('#pagnationnext').addClass('disabled')
    } else {
        $('#pagnationnext').attr('class', 'pagnationnext')
    }
    if (currentMoviePage == 0) {
        $('#pagnationprev').addClass('disabled')
    } else {
        $('#pagnationprev').attr('class', 'pagnationprev')
    }
    if (selectedMoviePage == currentMoviePage) {
        $('#rssmovie_' + currentMovie).find('.rssmovie').addClass('active')
    }
}

function stopRSSPlayer() {
    $('#endscreen').fadeIn(1000);
    startEndscreenTimer();

    $('#replaybutton').on("click", function () {
        stopEndscreenTimer();
        $('#endscreen').fadeOut(0);
        $('#replaybutton').off("click")
        $('#sharebutton').off("click")
        $('#nextbutton').off("click")
        document.getElementById("Player").seek(0.1);
        document.getElementById("Player").play();
    })

    $('#sharebutton').on("click", function () {
        stopEndscreenTimer();
        shareMovie();
    })

    $('#nextbutton').on("click", function () {
        stopEndscreenTimer();
        playNextVideo();
    })
}