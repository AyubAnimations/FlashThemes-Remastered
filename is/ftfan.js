var URL_BECOME_FAN = "/ajax/becomeFan";
var URL_REFRESH_FANS = "/ajax/refreshFans";
var URL_GET_FANS = "/ajax/getFans";
var URL_GET_FRIENDS = "/ajax/getFriends";
var URL_GET_IDOLS = "/ajax/getIdols";
var URL_GET_COMMENTS = "/ajax/getComments";
var URL_GET_USERFEED = "/ajax/getUserFeed";
var URL_GET_LATESTANIM = "/ajax/latestMovies";
var URL_GET_USERLATESTANIM = "/ajax/userProfileRecentMovies";
var URL_GET_USERRECOMMEND = "/ajax/profile_recommend";
var URL_REMOVE_IDOL = "/ajax/removeIdol"
var URL_FLAG_USER = "/ajax/flagUser"
var URL_GET_MOVIES = {};
URL_GET_MOVIES["risingstars"] = "/ajax/risingStarsMovies";
URL_GET_MOVIES["topscored"] = "/ajax/topScoredMovies";
URL_GET_MOVIES["mostcommented"] = "/ajax/mostCommentedMovies";
URL_GET_MOVIES["mostwatched"] = "/ajax/mostWatchedMovies";
URL_GET_MOVIES["latest"] = "/ajax/latestMovies";
URL_GET_MOVIES["staffpicks"] = "/ajax/staffPicksMovies";
URL_GET_MOVIES["mostrecommended"] = "/ajax/mostRecommendedMovies";
URL_GET_MOVIES["searchresults"] = "/ajax/searchresults";
URL_GET_MOVIES["tags"] = "/ajax/tags";
var URL_GET_USERS = {};
URL_GET_USERS["mostviewed"] = "/ajax/mostViewedUsers";
URL_GET_USERS["mostanimations"] = "/ajax/mostAnimationsUsers";
URL_GET_USERS["mostrecent"] = "/ajax/mostRecentUsers";
URL_GET_USERS["mostfans"] = "/ajax/mostFansUsers";
URL_GET_USERS["searchresults"] = "/ajax/searchresults";
var URL_ADD_FRIEND = "/ajax/addfriend";
var URL_REMOVE_FRIEND = "/ajax/removefriend";
var URL_GET_SHOPASSETS = {};
URL_GET_SHOPASSETS["mostbought"] = "/ajax/mostBoughtShopAssets";
URL_GET_SHOPASSETS["mostrecommended"] = "/ajax/mostRecommendedAssets";
URL_GET_SHOPASSETS["mostcommented"] = "/ajax/mostCommentedAssets"
URL_GET_SHOPASSETS["latest"] = "/ajax/latestShopAssets";
URL_GET_SHOPASSETS["searchresults"] = "/ajax/searchresults";

function refreshFans(B) {
    if (typeof B != "undefined") {
        $.ajax({
            type: "POST",
            url: URL_REFRESH_FANS + "/" + B,
            success: function (G) {
                parseResponse(G);
                $("#fansreplace").replaceWith(responseArray.html);
            },
            error: function () {
                displayFeedback("1Error contacting the server");
                hidePleaseWait();
            },
            failure: function () {
                displayFeedback("1Error contacting the server");
                hidePleaseWait()
            }
        })
    }
}

function becomeFan(B, s) {
    if (typeof s === "undefined") {
        s = false;
    }
    showPleaseWait(GT.gettext("Become a Fan"), "200");
    if (typeof B != "undefined") {
        $.ajax({
            type: "POST",
            url: URL_BECOME_FAN + "/" + B,
            success: function (G) {
                becomeFanComplete(G, B, s)
            },
            error: function () {
                displayFeedback("1Error contacting the server");
                hidePleaseWait();
            },
            failure: function () {
                displayFeedback("1Error contacting the server");
                hidePleaseWait()
            }
        })
    }
}

function becomeFanComplete(C, B, s) {
    parseResponse(C);
    if (typeof responseArray.json.url != "undefined") {
        window.location = responseArray.json.url
    } else {
        if (responseArray.code == "0") {
            hidePleaseWait();
            displayFeedback(responseArray.code + GT.gettext("You are now a fan of this animator"));
            refreshFans(B);
            $("#actionbuttons").replaceWith(responseArray.html);
        } else {
            if (responseArray.code == "1") {
                hidePleaseWait();
                displayFeedback(responseArray.code + GT.gettext("Error occurred, please try again later."))
            } else {
                hidePleaseWait();
                displayFeedback(responseArray.code + responseArray.json.error)
            }
        }
    }
    resetResponse()
}

function removeIdol(d, s) {
    if (typeof s === "undefined") {
        s = false;
    }
    showPleaseWait("Remove Fan", "200");
    $.ajax({
        type: "POST",
        url: URL_REMOVE_IDOL + "/" + d,
        success: function (g) {
            parseResponse(g);
            if (responseArray.code != "0") {
                displayFeedback(responseArray.code + responseArray.json.error)
            } else {
                displayFeedback(responseArray.code + GT.gettext("You are no longer a fan of this user"));
                refreshFans(d);
                $("#actionbuttons").replaceWith(responseArray.html);
            }
            resetResponse()
            hidePleaseWait()
        },
        error: function () {
            displayFeedback("1Error contacting the server")
            hidePleaseWait()
        },
        failure: function () {
            displayFeedback("1Error contacting the server")
            hidePleaseWait()
        }
    });
}

function addFriend(A) {
    showPleaseWait("Add Friend", "200");
    if (typeof A != undefined) {
        $.ajax({
            type: "POST",
            url: URL_ADD_FRIEND + "/" + A,
            success: function (F) {
                addFriendComplete(F, A)
            },
            error: function () {
                displayFeedback("1Error contacting the server")
                hidePleaseWait()
            },
            failure: function () {
                displayFeedback("1Error contacting the server");
                hidePleaseWait()
            }
        })
    }
}

function addFriendComplete(A, B) {
    parseResponse(A);
    if (typeof responseArray.json.url != "undefined") {
        window.location = responseArray.json.url
    } else {
        if (responseArray.code == "0") {
            if ($(responseArray.html).find('#removefriend').text() == "Pending") {
                displayFeedback(responseArray.code + GT.gettext("Friend request sent"));
            } else if ($(responseArray.html).find('#removefriend').text() == GT.gettext("Remove Friend")) {
                displayFeedback(responseArray.code + "Friend request accepted");
            }
            refreshFans(B);
            $("#actionbuttons").replaceWith(responseArray.html);
        } else {
            if (responseArray.code == "1") {
                displayFeedback(responseArray.code + GT.gettext("Error occurred, please try again later."))
            } else {
                displayFeedback(responseArray.code + responseArray.json.error)
            }
        }
    }
    hidePleaseWait();
    resetResponse()
}

function removeFriend(A) {
    showPleaseWait(GT.gettext("Remove Friend"), "200");
    if (typeof A != "undefined") {
        $.ajax({
            type: "POST",
            url: URL_REMOVE_FRIEND + "/" + A,
            success: function (D) {
                removeFriendComplete(D, A)
            },
            error: function () {
                displayFeedback("1Error contacting the server")
                hidePleaseWait()
            },
            failure: function () {
                displayFeedback("1Error contacting the server");
                hidePleaseWait()
            }
        })
    }
}

function removeFriendComplete(A, B) {
    parseResponse(A);
    if (typeof responseArray.json.url != "undefined") {
        window.location = responseArray.json.url
    } else {
        if (responseArray.code == "0") {
            displayFeedback(responseArray.code + GT.gettext("You are no longer a friend of this animator"));
            refreshFans(B);
            $("#actionbuttons").replaceWith(responseArray.html);
        } else {
            if (responseArray.code == "1") {
                displayFeedback(responseArray.code + GT.gettext("Error occurred, please try again later."))
            } else {
                displayFeedback(responseArray.code + responseArray.json.error)
            }
        }
    }
    hidePleaseWait();
    resetResponse()
}

function loadFansOrIdols(D) {
    var E = D.split(",");
    var C = E[0];
    var G = E[1];
    var I = E[2];
    var F = E[3];
    var H = E[4];
    var J = E[5];
    var B = E[6];
    var K = E[7];
    var A;
    switch (I) {
        case "fan":
            A = URL_GET_FANS + "/" + G + "/" + F + "/" + H;
            break;
        case "idol":
            A = URL_GET_IDOLS + "/" + G + "/" + F + "/" + H;
            break
    }
    new Ajax.Request(A, {
        method: "post",
        onSuccess: function (M) {
            var L = M.responseText;
            fanPagingComplete(L, C, H, J, B, K, G, I, F)
        },
        onFailure: function () {
            displayFeedback("1Error contacting the server")
        }
    })
}

function flagUserCheck(A) {
    showReportBox('Flag User', 125, 'Are you sure you want to flag this user?\n Please explain why. (required)', 'flagUser("' + A.toString() + '", $("#reportTextBox").val())')
}

function flagUser(A, C) {
    $.ajax({
        type: "POST",
        url: URL_FLAG_USER + "/" + A,
        data: { comment: C },
        success: function (B) {
            parseResponse(B);
            if (typeof responseArray.json.url != "undefined") {
                window.location = responseArray.json.url
            } else {
                if (responseArray.code == "0") {
                    displayFeedback(responseArray.code + GT.gettext("User flagged as inappropriate"))
                } else {
                    displayFeedback(responseArray.code + responseArray.json.error)
                }
            }
            resetResponse()
        },
        error: function (H) {
            parseResponse(H.responseText);
            if (responseArray.json.error) {
                displayFeedback(responseArray.code + responseArray.json.error)
            } else {
                displayFeedback("1" + GT.gettext("Error contacting the server"));
            }
        },
        failure: function () {
            displayFeedback("1" + GT.gettext("Error contacting the server"));
        }
    })
}

function fanPagingComplete(D, A, G, I, B, J, E, H, C, F, O, S, CID, type, theme) {
    parseResponse(D);
    if (typeof O === "undefined") {
        O = false;
    }
    if (responseArray.code == "0") {
        if (CID !== 'false') {
            if (typeof B != "undefined" && typeof J != "undefined") {
                if (F != undefined) {
                    if (responseArray.json.next_page == 0) {
                        $('#' + J).addClass("load_more_disabled")
                        $('#' + J).removeClass("load_more_enabled")
                        $('#' + J).children().attr("href", "javascript:;")
                    } else {
                        $('#' + J).removeClass("load_more_disabled")
                        $('#' + J).addClass("load_more_enabled")
                    }
                    if (type === 'init') {
                        $('#' + A).html(responseArray.html);
                    } else {
                        $('#' + A).append(responseArray.html);
                    }
                    $('#' + I).html(G);
                }
            }
        } else {
            $('#' + A).html(responseArray.html);
            $('#' + I).html(G);
            //O, theme
            if (typeof B != "undefined" && typeof J != "undefined") {
                if (F != undefined) {
                    if (typeof search != "undefined") {
                        $('#' + B).html("<a href=\"javascript:loadAnotherPage('" + A + "','" + E + "','" + H + "'," + C + ",'" + I + "','" + B + "','" + J + "','prev', '" + F + "','" + S + "', false, lang);\">" + GT.gettext("Previous") + "</a>");
                        $('#' + J).html("<a href=\"javascript:loadAnotherPage('" + A + "','" + E + "','" + H + "'," + C + ",'" + I + "','" + B + "','" + J + "','next', '" + F + "','" + S + "', false, lang);\">" + GT.gettext("Next") + "</a>")
                    } else {
                        $('#' + B).html("<a href=\"javascript:loadAnotherPage('" + A + "','" + E + "','" + H + "'," + C + ",'" + I + "','" + B + "','" + J + "','prev', '" + F + "','" + S + "','" + O + "','" + theme + "');\">" + GT.gettext("Previous") + "</a>");
                        $('#' + J).html("<a href=\"javascript:loadAnotherPage('" + A + "','" + E + "','" + H + "'," + C + ",'" + I + "','" + B + "','" + J + "','next', '" + F + "','" + S + "','" + O + "','" + theme + "');\">" + GT.gettext("Next") + "</a>")
                    }
                } else {
                    if (typeof search != "undefined") {
                        $('#' + B).html("<a href=\"javascript:loadAnotherPage('" + A + "','" + E + "','" + H + "'," + C + ",'" + I + "','" + B + "','" + J + "','prev');\">" + GT.gettext("Previous") + "</a>");
                        $('#' + J).html("<a href=\"javascript:loadAnotherPage('" + A + "','" + E + "','" + H + "'," + C + ",'" + I + "','" + B + "','" + J + "','next');\">" + GT.gettext("Next") + "</a>")
                    } else {
                        $('#' + B).html("<a href=\"javascript:loadAnotherPage('" + A + "','" + E + "','" + H + "'," + C + ",'" + I + "','" + B + "','" + J + "','prev');\">" + GT.gettext("Previous") + "</a>");
                        $('#' + J).html("<a href=\"javascript:loadAnotherPage('" + A + "','" + E + "','" + H + "'," + C + ",'" + I + "','" + B + "','" + J + "','next');\">" + GT.gettext("Next") + "</a>")
                    }
                }
            }
            if (O == "movie" || O == false) {
                if ($("#movieDiv").length) {
                    $("#movieDiv").addClass("active");
                }
            } else {
                if ($("#movieDiv").length) {
                    $("#movieDiv").removeClass("active");
                }
            }

            if (O == "assets") {
                if ($("#assetDiv").length) {
                    $("#assetDiv").addClass("active");
                }
            } else {
                if ($("#assetDiv").length) {
                    $("#assetDiv").removeClass("active");
                }
            }
            if (S == "true") {
                if ($('.' + A).parent().find('#loading').length) {
                    $('.' + A).parent().find('#loading').removeClass("loading-active")
                }
            }
            if (E == "all") {
                if ($("#allTimediv").length) {
                    $("#allTimediv").addClass("active");
                }
            } else {
                if ($("#allTimediv").length) {
                    $("#allTimediv").removeClass("active");
                }
            }
            if (E == 30) {
                if ($("#last30daysdiv").length) {
                    $("#last30daysdiv").addClass("active");
                }
            } else {
                if ($("#last30daysdiv").length) {
                    $("#last30daysdiv").removeClass("active");
                }
            }
            if (E == 7) {
                if ($("#last7daysdiv").length) {
                    $("#last7daysdiv").addClass("active");
                }
            } else {
                if ($("#last7daysdiv").length) {
                    $("#last7daysdiv").removeClass("active");
                }
            }
            if (G <= 0) {
                $('#' + B).addClass("disablednav")
                $('#' + B).children().attr("href", "javascript:;")
            } else {
                $('#' + B).removeClass("disablednav")
                $('#' + B).css("display", "inline")
            }
            if (responseArray.json.next_page == 0) {
                $('#' + J).addClass("disablednav")
                $('#' + J).children().attr("href", "javascript:;")
            } else {
                $('#' + J).removeClass("disablednav")
                $('#' + J).css("display", "inline")
            }
            if (H == "userfeed-owner" || H == "userfeed-others") {
                uploadFeedBlock("feedsmain");
                if (H == "userfeed-owner") {
                    if (F == undefined || F == "all") {
                        $("#idolanilink").hide();
                        $("#idolfeedlink").show()
                    } else {
                        $("#idolfeedlink").hide();
                        $("#idolanilink").show()
                    }
                } else {
                    if (F == undefined || F == "all") {
                        $("#myanilink").hide();
                        $("#myfeedlink").show()
                    } else {
                        $("#myfeedlink").hide();
                        $("#myanilink").show()
                    }
                }
            }
            if (H == "messages" && G == 0) {
                $("#message_textarea_container").show();
            } else if (H == "messages" && G != 0) {
                $("#message_textarea_container").hide();
            }
            if (H == "idol" || H == "fan" || H == "friend") {
                $('#friend_block').trigger('statusChange', ['change']);
            }
        }
    } else {
        displayFeedback(responseArray.code + responseArray.json.error)
    }
    resetResponse()
}

function loadAnotherPage(B, F, I, E, J, C, K, D, G, S, O, Q, CID) {
    if (typeof S === "undefined") {
        S = "false";
    }
    if (typeof O === "undefined") {
        O = false;
    }
    if (typeof Q === "undefined") {
        Q = "all";
    }
    if (typeof CID === "undefined") {
        CID = "false";
    }

    if (CID === 'false') {
        $('#' + B).children().remove();
    }
    if ($('#' + B).parent().find('#loading').length) {
        $('#' + B).parent().find('#loading').addClass("loading-active")
    }
    if (typeof lang != "undefined") {
        if (lang !== "all") {
            Q = lang;
        }
    }
    var H = $('#' + J).text() - 0;
    if (D == "init") {
        H = 0;
    }
    else if (D == "next") {
        H = H + 1;
    } else if (D == "prev") {
        if (H !== 0) {
            H = H - 1;
        }
    }
    var A;
    switch (I) {
        case "fan":
            A = URL_GET_FANS + "/" + F + "/" + E + "/" + H + "/" + G;
            break;
        case "friend":
            A = URL_GET_FRIENDS + "/" + F + "/" + E + "/" + H + "/" + G;
            break;
        case "idol":
            A = URL_GET_IDOLS + "/" + F + "/" + E + "/" + H + "/" + G;
            break;
        case "usercomment":
            A = URL_GET_COMMENTS + "/user/" + F + "/" + E + "/" + H;
            break;
        case "moviecomment":
            A = URL_GET_COMMENTS + "/movie/" + F + "/" + E + "/" + H;
            break;
        case "broadcast":
            A = URL_GET_COMMENTS + "/broadcast/" + F + "/" + E + "/" + H;
            break;
        case "system":
            A = URL_GET_COMMENTS + "/system/" + F + "/" + E + "/" + H;
            break;
        case "messages":
            A = URL_GET_COMMENTS + "/messages/" + F + "/" + E + "/" + H;
            break;
        case "moviecommentreply":
            A = URL_GET_COMMENTS + "/movie/" + F + "/" + E + "/" + H + "/" + CID;
            break;
        case "userfeed-owner":
            if (G == undefined) {
                A = URL_GET_USERFEED + "/" + F + "/owner/" + E + "/" + H + "/all/0"
            } else {
                A = URL_GET_USERFEED + "/" + F + "/owner/" + E + "/" + H + "/" + G + "/0"
            }
            B = "feedsmain";
            break;
        case "userfeed-others":
            if (G == undefined) {
                A = URL_GET_USERFEED + "/" + F + "/others/" + E + "/" + H + "/all/0"
            } else {
                A = URL_GET_USERFEED + "/" + F + "/others/" + E + "/" + H + "/" + G + "/0"
            }
            B = "feedsmain";
            break;
        case "user-latestanim":
            A = URL_GET_USERLATESTANIM + "/" + F + "/" + H
            break;
        case "user-recommend":
            A = URL_GET_USERRECOMMEND + "/" + F + "/" + H + '/' + S + '/' + O
            break;
        case "movies":
            if (G == "searchresults") {
                A = URL_GET_MOVIES[G] + "/" + I + "/" + E + "/" + H + "/" + F + "/" + Q + "?search=" + S
            } else {
                A = URL_GET_MOVIES[G] + "/" + E + "/" + H + "/" + F + "/" + S + "/" + Q
            }
            break;
        case "users":
            if (G == "searchresults") {
                A = URL_GET_USERS[G] + "/" + I + "/" + E + "/" + H + "/" + F + "/" + Q + "?search=" + S
            } else {
                A = URL_GET_USERS[G] + "/" + E + "/" + H + "/" + F + "/false"
            }
            break;
        case "shopassets":
            if (G == "searchresults") {
                A = URL_GET_SHOPASSETS[G] + "/" + I + "/" + E + "/" + H + "/" + F + "/" + (O || "all") + "/" + (Q || "all") + "?search=" + S;
            } else {
                A = URL_GET_SHOPASSETS[G] + "/" + E + "/" + H + "/" + F + "/" + S + "/" + (O || "all") + "/" + (Q || "all");
            }
            break;
    }
    $.ajax({
        type: "POST",
        url: A,
        success: function (M) {
            fanPagingComplete(M, B, H, J, C, K, F, I, E, G, O, S, CID, D, Q)
        },
        error: function () {
            displayFeedback("1Error contacting the server")
        }
    })
}

function switchTheme(B) {
    if ($("#filter_" + B).hasClass("active")) {
        return
    }
    var searchParams = new URLSearchParams(window.location.search);
    searchParams.set("themeFilter", B);
    window.location.search = searchParams.toString();
};
function switchType(B) {
    if ($("#filter_" + B).hasClass("active")) {
        return
    }
    var searchParams = new URLSearchParams(window.location.search);
    searchParams.set("typeFilter", B);
    window.location.search = searchParams.toString();
};

function loadMyOrIdolsFeeds(D, J) {
    var E = D.split(",");
    var C = E[0];
    var G = E[1];
    var M = E[2];
    var F = E[3];
    var K = E[4];
    var L = E[5];
    var B = E[6];
    var N = E[7];
    var H = undefined;
    if (E.length > 8) {
        H = E[8]
    }
    var I = (J || typeof J == "undefined") ? "1" : "0";
    var A;
    if (M == "owner") {
        if (H != undefined) {
            if (H == "all") {
                A = URL_GET_USERFEED + "/" + G + "/owner/" + F + "/" + K + "/all/" + I
            } else {
                A = URL_GET_USERFEED + "/" + G + "/owner/" + F + "/" + K + "/animationonly/" + I
            }
        } else {
            A = URL_GET_USERFEED + "/" + G + "/owner/" + F + "/" + K + "/all/" + I
        }
    } else {
        if (M == "others") {
            if (H != undefined) {
                if (H == "all") {
                    A = URL_GET_USERFEED + "/" + G + "/others/" + F + "/" + K + "/all/" + I
                } else {
                    A = URL_GET_USERFEED + "/" + G + "/others/" + F + "/" + K + "/animationonly/" + I
                }
            } else {
                A = URL_GET_USERFEED + "/" + G + "/others/" + F + "/" + K + "/all/" + I
            }
        }
    }
    new Ajax.Request(A, {
        method: "post",
        onSuccess: function (P) {
            var O = P.responseText;
            fanPagingComplete(O, C, K, L, B, N, G, "userfeed-" + M, F, H)
        },
        onFailure: function () {
            displayFeedback("1Error contacting the server")
        }
    })
};