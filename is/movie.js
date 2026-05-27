var URL_FLAG_MOVIE = "/ajax/flagMovie";
var URL_DELETE_MOVIE = "/ajax/deleteMovie";
var URL_DELETE_MOVIE_BY_TEACHER = "/ajax/deleteMovieByTeacher";
var URL_UNDELETE_MOVIE = "/ajax/undeleteMovie";
var URL_REJECT_MOVIE = "/ajax/rejectMovie";
var URL_DELETE_FAVORITE = "/ajax/deleteFavorite";
var URL_STAFFPICKS_MOVIE = "/ajax/addStaffpicksMovie";
var URL_HIDE_MOVIE = "/ajax/hideMovie";
var URL_ADD_BEST_ANIMATION = "/ajax/addBestAnimation";
var URL_ADD_FEATUED_ANIMATION = "/ajax/addFeaturedAnimation";
var URL_SET_COPYABLE = "/ajax/setcopyable";
var URL_SET_PUBLISHED = "/ajax/setpublished";
var URL_SET_PRIVATE_SHARE = "/ajax/setprivateshare";
var URL_SET_PRIVATE_SHARE_FOR_SCHOOL = "/ajax/setprivateshareforschool";
var URL_SET_PUBLISHED_PSHARE = "/ajax/setpublishedpshare";
var URL_CHECK_MOVIE_COPY = "/ajax/checkCopyMovie";
var URL_CHECK_MOVIE_EDIT = "/ajax/checkEditMovie";
var URL_RECOMMEND = "/ajax/movie_recommend";
var URL_SET_TITLE_PREFIX = "/ajax/setMovieTitlePrefix";
var _publishStatusHistory = new Array();
var _pshareStatusHistory = new Array();
function checkEditMovie(movie_id) {
    jQuery.post(URL_CHECK_MOVIE_EDIT + "/" + movie_id, function (response) {
        parseResponse(response);
        if (typeof responseArray.json.url != "undefined") {
            if (responseArray.json.url == "reload") {
                window.location = window.location
            } else {
                var _script;
                if (_script = responseArray.json.url.match(/^javascript:(.*)$/)) {
                    eval(_script[1])
                } else {
                    window.location = responseArray.json.url
                }
            }
        } else {
            if (responseArray.code == "0") {
                var html = "";
                html = responseArray.html;
                if (view_name == "school") {
                    jQuery("#OG_title").html(GT.gettext("Recover Animation"));
                    jQuery("#OG_content").html(html);
                    showOG()
                } else {
                    showHTMLBox(GT.gettext("Recover Animation"), 180, html, "autosave_dialog", undefined, true)
                }
                jQuery("#altime, #alatime").each(function () {
                    jQuery(this).html(autosaveTimeFormat(jQuery(this).html()))
                })
            } else {
                displayFeedback(responseArray.code + responseArray.json.error)
            }
        }
        resetResponse()
    })
}
function autosaveTimeFormat(D) {
    var C = convertTime(D);
    var B = new Date(D * 1000);
    var A = B.getFullYear();
    var E = C.indexOf(A);
    if (E > 0) {
        C = C.replace(A, A + "<br/>")
    }
    return C
}
function convertTime(E) {
    var C = new Date(E * 1000);
    var A = C.toLocaleString();
    var F = C.getTimezoneOffset();
    var D = A.indexOf("(");
    if (D > 0) {
        A = A.substring(0, D)
    }
    if (A.indexOf("GMT") < 0) {
        var B = Math.abs(F / 60);
        if (B < 10) {
            B = "0" + B
        }
        B = B + "00";
        if (F > 0) {
            A = A + " GMT-" + B
        } else {
            A = A + " GMT+" + B
        }
    }
    return A
}
function flagMovieCheck(A){
    showReportBox('Flag Movie', 125, 'Are you sure you want to flag this movie?<br/> Please review the  <a href="https://flashthemes.net/termsofuse">Terms of Use</a> before reporting; otherwise, please explain your report. (required)', `flagMovie("${A.toString()}", $("#reportTextBox").val())`)
}

function flagMovie(A, C) {
    $.ajax({
        type: "POST",
        url: URL_FLAG_MOVIE + "/" + A,
        data: { comment: C },
        success: function (B) {
            parseResponse(B);
            if (typeof responseArray.json.url != "undefined") {
                window.location = responseArray.json.url
            } else {
                if (responseArray.code == "0") {
                    displayFeedback(responseArray.code + GT.gettext("Video flagged as inappropriate"))
                } else {
                    displayFeedback(responseArray.code + responseArray.json.error)
                }
            }
            resetResponse()
        },
        error: function (H) {
            parseResponse(H.responseText);
            if(responseArray.json.error){
                displayFeedback(responseArray.code + responseArray.json.error)
            }else{
            displayFeedback("1" + GT.gettext("Error contacting the server"));
            }
        },
        failure: function () {
            displayFeedback("1" + GT.gettext("Error contacting the server"));
        }
    })
}
function deleteMovie(D, B, E, A) {
    if (B && E && A) {
        var F = jQuery("#" + E).html() - 0;
        var C = URL_DELETE_MOVIE + "/" + D + "/" + B// + "/" + F
    } else {
        var C = URL_DELETE_MOVIE + "/" + D
    }
    jQuery.post(C, function (H) {
        parseResponse(H);
        if (typeof responseArray.json.url != "undefined") {
            window.location = responseArray.json.url
        } else {
            if (responseArray.code == "0") {
                if(B == "0"){
                    displayFeedback(responseArray.code + GT.gettext("This video has successfully been moved to your trash."));
                }else{
                    displayFeedback(responseArray.code + GT.gettext(" Animation has been deleted"));
                }
                typeof addDelCount == "function" && addDelCount();
                if (B && E && A) {
                    $("#" + A).remove();
                }
            } else {
                displayFeedback(responseArray.code + responseArray.json.error)
            }
        }
        resetResponse()
    })
}

function undeleteMovie(D, B, E, A) {
    if (B && E && A) {
        var F = jQuery("#" + E).html() - 0;
        var C = URL_UNDELETE_MOVIE + "/" + D + "/" + B + "/" + F
    } else {
        var C = URL_UNDELETE_MOVIE + "/" + D
    }
    jQuery.post(C, function (H) {
        parseResponse(H);
        if (typeof responseArray.json.url != "undefined") {
            window.location = responseArray.json.url
        } else {
            if (responseArray.code == "0") {
                displayFeedback(responseArray.code + GT.gettext("This video has successfully been recovered."));
                typeof addMvCount == "function" && addMvCount();
                if (B && E && A) {
                    /*jQuery("#" + A).html(responseArray.html);
                    var G = jQuery.Event("delete");
                    G.hasNextPage = (responseArray.json.next_page == 1);
                    G.movieId = D;
                    jQuery("#" + A).trigger(G)*/
                    $("#" + A).remove();
                }
            } else {
                displayFeedback(responseArray.code + responseArray.json.error)
            }
        }
        resetResponse()
    })
}
function rejectMovie(B) {
    var C = "Are you sure you want to reject this video?";
    if (!confirm(C)) {
        return
    }
    var A = URL_REJECT_MOVIE + "/" + B;
    jQuery.post(A, function (D) {
        parseResponse(D);
        if (typeof responseArray.json.url != "undefined") {
            window.location = responseArray.json.url
        } else {
            if (responseArray.code == "0") {
                displayFeedback(responseArray.code + "Video has been rejected")
            } else {
                displayFeedback(responseArray.code + responseArray.json.error)
            }
        }
        resetResponse()
    })
}
function deleteFavorite(A, T = false) {
    showPleaseWait("Remove Recommendation", "200");
    $.ajax({
        type: "POST",
        url: URL_DELETE_FAVORITE,
        data: { movie_id: A },
        success: function (H) {
            parseResponse(H);
            if (responseArray.code == "0") {
                $("#unrecommend_button").parent().html(responseArray.json.html);
                if (T) {
                    movies[A]["recommendButton"] = responseArray.json.html
                }
                $('#recommend_' + responseArray.json.userId).remove();
                let recommendcount = Number($('#recommendcount').text().split(' Recommends')[0]);
                $('#recommendcount').text((recommendcount - 1) + ' Recommends');
                if (recommendcount - 1 == 0) {
                    $('#recommendcount').after(`<h4 id="norecommends">${GT.gettext("Nobody recommended this animation yet!")}</h4>`)
                }
                displayFeedback(responseArray.code + GT.gettext("Video has been removed from your recommendations"));
            } else {
                displayFeedback(responseArray.code + responseArray.json.error)
            }
            resetResponse()
            hidePleaseWait()
        },
        error: function () {
            displayFeedback("1" + GT.gettext("Error contacting the server"));
            hidePleaseWait()
        },
        failure: function () {
            displayFeedback("1" + GT.gettext("Error contacting the server"));
            hidePleaseWait()
        }
    })
}
function recommendMovie(A, T = false) {
    showPleaseWait("Recommend Video", "200");
    $.ajax({
        type: "POST",
        url: URL_RECOMMEND,
        data: { movie_id: A },
        success: function (H) {
            parseResponse(H);
            if (responseArray.code == 0) {
                $("#recommend_button").parent().html(responseArray.json.html);
                if (T) {
                    movies[A]["recommendButton"] = responseArray.json.html
                }
                let recommendcount = Number($('#recommendcount').text().split(' Recommends')[0]);
                $('#recommendcount').text((recommendcount + 1) + ' Recommends');
                $('#recommendcount').after(responseArray.json.user)
                if ($('#norecommends').length > 0) {
                    $('#norecommends').remove();
                }
                displayFeedback(responseArray.code + GT.gettext("Animation added to your recommendations"));
            } else {
                displayFeedback("1" + responseArray.json.error)
            }
            resetResponse()
            hidePleaseWait()
        },
        error: function () {
            displayFeedback("1" + GT.gettext("Error contacting the server"));
            hidePleaseWait()
        },
        failure: function () {
            displayFeedback("1" + GT.gettext("Error contacting the server"));
            hidePleaseWait()
        }
    })
}
function copyMovie(B, A) {
    var C = "This movie was not created on this site.\nAre you sure to copy it to this site?";
    if (confirm(C)) {
        checkCopyMovie(B, A)
    }
}
function editMovie(A) {
    var B = "To edit this movie, you are about to leave this site.\nDo you want to continue?";
    if (confirm(B)) {
        location.href = A
    }
}
function staffpicksMovie(A, L) {
    if (L == 1) {
        var B = "Are you sure to Staffpicks this video?";
    } else {
        var B = "Are you sure to remove this video from Staffpicks?";
    }
    if (!confirm(B)) {
        return
    }
    $.ajax({
        type: "POST",
        url: URL_STAFFPICKS_MOVIE,
        data: {
            id: A,
            status: L
        },
        success: function (C) {
            parseResponse(C);
            if (typeof responseArray.json.url != "undefined") {
                window.location = responseArray.json.url
            } else {
                if (responseArray.code == "0") {
                    if (L == 1) {
                        displayFeedback(responseArray.code + "The video has been added to Staffpicks")
                    } else {
                        displayFeedback(responseArray.code + "The video has been removed from Staffpicks")
                    }

                } else {
                    displayFeedback(responseArray.code + responseArray.json.error)
                }
            }
            resetResponse()
        }
    })
}
function hideMovie(A, L) {
    if (L == 1) {
        var B = "Are you sure to hide this video?";
    } else {
        var B = "Are you sure to unhide this video?";
    }
    if (!confirm(B)) {
        return
    }
    $.ajax({
        type: "POST",
        url: URL_HIDE_MOVIE,
        data: {
            id: A,
            status: L
        },
        success: function (C) {
            parseResponse(C);
            if (typeof responseArray.json.url != "undefined") {
                window.location = responseArray.json.url
            } else {
                if (responseArray.code == "0") {
                    if (L == 1) {
                        displayFeedback(responseArray.code + "The video has been hidden")
                    } else {
                        displayFeedback(responseArray.code + "The video has been unhidden")
                    }

                } else {
                    displayFeedback(responseArray.code + responseArray.json.error)
                }
            }
            resetResponse()
        }
    })
}
function addBestAnimation(A) {
    var B = "Are you sure to add this video as one of the best animations?";
    if (!confirm(B)) {
        return
    }
    jQuery.post(URL_ADD_BEST_ANIMATION + "/" + A, function (C) {
        parseResponse(C);
        if (typeof responseArray.json.url != "undefined") {
            window.location = responseArray.json.url
        } else {
            if (responseArray.code == "0") {
                displayFeedback(responseArray.code + "The video is one of the best animations now")
            } else {
                displayFeedback(responseArray.code + responseArray.json.error)
            }
        }
        resetResponse()
    })
}
function featureAnimation(A) {
    var B = "Are you sure to feature this video?";
    if (!confirm(B)) {
        return
    }
    jQuery.post(URL_ADD_FEATUED_ANIMATION + "/" + A, function (C) {
        parseResponse(C);
        if (typeof responseArray.json.url != "undefined") {
            window.location = responseArray.json.url
        } else {
            if (responseArray.code == "0") {
                displayFeedback(responseArray.code + "The video has been added as featured animation")
            } else {
                displayFeedback(responseArray.code + responseArray.json.error)
            }
        }
        resetResponse()
    })
}
function registerMoviePublishStatusHistory(B, A) {
    _publishStatusHistory[B] = A
}
function getMoviePublishStatusHistory(A) {
    if (!_publishStatusHistory[A]) {
        return null
    }
    return _publishStatusHistory[A]
}
function registerMoviePshareStatusHistory(B, A) {
    _pshareStatusHistory[B] = A
}
function getMoviePshareStatusHistory(A) {
    if (!_pshareStatusHistory[A]) {
        return null
    }
    return _pshareStatusHistory[A]
}
function updateMovieStatus(F, H, G, E, B, D, A) {
    var C;
    switch (F) {
        case "copy":
            C = URL_SET_COPYABLE + "/" + E + "/" + B;
            break;
        case "publish":
            C = URL_SET_PUBLISHED + "/" + E + "/" + B;
            break;
        case "pshare":
            C = URL_SET_PRIVATE_SHARE + "/" + E + "/" + B;
            break;
        case "pshareteacher":
            C = URL_SET_PRIVATE_SHARE_FOR_SCHOOL + "/" + E + "/" + B;
            break;
        case "publishpshare":
            C = URL_SET_PUBLISHED_PSHARE + "/" + E + "/" + B;
            break
    }
    $.ajax({
        type: "POST",
        url: C,
        timeout: 50000,
        success: function (L) {
            var I = L;
            parseResponse(I);
            if (typeof responseArray.json.url != "undefined") {
                window.location = responseArray.json.url
            } else {
                if (responseArray.code == "0") {
                    if ($("movie_thumb_" + E).length > 0) {
                        $("movie_thumb_" + E).src = "/static/go/img/v2/" + D + "_overlay.gif"
                    } else {
                        if (F != "copy" && $("#animation_" + E)) {
                            var K = jQuery("#animation_" + E);
                            var J = ["public", "private", "draft", "processing", "hidden"].filter(function (N, M, O) {
                                return K.hasClass(N)
                            })[0];
                            K.trigger("updateMovieStatus", [J, D])
                        }
                    }
                    if ($(H)) {
                        //  $(H).show()
                    }
                    if ($(G)) {
                        // $(G).hide()
                    }
                    if (F == "pshare") {
                        registerMoviePshareStatusHistory(E, B);
                        /*if (B == "1") {
                            if ($(A)) {
                                $(A).triggerPshareStatusChange(E, true)
                            }
                        } else {
                            if ($(A)) {
                                $(A).triggerPshareStatusChange(E, false)
                            }
                        }*/
                    }
                    if (F == "publish") {
                        registerMoviePublishStatusHistory(E, B);
                        /*if (B == "1") {
                            if ($(A)) {
                                $(A).triggerPublishStatusChange(E, true)
                            }
                        } else {
                            if ($(A)) {
                                $(A).triggerPublishStatusChange(E, false)
                            }
                        }*/
                    }
                    if (F == "publishpshare") {
                        registerMoviePshareStatusHistory(E, B);
                        registerMoviePublishStatusHistory(E, B);
                        /*if (B == "1") {
                            if ($(A)) {
                                $(A).triggerPshareStatusChange(E, false);
                                $(A).triggerPublishStatusChange(E, true)
                            }
                        } else {
                            if ($(A)) {
                                $(A).triggerPublishStatusChange(E, false);
                                $(A).triggerPshareStatusChange(E, true)
                            }
                        }*/
                    }
                } else {
                    displayFeedback(responseArray.code + responseArray.json.error)
                }
            }
            resetResponse()
        },
        error: function (data) {
            displayFeedback("1" + GT.gettext("Error occurred, please try again later."));
            return false;
        },
        processData: false,
        contentType: false,
    });
}
function updatePrivateSharing(A, B, C) {
    if (C) {
        jQuery("#" + C).toggle(!A)
    }
    if (B) {
        jQuery("#" + B).toggle(!!A)
    }
}
function setPrivateSharing(A) {
    is_private_sharing = A;
    return
}
function publishToLessonGallery(C, A, G, F, D) {
    var E = {};
    var B = URL_SET_PUBLISHED + "/" + C + "/" + A;
    var D = D || "";
    if (D) {
        E.category = D
    }
    jQuery.post(B, E, function (H) {
        parseResponse(H);
        if (responseArray.code == "0") {
            jQuery("#" + G).show();
            jQuery("#" + F).hide();
            if (jQuery("#movie_select_category").length) {
                jQuery.unblockUI()
            }
            displayFeedback("0This movie has published to Lesson Gallery")
        } else {
            if (!responseArray.json.select_category) {
                displayFeedback(responseArray.code + "Error")
            } else {
                if (jQuery("#movie_select_category").length == 0) {
                    jQuery("body").append(responseArray.html)
                }
                jQuery.blockUI({
                    message: jQuery("#movie_select_category"),
                    css: {
                        padding: 0,
                        margin: 0,
                        width: "auto",
                        top: "250px",
                        left: "40%",
                        textAlign: "center",
                        color: "#000",
                        border: "none",
                        backgroundColor: "transparent",
                        cursor: "auto"
                    },
                    overlayCSS: {
                        cursor: "auto"
                    }
                })
            }
        }
    })
}
function checkCopyMovie(A, confirm = false) {
    $.ajax({
        type: "POST",
        url: URL_CHECK_MOVIE_COPY + "/" + A,
        data: { confirm },
        success: function (C) {
            parseResponse(C);
            if (responseArray.json.error) {
                displayFeedback('1' + responseArray.json.error);
            }
            else if (responseArray.json.free == "true") {
                showPleaseWait("Copy Video", "200");
                location.href = responseArray.json.redirect;
                hidePleaseWait();
            } else {
                if (responseArray.json.redirect) {
                    location.href = responseArray.json.redirect
                } else {
                    //var D = GT.gettext("This animation contains premium character(s)\nThe cost to copy this movie is:\n");
                    var D = GT.gettext('The cost to copy this movie is:\n') + responseArray.json.money_points + " FlashTokens.";
                    if (responseArray.json.notenoughpoints == "true") {
                        D = D + "\n\n" + GT.gettext("You do not have sufficient points to copy this animation.");
                        showConfirmBox('Copy Video', 125, D);
                    } else {
                        D = D + "\n\n" + GT.gettext("Would you like to buy it?");
                    }
                    var D = showConfirmBox('Copy Video', 125, D, `checkCopyMovie('${A}', true)`);
                }
            }
            resetResponse()
        },
        error: function () {
            displayFeedback("1" + GT.gettext("Error contacting the server"));
            hidePleaseWait()
        },
        failure: function () {
            displayFeedback("1" + GT.gettext("Error contacting the server"));
            hidePleaseWait()
        }
    })

}
function toggleGigya() {
    jQuery("#divWildfirePost").toggle()
}
function toggleUserStats() {
    showHideContent("1");
    $("toggleLink").writeAttribute("expanded", 1 - ($("toggleLink").readAttribute("expanded") || "0"));
    if ($("toggleLink").readAttribute("expanded") == "1") {
        $("toggleLink").innerHTML = GT.gettext("minimize");
        $("short_description").hide();
        $("join_date").style.display = "block";
        $("userstats").style.height = "55px"
    } else {
        $("toggleLink").innerHTML = GT.gettext("more");
        $("join_date").style.display = "none";
        $("short_description").show();
        $("userstats").style.height = "27px"
    }
}
function handleFacebookLike(A) {
    pageTracker._trackPageview("/pageTracker/ajax/fbLike");
    jQuery("#recommend_button").trigger("click")
}
function handleFacebookShare(B, A) {
    FB.ui({
        method: "feed",
        link: B
    })
}
function getMovieFBMLShareOverlay(A) {
    if (!jQuery("#movie_fbml_share_overlay").length) {
        jQuery.get("/ajax/getMovieFBMLShareOverlay/" + A, function (B) {
            parseResponse(B);
            if (responseArray.code == "0") {
                document.getElementById("offer_container").innerHTML = responseArray.html;
                FB.XFBML.parse(document.getElementById("movie_fbml_share_overlay"));
                showOfferOverlay(jQuery("#movie_fbml_share_overlay"))
            } else {
                displayFeedback("1" + responseArray.error)
            }
        })
    } else {
        FB.XFBML.parse(document.getElementById("movie_fbml_share_overlay"));
        showOfferOverlay(jQuery("#movie_fbml_share_overlay"))
    }
}
function getMovieYoutubeExportOverlay(A, B) {
    B = (!B) ? "0" : "1";
    jQuery.get("/ajax/getMovieYoutubeExportOverlay/" + A + "/" + B, function (C) {
        parseResponse(C);
        if (responseArray.code == "0") {
            var D = jQuery("#movie_youtube_export_overlay");
            if (D.length) {
                D.replaceWith(responseArray.html)
            } else {
                jQuery("body").append(responseArray.html);
                jQuery("#youtube_export_public,#youtube_export_private").live("click", function () {
                    window.open(jQuery(this).attr("href"), "_ga_youtube_export", "toolbar=no,status=no,height=500,width=960")
                })
            }
            showOfferOverlay(jQuery("#movie_youtube_export_overlay"))
        } else {
            displayFeedback("1" + responseArray.json.error)
        }
    })
}
function embedMovieInfo(A) {
    jQuery.post("/ajax/getMovieEmbedInfo/" + A, function (B) {
        showOverlay(B, {
            top: "200px"
        })
    })
}
function setMovieTitlePrefix(B) {
    if (typeof MOVIE_TITLE === "undefined" || typeof MOVIE_USERNAME === "undefined" || typeof MOVIE_TITLE_PREFIX === "undefined") {
        return false
    }
    var E = MOVIE_TITLE + " - " + MOVIE_USERNAME;
    var D = MOVIE_TITLE_PREFIX;
    var C = prompt("Enter title prefix for this movie", D);
    if (C != null && C != D) {
        var A = URL_SET_TITLE_PREFIX + "/" + B;
        jQuery.post(A, {
            prefix: C
        }, function (F) {
            parseResponse(F);
            if (responseArray.code == "0") {
                displayFeedback(responseArray.code + "Title prefix has been updated.");
                MOVIE_TITLE_PREFIX = C;
                document.title = (C != "") ? C + " - " + E : E
            } else {
                displayFeedback(responseArray.code + responseArray.json.error)
            }
            resetResponse()
        })
    }
};