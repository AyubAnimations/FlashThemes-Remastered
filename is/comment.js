var URL_POST_COMMENT = "/ajax/postComment";
var URL_DELETE_COMMENT = "/ajax/deleteComment";
var URL_HIDE_COMMENT = "/ajax/hideComment";
var URL_FLAG_COMMENT = "/ajax/flagComment";
function reloadCaptcha(B, A) {
    if (A == null) {
        $("#captchatext").clear();
        postComment(B, "none", "none")
    } else {
        if (A > 0) {
            $("#captchatext").clear();
            sendInvite(A)
        } else {
            $("emailshare_captchatext").clear();
            $("overlayLoadingTextSnd").style.display = "none";
            $("overlayLoadingCaptcha").style.display = "block";
            sendShare()
        }
    }
    if (jQuery("#saveCommentForm_button").length) {
        jQuery("#saveCommentForm_button").removeClass("disabled")
    }
}
function switchCaptcha(C, A) {
    var B = "";
    if (A < 0) {
        B = "emailshare_"
    }
    if ($(B + "captcha_type").getAttribute("value") == "image") {
        $(B + "captcha_type").setAttribute("value", "audio")
    } else {
        if ($(B + "captcha_type").getAttribute("value") == "audio") {
            $(B + "captcha_type").setAttribute("value", "image")
        } else {
            return
        }
    }
    alert(B);
    reloadCaptcha(C, A)
}
function postComment(D, C, F, A, E) {
    clearFeedback();
    var B = $(D);

    if (B.subject != null && B.subject.val() == "") {
        displayFeedback("2" + GT.gettext("Please enter your subject"));
        if (jQuery("#saveCommentForm_button").length) {
            jQuery("#saveCommentForm_button").removeClass("disabled")
        }
        hidePleaseWait();
        return
    }
    if (B.find('#comment_content').val() == "") {
        displayFeedback("3" + GT.gettext("Please enter your message"));
        if (jQuery("#saveCommentForm_button").length) {
            jQuery("#saveCommentForm_button").removeClass("disabled")
        }
        hidePleaseWait();
        return
    }
    path = URL_POST_COMMENT;
    if (A == "false") {
        path = URL_POST_COMMENT + "/false/" + E
    }
    $.ajax({
        type: "POST",
        url: path,
        data: $(D).serialize(),
        success: function (H) {
            postCommentComplete(H, D, C, F)
        },
        error: function () {
            displayFeedback("1Error contacting the server");
            $(D).prop("disabled", false);
            hidePleaseWait()
        }
    });
    $(D).prop("disabled", true);
}
function postCommentComplete(C, B, A, D) {
    parseResponse(C);
    $("#comment_content").prop("disabled", false);
    switch (responseArray.code) {
        case "0":
            //pageTracker._trackPageview("/pageTracker/ajax/comment/postComplete");
            responseArray.json.error = GT.gettext("Comment successfully posted");
            displayFeedback(responseArray.code + responseArray.json.error);
            if (A == "append" || A == "prepend") {
                displayComment(responseArray.html, A, D)
                if ($('#nocomments').length != 0) {
                    $('#nocomments').remove()
                }
            } else {
                if (A == "redirect") {
                    window.location = responseArray.json.url
                }
            }
            resetCommentForm(B);
            $("#comment_content").prop("disabled", true);
            if (typeof $("#saveCommentForm").find("#Post") != "undefined") {
                $("#saveCommentForm").find("#Post").prop("disabled", true);
                $("#recaptcha").css("display", "none");
            }
            $(B).get(0).reset();
            break;
        case "1":
            $("#recaptcha").css("display", "block");
            break;
        case "2":
            $("#captcha_type").setAttribute("value", "audio");
            $("#captcha_id").setAttribute("value", responseArray.json.session_id);
            $("#captcha_audio").innerHTML = getAudioEmbedString(responseArray.json.url);
            $("#comment_captcha").css("display", "block");
            $("#image_captcha").css("display", "none");
            $("#audio_captcha").css("display", "block");
            break;
        case "3":
            $(B).find('#comment_content').reset();
            $("#comment_content").prop("disabled", true);
            if ($("#saveCommentForm").find("#Post")) {
                $("#saveCommentForm").find("#Post").prop("disabled", true);
            }
            $("recaptcha").css("display", "none");
        default:
            displayFeedback(responseArray.code + responseArray.json.error);
            resetCommentForm(B);
            break
    }
    hidePleaseWait();
    resetResponse()
}
function getAudioEmbedString(A) {
    return '<object classid="CLSID:22D6F312-B0F6-11D0-94AB-0080C74C7E95" type="application/x-oleobject" height="40" width="170"><param name="autoplay" value="true"><param name="src" value="' + A + '"><param name="autoStart" value="1"><embed height="40" autostart="true" bgcolor="white" src="' + A + '" type="application/x-mplayer2"/></object>'
}
function resetCommentForm(A) {
    $("#captcha_id").attr("value", "");
    $("#captcha_type").attr("value", "");
    $("#captcha_image").attr("src", "");
    $("#comment_captcha").css("display", "none");
    $("#image_captcha").css("display", "none");
    $("#audio_captcha").css("display", "none");
}
function displayComment(A, B, C) {
    console.log(C)
    if (B == "prepend") {
        $('#' + C).prepend(A)
    } else {
        $('#' + C).append(A)
    }
}
function deleteCommentConfirm(C, A, B, R = false) {
    var D = GT.gettext("Are you sure to delete this Comment/Post?");
    showConfirmBox('Delete Comment', 125, D, 'deleteComment(\'' + C + '\', \'' + A + '\', \'' + B + '\', \'' + R + '\')')
}

function deleteComment(C, A, B, R) {
    $.ajax({
        type: "POST",
        url: URL_DELETE_COMMENT + "/" + C + "/" + B,
        success: function (E) {
            deleteCommentComplete(E, A, R)
        },
        error: function () {
            displayFeedback("1Error contacting the server")
        }
    });
}
function deleteCommentComplete(B, A, R) {
    parseResponse(B);
    if (typeof responseArray.json.url != "undefined") {
        window.location = responseArray.json.url
    } else {
        if (responseArray.code == "0") {
            if (R) {
                fixCount(R, 'remove');
            }
            if (jQuery) {
                jQuery("#" + A).fadeOut(300, function () {
                    jQuery(this).remove();
                    if (R) {
                        if ($("#replies" + R).children().filter(".replycomment").length === 0) {
                            hideRepViewCount(R)
                        }
                    }
                })
            } else {
                $(A).remove();
            }
            displayFeedback("0" + GT.gettext("Comment has been deleted"))
        } else {
            displayFeedback(responseArray.code + responseArray.json.error)
        }
    }
    resetResponse()
}
function flagComment(A) {
    $.ajax({
        type: "POST",
        url: URL_FLAG_COMMENT + "/" + A,
        success: function (B) {
            flagCommentComplete(B);
        },
        error: function (H) {
            displayFeedback("1" + GT.gettext("Error contacting the server"));
        },
        failure: function () {
            displayFeedback("1" + GT.gettext("Error contacting the server"));
        }
    })
}
function flagCommentComplete(A) {
    parseResponse(A);
    if (typeof responseArray.json.url != "undefined") {
        window.location = responseArray.json.url
    } else {
        if (responseArray.code == "0") {
            displayFeedback(responseArray.code + GT.gettext("Comment flagged as inappropriate"))
        } else {
            displayFeedback(responseArray.code + responseArray.json.error)
        }
    }
    resetResponse()
}

function hideComment(A, L) {
    $.ajax({
        type: "POST",
        url: URL_HIDE_COMMENT,
        data: {
            id: A,
            status: L
        },
        success: function (B) {
            flagCommentComplete(B);
        },
        error: function (H) {
            displayFeedback("1" + GT.gettext("Error contacting the server"));
        },
        failure: function () {
            displayFeedback("1" + GT.gettext("Error contacting the server"));
        }
    })
}
function hideCommentComplete(A) {
    parseResponse(A);
    if (typeof responseArray.json.url != "undefined") {
        window.location = responseArray.json.url
    } else {
        if (responseArray.code == "0") {
            displayFeedback(responseArray.code + GT.gettext("Comment hidden"))
        } else {
            displayFeedback(responseArray.code + responseArray.json.error)
        }
    }
    resetResponse()
}

function showCommentContent(B, A, C) {
    if ($(B).innerHTML == "show") {
        $(B).innerHTML = "hide";
        $(A).show();
        $(C).show()
    } else {
        $(B).innerHTML = "show";
        $(A).hide();
        $(C).hide()
    }
}
function showUserCommentForm(A) {
    var C = {
        broadcast: false,
        title: null
    };
    jQuery.extend(C, A);
    var B = jQuery("#comment_form_container");
    jQuery("#comment_form_subject").show();
    B.find("#to_fans").attr("disabled", (C.broadcast) ? false : "disabled");
    if (C.title) {
        B.find(".title").html(C.title)
    }
    if (C.id) {
        B.find("#comment_form_id").val(C.id)
    }
    jQuery("#comment_content").attr("disabled", false);
    jQuery("#comment_form button").attr("disabled", false);
    jQuery.blockUI({
        message: jQuery("#comment_form_container"),
        css: {
            border: "none",
            width: "500px",
            top: "20%",
            cursor: "auto"
        }
    });
    jQuery("#comment_content").focus()
}
function hideUserCommentForm() {
    hideHTMLBox()
    jQuery.unblockUI();
    jQuery("#comment_form .error_message").html("");
    jQuery("#to_fans").attr("disabled", "disabled");
    jQuery("#comment_content").attr("disabled", true);
    jQuery("#comment_form button").attr("disabled", true);
    document.getElementById("comment_form").reset()
}
function postUserComment(B, A) {
    clearFeedback();
    jQuery("#" + B + "_form .error_message").html("");
    if (jQuery("#" + B + "_content").val() == "") {
        jQuery("#" + B + "_form .error_message").html(GT.gettext("Please enter your message"));
        jQuery("#" + B + "_content").focus();
        return
    }
    jQuery.post(URL_POST_COMMENT, jQuery("#" + B + "_form").serialize(), function (D) {
        parseResponse(D);
        switch (responseArray.code) {
            case "0":
                if (jQuery("#to_fans").length) {
                    var C = !jQuery("#to_fans").attr("disabled")
                } else {
                    var C = false
                }
                if (A) {
                    jQuery("#" + B + "_content").attr("disabled", false).attr("value", "");
                    jQuery("#" + B + "_form button").attr("disabled", false);
                    jQuery("#message_content_container .messages").append(responseArray.html).children(":first").hide().animate({
                        opacity: "show",
                        height: "show"
                    });
                    jQuery("#message_content_container .messages:last").find(".message .type").remove().end().find(".message .comment_control").remove().end().find(".messages .message").css("padding-bottom", "10px").end().find(".message .comment_content p").css("margin", "0px");
                    jQuery("#recaptcha_message_div").html("")
                } else {
                    hideUserCommentForm()
                }
                if (C) {
                    displayFeedback("0" + GT.gettext("Message is successfully submitted and will be broadcasted soon"))
                } else {
                    displayFeedback("0" + GT.gettext("Message successfully posted"))
                }
                break;
            case "1":
                showRecaptcha(B);
                if (jQuery("#saveCommentForm_button").length) {
                    jQuery("#saveCommentForm_button").removeClass("disabled")
                }
                jQuery("#" + B + "_content").attr("disabled", false);
                jQuery("#" + B + "_form button").attr("disabled", false);
                break;
            default:
                hideUserCommentForm();
                displayFeedback(responseArray.code + responseArray.json.error)
        }
    });
    jQuery("#" + B + "_content").attr("disabled", true);
    jQuery("#" + B + "_form button").attr("disabled", true)
}
function showRecaptcha(A) {
    Recaptcha.create(Recaptcha_Public_Key, "recaptcha_" + A + "_div", {
        theme: "red",
        callback: Recaptcha.focus_response_field
    })
};

function openReplyBox(cid, mid, parent, small = false) {
    var width = 595;
    var padding = "";
    if (small) {
        padding = "margin-left: 7px;";
    }
    if ($("#saveCommentReplyForm" + cid).length === 0) {
        $("#comment_reply" + cid).append(`<div id="saveCommentReplyForm${cid}">
          <form method="post" style="position: relative; ${small === true ? "" : "margin-left: 67px; margin-right: 14px;"}" action="javascript:showPleaseWait('Replying to Comment',findPosY('waitingAnchor'));replytoComment('#replyToComment${cid}','append','replies${parent}','#saveCommentReplyForm${cid}', '${cid}', '${mid}');" name="replyToComment" id="replyToComment${cid}">
          <textarea id="comment_content" name="comment_content" style="width: ${width}px;height: 86px;resize: none;${padding}" maxlength="550"></textarea>
              <div id="saveCommentForm_button" style="margin: auto;${small === true ? "margin-left: 7px;":""}">
                <input type="hidden" value="movie" name="type">
                <input type="hidden" value="${mid}" name="id">
                <input type="hidden" value="${cid}" name="rid">
                <input type="hidden" value="" name="captcha_id" id="captcha_id">
                <input type="hidden" value="" name="captcha_type" id="captcha_type">
                <input type="hidden" value="" name="captcha_image" id="captcha_image">
                <input type="hidden" value="" name="comment_captcha" id="comment_captcha">
                <input type="hidden" value="" name="image_captcha" id="image_captcha">
                <input type="hidden" value="" name="audio_captcha" id="audio_captcha">
                <input type="submit" value="Post" class="buttonorange"> 
                <a class="buttonorange reply_cancel" onclick="openReplyBox(${cid}, '${mid}')">Cancel</a>
              </div>
            </form>
          </div>`);
    } else {
        $("#saveCommentReplyForm" + cid).remove();
    }
}

function replytoComment(D, C, F, A, CID, MID) {
    clearFeedback();
    var B = $(D);
    if (B.subject != null && B.subject.val() == "") {
        displayFeedback("2" + GT.gettext("Please enter your subject"));
        if (jQuery(A).length) {
            jQuery(A).removeClass("disabled")
        }
        hidePleaseWait();
        return
    }
    if (B.find('#comment_content').val() == "") {
        displayFeedback("3" + GT.gettext("Please enter your message"));
        if (jQuery(A).length) {
            jQuery(A).removeClass("disabled")
        }
        hidePleaseWait();
        return
    }
    path = "/ajax/postComment";
    $.ajax({
        type: "POST",
        url: path,
        data: $(D).serialize(),
        success: function (H) {
            postReplyComplete(H, D, C, F, CID, MID)
        },
        error: function () {
            displayFeedback("1Error contacting the server");
            $(D).prop("disabled", false);
            hidePleaseWait()
            return
        }
    });
    $(D).prop("disabled", true);
}

function hideRepViewCount(R) {
    $("#hidereplies" + R).hide();
    $("#showreplies" + R).hide();
}

function fixCount(D, A) {
    var thing = "#replies" + D + "_count";
    if ($(thing).length) {
        if (A === 'remove') {
            var newCount = parseInt($(thing).text().replace(/[^0-9]/g, '')) - 1;
            $(thing).text($(thing).text().replace(/[0-9]+/, newCount))
            return;
        } else {
            var newCount = parseInt($(thing).text().replace(/[^0-9]/g, '')) + 1;
            $(thing).text($(thing).text().replace(/[0-9]+/, newCount))
            return;
        }
    } else {
        return;
    }
}

function rateComment(id, rating, remove) {
    var data = new FormData();
    data.append("comment_id", id);
    data.append("rating", rating);
    data.append("remove", remove);
    $.ajax({
        type: "POST",
        url: "/ajax/rateComment",
        data: data,
        success: function (response) {
            if (response.redirect) {
                window.location = response.redirect;
            } else if (response.error) {
                displayFeedback('1' + GT.gettext(response.error));
            } else if (response.message) {
                var prev = false;
                if ($('#comment' + id + ' .commentrating .on').length > 0) {
                    prev = $('#comment' + id + ' .commentrating .on').attr('id');
                    $('#comment' + id + ' .commentrating .on').removeClass('on');
                }
                if (rating !== prev) {
                    $('#comment' + id + ' #' + rating).addClass('on');
                }
                var karma = Number($('#comment' + id + ' #commentkarma').text());
                if (rating == 'neg') {
                    if (prev == "pos") {
                        --karma
                        $(`#comment${id} #neg`).attr('onclick', `rateComment('${id}', 'neg', true)`);
                        $(`#comment${id} #pos`).attr('onclick', `rateComment('${id}', 'pos', false)`);
                    } else if (remove) {
                        karma++
                        $(`#comment${id} #neg`).attr('onclick', `rateComment('${id}', 'neg', false)`);
                        $(`#comment${id} #pos`).attr('onclick', `rateComment('${id}', 'pos', false)`);
                    }
                    if (!remove) {
                        $(`#comment${id} #neg`).attr('onclick', `rateComment('${id}', 'neg', true)`);
                        $(`#comment${id} #pos`).attr('onclick', `rateComment('${id}', 'pos', false)`);
                        --karma
                    }
                } else if (rating == 'pos') {
                    if (prev == "neg") {
                        karma++
                        $(`#comment${id} #neg`).attr('onclick', `rateComment('${id}', 'neg', false)`);
                        $(`#comment${id} #pos`).attr('onclick', `rateComment('${id}', 'pos', true)`);
                    } else if (remove) {
                        --karma
                        $(`#comment${id} #neg`).attr('onclick', `rateComment('${id}', 'neg', false)`);
                        $(`#comment${id} #pos`).attr('onclick', `rateComment('${id}', 'pos', false)`);
                    }
                    if (!remove) {
                        karma++
                        $(`#comment${id} #neg`).attr('onclick', `rateComment('${id}', 'neg', false)`);
                        $(`#comment${id} #pos`).attr('onclick', `rateComment('${id}', 'pos', true)`);
                    }
                } else {
                    $(`#comment${id} #neg`).attr('onclick', `rateComment('${id}', 'neg', false)`);
                    $(`#comment${id} #pos`).attr('onclick', `rateComment('${id}', 'pos', false)`);
                }
                $('#comment' + id + ' #commentkarma').text(karma);
            } else {
                displayFeedback('1' + GT.gettext("Service is unavailable at the moment, please try again later"));
            }
            return false;
        },
        error: function (data) {
            displayFeedback("1" + GT.gettext("Error occurred, please try again later."))
            return false;
        },
        processData: false,
        contentType: false,
        dataType: "json"
    })
}


function goToTimeStamp(A) {
    if (document.getElementById('Player')) {
        if (document.getElementById('Player').getSceneGuid !== undefined) {
            if (document.getElementById('Player').getSceneGuid() !== null) {
                if (document.getElementById('Player').getMovieFullDuration() >= A) {
                    document.getElementById('Player').seek(A);
                    $('html').animate({
                        scrollTop: $("#Player").position()
                    }, 0);
                }
            }
        }
    }
}

function postReplyComplete(C, B, A, D, cid, mid) {
    parseResponse(C);
    $("#comment_content").prop("disabled", false);
    openReplyBox(cid, mid);
    switch (responseArray.code) {
        case "0":
            responseArray.json.error = GT.gettext("Reply successfully posted");
            displayFeedback(responseArray.code + responseArray.json.error);
            if (A == "append" || A == "prepend") {
                var id = responseArray.json.ID;
                var movieId = responseArray.json.MID;
                var reptext = responseArray.json.viewreply_text;
                var hidetext = responseArray.json.hidetext;
                if ($('#replies' + cid).length === 0 && !$('#comment' + cid).hasClass('replycomment')) {
                    $('#comment' + cid).append('<div style="display:none;" class="replies_view_count" id="showreplies' + cid + '"><a id="replies'+ cid +'_count" class="comment_view_reply" onclick="showReplies(\'' + cid + '\', \'' + movieId + '\', \'init\')">' + reptext + '</a></div><div style="display:block;" class="replies_view_count" id="hidereplies' + cid + '"><a class="comment_view_reply" onclick="hideReplies(' + cid + ')">' + hidetext + '</a></div>')
                    $('#comment' + cid).after('<div id="reply_container_' + cid + '"><div id="replies' + cid + '"></div><div id="replies' + cid + '_page_number" style="display:none;">0</div><a id="loadmorereplies\'' + cid + '\'" onclick="showReplies(' + cid + ', \'' + movieId + '\', \'next\')" class="load_more_disabled" style="margin-left: 60px;">⏷ Load more</a></div>')
                } else {
                    $("#hidereplies" + cid).show();
                    $("#showreplies" + cid).hide();
                    fixCount(cid, 'add');
                }
                displayComment(responseArray.html, A, D)
            } else {
                if (A == "redirect") {
                    window.location = responseArray.json.url
                }
            }
            resetCommentForm(B);
            $("#comment_content").prop("disabled", true);
            if (typeof $("#saveCommentForm").find("#Post") != "undefined") {
                $("#saveCommentForm").find("#Post").prop("disabled", true);
                $("#recaptcha").css("display", "none");
            }
            break;
        case "1":
            $("#recaptcha").css("display", "block");
            break;
        case "2":
            $("#captcha_type").setAttribute("value", "audio");
            $("#captcha_id").setAttribute("value", responseArray.json.session_id);
            $("#captcha_audio").innerHTML = getAudioEmbedString(responseArray.json.url);
            $("#comment_captcha").css("display", "block");
            $("#image_captcha").css("display", "none");
            $("#audio_captcha").css("display", "block");
            break;
        case "3":
            $(B).find('#comment_content').reset();
            $("#comment_content").prop("disabled", true);
            if ($("#saveCommentForm").find("#Post")) {
                $("#saveCommentForm").find("#Post").prop("disabled", true);
            }
            $("recaptcha").css("display", "none");
        default:
            displayFeedback(responseArray.code + responseArray.json.error);
            resetCommentForm(B);
            break
    }
    hidePleaseWait();
    resetResponse()
}

function hideReplies(id) {
    $('#reply_container_' + id).hide();
    $('#showreplies' + id).show();
    $('#hidereplies' + id).hide();
}

function showReplies(id, mid, page) {
    loadAnotherPage('replies' + id, mid, 'moviecommentreply', 10, 'replies' + id + '_page_number', 'prevPageComments', 'loadmorereplies' + id, page, false, 'false', false, 'all', id, id);
    $('#reply_container_' + id).show();
    $('#showreplies' + id).hide();
    $('#hidereplies' + id).show();
}