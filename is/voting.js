function addVotes(b, a, c) {
    jQuery.get("/ajax/addUserVotes/" + b + "/" + c, function(j) {
        if (j.error) {
            displayFeedback("1" + j.error)
        } else {
            if (j.non_login) {
                jQuery("#movie_signup_container").slideDown()
            } else {
                var i = "#movie_vote_" + j.type_id;
                var d = "#count_" + j.type_id;
                var h = jQuery(d).text();
                var f = jQuery(i).find(".tooltip").html() + "!";
                var g = jQuery("#facebook_textboxes").val();
                if (j.type == "remove") {
                    h = parseInt(h, 10) - 1;
                    jQuery(i).removeClass("voted");
                    if (h > 0 && h != "") {
                        jQuery(i).addClass("counted")
                    } else {
                        h = "";
                        jQuery(i).removeClass("counted")
                    }
                    if (g.indexOf(f) != -1) {
                        jQuery("#facebook_textboxes").val(g.replace(f + " ", ""))
                    }
                } else {
                    if (j.type == "add") {
                        if (h == "") {
                            h = 1
                        } else {
                            h = parseInt(h, 10) + 1
                        }
                        jQuery(i).removeClass("counted");
                        jQuery(i).addClass("voted");
                        if (g.indexOf(f) == -1) {
                            jQuery("#facebook_textboxes").val(f + " " + jQuery("#facebook_textboxes").val())
                        }
                        jQuery("#movie_vote_facebook").slideDown();
                        jQuery("#facebook_textboxes").focus()
                    }
                }
                jQuery(d).text(h);
                if (typeof (localStorage) == "undefined") {} else {
                    try {
                        localStorage.setItem("ga_ls_" + b + "_" + a, j.votedArray)
                    } catch (k) {
                        if (k == QUOTA_EXCEEDED_ERR) {}
                    }
                }
            }
        }
    }, "json")
}
function twitter_custom_share(a) {
    var c = encodeURI(jQuery("#facebook_textboxes").val());
    var b = "http://twitter.com/share?url=" + a + "&text=" + c;
    window.open(b)
}
function closeBox() {
    jQuery("#movie_signup_container").slideUp();
    jQuery(".movie_vote_facebook").slideUp()
}
;