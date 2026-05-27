var URL_STAFFPICKS_USER = "/ajax/addStaffpicksUser";
var URL_BETA_USER = "/ajax/addBetaUser";
var URL_BLACKLIST_USER = "/ajax/addBlacklistUser";
var URL_REMOVE_IDOL = "/ajax/removeIdol";
var URL_GET_STATEMENT = "/ajax/getStatement";

function staffpicksUser(a) {
    var b = "Are you sure to Staffpicks this user?";
    if (!confirm(b)) {
        return
    }
    jQuery.post(URL_STAFFPICKS_USER + "/" + a, function(c) {
        parseResponse(c);
        if (typeof responseArray.json.url != "undefined") {
            window.location = responseArray.json.url
        } else {
            if (responseArray.code == "0") {
                displayFeedback(responseArray.code + "The user is now the Staffpicks user")
            } else {
                displayFeedback(responseArray.code + responseArray.json.error)
            }
        }
        resetResponse()
    })
}

function promoteBetaUser(a) {
    var b = "Are you sure to promote this user to Beta user?";
    if (!confirm(b)) {
        return
    }
    jQuery.post(URL_BETA_USER + "/" + a, function(c) {
        parseResponse(c);
        if (typeof responseArray.json.url != "undefined") {
            window.location = responseArray.json.url
        } else {
            if (responseArray.code == "0") {
                displayFeedback(responseArray.code + "The user is now a Beta user")
            } else {
                displayFeedback(responseArray.code + responseArray.json.error)
            }
        }
        resetResponse()
    })
}

function blacklistUser(a) {
    var b = "Are you sure to blacklist this user?";
    if (!confirm(b)) {
        return
    }
    jQuery.post(URL_BLACKLIST_USER + "/" + a, function(c) {
        parseResponse(c);
        if (typeof responseArray.json.url != "undefined") {
            window.location = responseArray.json.url
        } else {
            if (responseArray.code == "0") {
                displayFeedback(responseArray.code + responseArray.json.msg);
                jQuery("#un").html(responseArray.json.un)
            } else {
                displayFeedback(responseArray.code + responseArray.json.error)
            }
        }
        resetResponse()
    })
}

function uploadForm() {
    jQuery("#uploaddiv").toggle()
}

function uploadFeedBlock(b) {
    var a = calcServerTime(srv_tz_os);
    jQuery("#" + b).find(".commentdate").each(function() {
        var j = jQuery(this);
        var d = j.html().substr(0, 10).split("-");
        var e = j.html().substr(11, 8).split(":");
        var c = new Date(d[0], d[1] - 1, d[2], e[0], e[1], e[2]);
        var k = (a.getTime() - c.getTime()) / 1000 | 0;
        var g = k / 60 | 0;
        var m = g / 60 | 0;
        var l = m / 24 | 0;
        var i = l / 30 | 0;
        var f = i / 12 | 0;
        var h = "";
        if (k != 0) {
            h = GT.strargs(GT.gettext("feed_timestamp_formatstr"), [k, GT.ngettext("second", "seconds", k)])
        }
        if (g != 0) {
            h = GT.strargs(GT.gettext("feed_timestamp_formatstr"), [g, GT.ngettext("minute", "minutes", g)])
        }
        if (m != 0) {
            h = GT.strargs(GT.gettext("feed_timestamp_formatstr"), [m, GT.ngettext("hour", "hours", m)])
        }
        if (l != 0) {
            h = GT.strargs(GT.gettext("feed_timestamp_formatstr"), [l, GT.ngettext("day", "days", l)])
        }
        if (i != 0) {
            h = GT.strargs(GT.gettext("feed_timestamp_formatstr"), [i, GT.ngettext("month", "months", i)])
        }
        if (f != 0) {
            h = GT.strargs(GT.gettext("feed_timestamp_formatstr"), [f, GT.ngettext("year", "years", f)])
        }
        j.html(h)
    })
}

function highlightUser(a) {
    jQuery("#usercontent_" + a).addClass("userhighlight");
    jQuery("#userdetail_" + a).addClass("userhlb").find(".user_control").show()
}

function unhighlightUser(a) {
    jQuery("#usercontent_" + a).removeClass("userhighlight");
    jQuery("#userdetail_" + a).removeClass("userhlb").find(".user_control").hide()
}

function highlightUserSmall(b, a) {
    a = a || "#e7e7e7";
    jQuery("#userdetail_" + b).find(".fans_user_thumb_author").css("background", a);
    jQuery("#userdetail_" + b).find(".user_control").show()
}

function unhighlightUserSmall(a) {
    jQuery("#userdetail_" + a).find(".fans_user_thumb_author").css("background", "none");
    jQuery("#userdetail_" + a).find(".user_control").hide()
}

function highlightMovie(a) {
    jQuery("#moviecontent_" + a).addClass("content_highlight");
    jQuery("#moviedetail_" + a).addClass("highlight").find(".movie_control").show()
}

function unhighlightMovie(a) {
    jQuery("#moviecontent_" + a).removeClass("content_highlight");
    jQuery("#moviedetail_" + a).removeClass("highlight").find(".movie_control").hide()
}

function highlightEntry(a) {
    jQuery("#" + a).attr("class", "entry_item_highlight")
}

function unhighlightEntry(a) {
    jQuery("#" + a).attr("class", "entry_item")
}

function showDiv(a) {
    jQuery("#" + a).show()
}

function hideDiv(a) {
    jQuery("#" + a).hide()
}

function swapText(d, c) {
    var b = document.getElementById(d);
    var a = document.getElementById(c);
    var e = b.innerHTML;
    b.innerHTML = a.innerHTML;
    a.innerHTML = e
}

function loadStatementPage(g, b, e, h, c, a, i, d) {
    var f = jQuery("#" + h).html() - 0;
    if (d == "next") {
        f = f + 1
    } else {
        if (d == "prev") {
            f = f - 1
        }
    }
    jQuery.post(URL_GET_STATEMENT + "/" + e + "/" + g + "/" + f, function(j) {
        parseResponse(j);
        if (responseArray.code == "0") {
            jQuery("#" + b).html(responseArray.html);
            jQuery("#" + h).html(f);
            if (typeof e != "undefined") {
                jQuery("#" + c).html("<a href=\"javascript:loadStatementPage('" + g + "','" + b + "','" + e + "','" + h + "','" + c + "','" + a + "','" + i + "','prev');\">&lt; " + responseArray.json.prevlink + "</a>");
                jQuery("#" + i).html("<a href=\"javascript:loadStatementPage('" + g + "','" + b + "','" + e + "','" + h + "','" + c + "','" + a + "','" + i + "','next');\">" + responseArray.json.nextlink + " &gt;</a>");
                jQuery("#" + a).html(responseArray.json.currentMonth)
            }
            jQuery("#" + c).toggle(responseArray.json.prev_page > 0);
            jQuery("#" + i).toggle(responseArray.json.next_page > 0);
            if (g == "userfeed") {
                uploadFeedBlock("feedsmain")
            }
        } else {
            displayFeedback(responseArray.code + responseArray.json.error)
        }
        resetResponse()
    })
}

function close_FB_oa() {
    jQuery("#fb_oa_container").hide()
}

function hideTrial() {
    var a = new Date();
    a.setDate(a.getDate() + 3);
    set_cookie("ga_user_trial_hide", "1", a.getFullYear(), a.getMonth(), a.getDate());
    jQuery("#trial_ad").hide()
};