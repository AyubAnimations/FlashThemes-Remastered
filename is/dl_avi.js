
var URL_VIDEO_CHECK_BALANCE = "/ajax/videoCheckBalance";
var URL_PAY_VIA_PAYPAL = "/ajax/videoPayViaPaypal";
var URL_VIDEO_CONFIRM_CONVERSION = "/ajax/videoConfirmConversion";
var URL_VIDEO_SAVE_EMAIL = "/ajax/videoSaveEmail";
var URL_VIDEO_SEND_SUPPORT_EMAIL = "/ajax/videoSendSupportEmail";
var URL_VIDEO_CHECK_DOWNLOAD = "/ajax/videoCheckDownload";
var URL_LOAD_SUPPORT_FORM = "/ajax/loadSupportEmail";
var enc_movie_id = 0;

function showCommercial(B, A) {
    if (typeof pageTracker != "undefined" && pageTracker) {
        pageTracker._trackPageview("/pageTracker/ajax/commercialVideoDownload/overlay/" + A)
    }
    jQuery(".personal_tab_inactive_dl").hide();
    jQuery(".personal_tab_inactive").show();
    jQuery("#enough_gobucks").hide();
    jQuery("#not_enough_gobucks").hide();
    jQuery("#no_history_gobucks").hide();
    jQuery("#transition_pp").hide();
    jQuery("#dl_error").hide();
    jQuery("#confirm_dl").hide();
    jQuery("#dl_completed").hide();
    jQuery("#dl_completed_new").hide();
    jQuery("#video_support_form").hide();
    jQuery("#video_support_confirm").hide();
    jQuery("#dl_completed_new").hide();
    jQuery("#transition_pp_comm").hide();
    jQuery("#video_support_confirm").hide();
    if (B && A) {
        enc_movie_id = B
    }
    jQuery("#transition_pp_comm > .dl_overlay_text_center > #transaction_txt_comm").text(GT.gettext("Please wait ..."));
    showDLOverlay("#transition_pp_comm");
    new Ajax.Request(URL_VIDEO_CHECK_BALANCE, {
        method: "post",
        parameters: "movie_id=" + enc_movie_id + "&commercial=1",
        onSuccess: function (D) {
            var C = D.responseText;
            showCommercialComplete(C, A)
        },
        onFailure: function () {
            grayOutDownload(false);
            displayFeedback("1Error contacting the server")
        }
    })
}

function showCommercialComplete(B, A) {
    parseResponse(B);
    jQuery("#enough_gobucks").hide();
    jQuery("#not_enough_gobucks").hide();
    jQuery("#no_history_gobucks").hide();
    jQuery("#transition_pp").hide();
    jQuery("#dl_error").hide();
    jQuery("#confirm_dl").hide();
    jQuery("#video_support_form").hide();
    jQuery("#video_support_confirm").hide();
    jQuery("#dl_completed_new").hide();
    jQuery("#transition_pp_comm").hide();
    jQuery("#video_support_confirm").hide();
    jQuery("#confirm_commercial_dl > .dl_overlay_text").show();
    jQuery("#confirm_commercial_dl > .dl_overlay_text_center").show();
    jQuery("#confirm_commercial_dl > .dl_overlay_text_bottom").show();
    if (responseArray.json.code == 6) {
        jQuery("#dl_license_error").show()
    } else {
        if (responseArray.json.code == 7) {
            jQuery("#confirm_commercial_dl > .dl_overlay_text").hide();
            jQuery("#confirm_commercial_dl > .dl_overlay_text_center").hide();
            jQuery("#confirm_commercial_dl > .dl_overlay_text_bottom").hide();
            jQuery("#confirm_commercial_dl > #confirm_commercial_dl_text").show();
            jQuery("#confirm_commercial_dl > #confirm_commercial_dl_text").text(GT.gettext("Are you sure to download this video?"));
            jQuery("#confirm_commercial_dl").show()
        } else {
            if (responseArray.json.code == 8) {
                jQuery("#confirm_commercial_dl > .dl_overlay_text").hide();
                jQuery("#confirm_commercial_dl > .dl_overlay_text_center").hide();
                jQuery("#confirm_commercial_dl > .dl_overlay_text_bottom").hide();
                jQuery("#confirm_commercial_dl > #confirm_commercial_dl_text").show();
                jQuery("#confirm_commercial_dl > #confirm_commercial_dl_text").text(GT.gettext("Are you sure to download this video again?"));
                jQuery("#confirm_commercial_dl").show()
            } else {
                if (responseArray.json.code == 9) {
                    jQuery("#confirm_commercial_dl > #confirm_commercial_dl_text").html(((responseArray.json.download_credit > 10) ? "" : GT.strargs(GT.gettext("%1 credit(s) left"), [responseArray.json.download_credit])));
                    jQuery("#confirm_commercial_dl").show()
                } else {
                    jQuery("#dl_price_comm").text(responseArray.json.price);
                    jQuery("#commercial_payment").show()
                }
            }
        }
    }
}

function videoCheckBalance(B, A) {
    jQuery(".personal_tab_inactive_dl").hide();
    jQuery(".personal_tab_inactive").show();
    jQuery("#commercial_payment,#confirm_commercial_dl").hide();
    jQuery("#dl_license_error").hide();
    if (typeof pageTracker != "undefined" && pageTracker) {
        pageTracker._trackPageview("/pageTracker/ajax/videoDownload/overlay/" + A)
    }
    if (B == "null") {
        B = enc_movie_id
    }
    enc_movie_id = B;
    jQuery("#transition_pp > .dl_overlay_text_center > #transaction_txt").text(GT.gettext("Please wait ..."));
    showDLOverlay("#transition_pp");
    new Ajax.Request(URL_VIDEO_CHECK_BALANCE, {
        method: "post",
        parameters: "movie_id=" + B,
        onSuccess: function (D) {
            var C = D.responseText;
            videoCheckBalanceComplete(C, A)
        },
        onFailure: function () {
            grayOutDownload(false);
            displayFeedback("1" + GT.gettext("Error contacting the server"))
        }
    })
}

function videoCheckBalanceComplete(B, A) {
    parseResponse(B);
    jQuery("#enough_gobucks").hide();
    jQuery("#not_enough_gobucks").hide();
    jQuery("#no_history_gobucks").hide();
    jQuery("#transition_pp").hide();
    jQuery("#dl_error").hide();
    jQuery("#confirm_dl").hide();
    jQuery("#video_support_form").hide();
    jQuery("#video_support_confirm").hide();
    jQuery("#dl_completed_new").hide();
    jQuery("#commercial_payment").hide();
    jQuery("#video_support_confirm").hide();
    if (responseArray.json.code == 1) {
        jQuery("#dl_goBucks").text(responseArray.json.gobucks);
        jQuery("#dl_price").text(responseArray.json.price);
        jQuery("#user_gobucks").text(responseArray.json.user_gobucks);
        if (typeof (responseArray.json.fd) != undefined && responseArray.json.fd == 1) {
            responseArray.json.fd = 0
        } else { }
        jQuery("#confirm_goBucks").text(responseArray.json.gobucks);
        jQuery("#confirm_dl > .dl_overlay_text_center").show();
        jQuery("#enough_gobucks").show()
    } else {
        if (responseArray.json.code == 2) {
            jQuery("#dl_goBucks_ne").text(responseArray.json.gobucks);
            jQuery("#dl_price_ne").text(responseArray.json.price);
            jQuery("#user_gobucks_ne").text(responseArray.json.user_gobucks);
            if (typeof (responseArray.json.fd) != undefined && responseArray.json.fd == 1) {
                responseArray.json.fd = 0
            } else { }
            jQuery("#confirm_goBucks").text(responseArray.json.gobucks);
            jQuery("#confirm_dl > .dl_overlay_text_center").show();
            jQuery("#not_enough_gobucks").show()
        } else {
            if (responseArray.json.code == 3) {
                jQuery("#dl_price_nh").text(responseArray.json.price);
                if (jQuery("#dl_gobucks_nh").length) {
                    jQuery("#dl_gobucks_nh").text(responseArray.json.gobucks)
                }
                if (typeof (responseArray.json.fd) != undefined && responseArray.json.fd == 1) {
                    responseArray.json.fd = 0
                } else { }
                jQuery("#no_history_gobucks").show()
            } else {
                if (responseArray.json.code == 4) {
                    jQuery("#dl_error > .dl_err_title").text(GT.gettext("You do not have the permission to download this video"));
                    jQuery("#dl_error > .dl_err_desc").text(GT.gettext("The creator of the video may have disallowed downloads for this video. Get in touch with him or her for more information."));
                    jQuery("#dl_error").show()
                } else {
                    if (responseArray.json.code == 5) {
                        jQuery("#video_confirm_link").attr("href", "javascript:videoConfirmConversion('" + A + "');");
                        jQuery("#confirm_dl > .dl_overlay_text_center").text(GT.gettext("Are you sure to download this video?"));
                        jQuery("#confirm_dl").show()
                    } else {
                        jQuery("#dl_error > .dl_err_title").text(GT.gettext("We received invalid transaction details"));
                        jQuery("#dl_error > .dl_err_desc").text(GT.gettext("Your transaction has not been processed."));
                        jQuery("#dl_error").show()
                    }
                }
            }
        }
    }
}

function videoPayViaPP(B, A, C) {
    if (typeof pageTracker != "undefined" && pageTracker) {
        if (typeof C != "undefined" && C) {
            pageTracker._trackPageview("/pageTracker/ajax/commercialVideoBought/paypal/" + A);
            C = "1"
        } else {
            pageTracker._trackPageview("/pageTracker/ajax/videoBought/paypal/" + A);
            C = "0"
        }
    }
    if (C == "1") {
        jQuery("#commercial_payment").hide();
        jQuery("#transition_pp_comm").show();
        jQuery("#transition_pp_comm > .dl_overlay_text_center > #transaction_txt_comm").text(GT.gettext("Generating Transaction ..."))
    } else {
        jQuery("#not_enough_gobucks").hide();
        jQuery("#no_history_gobucks").hide();
        jQuery("#transition_pp").show();
        jQuery("#transition_pp > .dl_overlay_text_center > #transaction_txt").text(GT.gettext("Generating Transaction ..."))
    }
    new Ajax.Request(URL_PAY_VIA_PAYPAL, {
        method: "post",
        parameters: "movie_id=" + enc_movie_id + "&commercial=" + C,
        onSuccess: function (E) {
            var D = E.responseText;
            videoPayViaPPComplete(D)
        },
        onFailure: function () {
            grayOutDownload(false);
            jQuery("#transition_pp").hide();
            jQuery("#transition_pp_comm").hide();
            displayFeedback("1" + GT.gettext("Error contacting the server"))
        }
    })
}

function videoPayViaPPComplete(A) {
    parseResponse(A);
    jQuery("#pp_submission_frm > #frm_pp_dl").attr("action", responseArray.json.ac);
    jQuery("#pp_submission_frm > #frm_pp_dl > #bn").attr("value", responseArray.json.bn);
    jQuery("#pp_submission_frm > #frm_pp_dl > #ina").attr("value", responseArray.json.ina);
    jQuery("#pp_submission_frm > #frm_pp_dl > #inm").attr("value", responseArray.json.inm);
    jQuery("#pp_submission_frm > #frm_pp_dl > #amt").attr("value", responseArray.json.amt);
    jQuery("#pp_submission_frm > #frm_pp_dl > #rtn_url").attr("value", responseArray.json.rtn_url);
    jQuery("#pp_submission_frm > #frm_pp_dl > #cl_url").attr("value", responseArray.json.cl_url);
    jQuery("#pp_submission_frm > #frm_pp_dl > #iv").attr("value", responseArray.json.iv);
    jQuery("#pp_submission_frm > #frm_pp_dl > #imgg").attr("src", responseArray.json.img);
    jQuery("#transition_pp > .dl_overlay_text_center > #transaction_txt").text(GT.gettext("Redirecting to PayPal ..."));
    jQuery("#pp_submission_frm > #frm_pp_dl").submit()
}

function videoDLConfirm(A) {
    jQuery("#video_confirm_link").attr("href", "javascript:videoConfirmConversion('" + A + "');");
    jQuery("#enough_gobucks").hide();
    jQuery("#confirm_dl").show()
}
var sendingConversion = false;

function videoConfirmConversion(A, B) {
    if (!sendingConversion) {
        sendingConversion = true;
        var C = "movie_id=" + enc_movie_id;
        if (B) {
            C = C + "&commercial=1"
        }
        if (typeof pageTracker != "undefined" && pageTracker) {
            pageTracker._trackPageview("/pageTracker/ajax/videoBought/gobucks/" + A)
        }
        jQuery("#video_confirm_link").attr("href", "javascript:goVoid();");
        new Ajax.Request(URL_VIDEO_CONFIRM_CONVERSION, {
            method: "post",
            parameters: C,
            onSuccess: function (E) {
                var D = E.responseText;
                videoConfirmConversionComplete(D)
            },
            onFailure: function () {
                grayOutDownload(false);
                displayFeedback("1" + GT.gettext("Error contacting the server"))
            }
        })
    }
}

function videoConfirmConversionComplete(A) {
    parseResponse(A);
    jQuery("#confirm_dl").hide();
    jQuery("#confirm_commercial_dl").hide();
    jQuery("#confirm_converting").hide();
    jQuery("#dl_error").hide();
    if (responseArray.json.code == 1) {
        if (typeof (responseArray.json.fu) != undefined && responseArray.json.fu == 1) {
            jQuery("#confirm_converting > #ask_for_email > #success_email").hide();
            jQuery("#confirm_converting > #has_email").hide();
            jQuery("#confirm_converting > #ask_for_email > #email_input").show();
            jQuery("#confirm_converting > #ask_for_email").show()
        } else {
            jQuery("#confirm_converting > #ask_for_email > #email_input").hide();
            jQuery("#confirm_converting > #ask_for_email").hide();
            jQuery("#confirm_converting > #ask_for_email > #success_email").hide();
            jQuery("#confirm_converting > #has_email").show()
        }
        jQuery("#confirm_converting").show();
        if (jQuery("#dl_this_btn").html() != null) {
            jQuery("#dl_this_btn").hide();
            jQuery("#dl_processing_btn").show()
        } else {
            if (jQuery("#other_dl_this_btn").html() != null) {
                jQuery("#other_dl_this_btn").hide();
                jQuery("#other_dl_processing_btn").show()
            } else {
                if (jQuery("#other_dl_btn_" + enc_movie_id + " > .movie_menu").html() != null) {
                    jQuery("#other_dl_btn_" + enc_movie_id).html('<div class="movie_menu movie_menu_dl_processing"></div>')
                } else {
                    if (jQuery("#dl_movie").html() != null) {
                        jQuery("#dl_movie").hide();
                        jQuery("#dl_movie_processing").show()
                    } else {
                        if (jQuery("#dl_ss_movie").html() != null) {
                            jQuery("#dl_ss_movie").hide();
                            jQuery("#dl_ss_movie_processing").show()
                        }
                    }
                }
            }
        }
    } else {
        if (responseArray.json.code == 2) {
            jQuery("#dl_error > .dl_err_title").text(GT.gettext("You do not have enough credit to complete the transaction"));
            jQuery("#dl_error > .dl_err_desc").text(GT.gettext("You may have just used some GoBucks and you now do not have enough to purchase this download."));
            jQuery("#dl_error").show()
        } else {
            if (responseArray.json.code == 3) {
                jQuery("#dl_error > .dl_err_title").html(GT.gettext("You have already used your 1<sup>st</sup> download discount"));
                jQuery("#dl_error > .dl_err_desc").text(GT.gettext("This discount can only be used once and it appears you have already downloaded another video. Contact us if any issue: support@goanimate.com"));
                jQuery("#dl_error").show()
            } else {
                if (responseArray.json.code == 4) {
                    jQuery("#dl_error > .dl_err_title").text(GT.gettext("You do not have the permission to download this video"));
                    jQuery("#dl_error > .dl_err_desc").text(GT.gettext("The creator of the video may have disallowed downloads for this video. Get in touch with him or her for more information."));
                    jQuery("#dl_error").show()
                } else {
                    jQuery("#dl_error > .dl_err_title").text(GT.gettext("We received invalid transaction details"));
                    jQuery("#dl_error > .dl_err_desc").text(GT.gettext("Your transaction has not been processed."));
                    jQuery("#dl_error").show()
                }
            }
        }
    }
    sendingConversion = false
}

function videoSaveEmail() {
    var A = jQuery("#dl_email").val();
    new Ajax.Request(URL_VIDEO_SAVE_EMAIL, {
        method: "post",
        parameters: "email=" + A,
        onSuccess: function (C) {
            var B = C.responseText;
            videoSaveEmailComplete(B)
        },
        onFailure: function () {
            grayOutDownload(false);
            displayFeedback("1" + GT.gettext("Error contacting the server"))
        }
    })
}

function videoSaveEmailComplete(A) {
    parseResponse(A);
    if (responseArray.json.code == 1) {
        jQuery("#confirm_converting > #ask_for_email > #email_input").hide();
        jQuery("#confirm_converting > #ask_for_email > #success_email").show()
    } else {
        jQuery("#confirm_converting > #ask_for_email > #success_email").hide();
        jQuery("#confirm_converting > #has_email").hide();
        jQuery("#confirm_converting > #ask_for_email > #email_input").show();
        jQuery("#confirm_converting > #ask_for_email").show();
        jQuery("#confirm_converting > #ask_for_email > #email_input > #email_err_msg").text(GT.gettext("Error: Please enter a valid email address"));
        jQuery("#confirm_converting > #ask_for_email > #email_input > #email_err_msg").show()
    }
}

function videoSendSupportEmail() {
    jQuery("#send_video_support_form_link").attr("href", "javascript:goVoid();");
    var A = jQuery("#sf_email").val();
    var C = jQuery("#sf_movieURL").val();
    var B = jQuery("#sf_content").val();
    new Ajax.Request(URL_VIDEO_SEND_SUPPORT_EMAIL, {
        method: "post",
        parameters: "email=" + A + "&movie_url=" + C + "&content=" + B,
        onSuccess: function (E) {
            var D = E.responseText;
            videoSendSupportEmailComplete(D)
        },
        onFailure: function () {
            grayOutDownload(false);
            displayFeedback("1" + GT.gettext("Error contacting the server"))
        }
    })
}

function videoSendSupportEmailComplete(A) {
    parseResponse(A);
    if (responseArray.code == 0) {
        jQuery("#video_support_form").hide();
        jQuery("#video_support_confirm").show()
    }
}

function videoCheckDownload(B, A) {
    enc_movie_id = B;
    new Ajax.Request(URL_VIDEO_CHECK_DOWNLOAD, {
        method: "post",
        parameters: "movie_id=" + B,
        onSuccess: function (D) {
            var C = D.responseText;
            videoCheckDownloadComplete(C, A)
        },
        onFailure: function () {
            grayOutDownload(false);
            displayFeedback("1" + GT.gettext("Error contacting the server"))
        }
    })
}

function videoCheckDownloadComplete(B, A) {
    parseResponse(B);
    jQuery("#dl_error").hide();
    jQuery("#dl_completed").hide();
    jQuery("#dl_completed_new").hide();
    jQuery(".personal_tab_inactive").hide();
    jQuery(".personal_tab_inactive_dl").show();
    if (responseArray.json.code == 1) {
        if (responseArray.json.old == 1) {
            if (responseArray.json.status == "REJECTED") {
                jQuery("#dl_completed_new > .dl_overlay_text_center").hide();
                jQuery("#dl_new_msg").text(GT.gettext("Remove inappropriate contents to download a new version of your video"))
            }
            if (responseArray.json.is_license == 1) {
                jQuery("#dl_completed_new").attr("class", "neutral_bg");
                jQuery("#dl_completed_new > .commercial_tab_long").hide()
            } else {
                jQuery("#dl_completed_new").attr("class", "neutral_long_bg");
                jQuery("#dl_completed_new > .commercial_tab_long").show()
            }
            jQuery("#c_n_days_left").text(responseArray.json.days);
            jQuery("#dl_link_new").attr("href", responseArray.json.download_url);
            jQuery(".personal_tab_inactive_dl > a").attr("onClick", "javascript:showDownload('#dl_completed_new');");
            showDLOverlay("#dl_completed_new")
        } else {
            if (responseArray.json.count == 1) {
                jQuery("#last_dl").show()
            } else {
                jQuery("#last_dl").hide()
            }
            if (responseArray.json.is_license == 1) {
                jQuery("#dl_completed").attr("class", "neutral_bg");
                jQuery("#dl_completed > .commercial_tab_long").hide()
            } else {
                jQuery("#dl_completed").attr("class", "neutral_long_bg");
                jQuery("#dl_completed > .commercial_tab_long").show()
            }
            jQuery("#dl_days_left").text(responseArray.json.days);
            jQuery("#dl_file_size").text(responseArray.json.filesize);
            jQuery("#dl_link").attr("href", responseArray.json.download_url);
            jQuery(".personal_tab_inactive_dl > a").attr("onClick", "javascript:showDownload('#dl_completed');");
            showDLOverlay("#dl_completed")
        }
        if (responseArray.json.is_commercial == 1) {
            jQuery("#dl_completed_new,#dl_completed").removeClass("neutral_long_bg");
            jQuery("#dl_completed_new,#dl_completed").addClass("neutral_bg");
            jQuery("#dl_completed_new > .commercial_tab_long,#dl_completed > .commercial_tab_long").hide();
            jQuery("#dl_completed_new > #get_new_version").html("<a href=\"javascript:showCommercial('" + A + "');\">" + GT.gettext("Get an updated mpeg4 version of your video") + "</a>")
        } else {
            jQuery("#dl_completed_new,#dl_completed").removeClass("neutral_bg");
            jQuery("#dl_completed_new,#dl_completed").addClass("neutral_long_bg");
            jQuery("#dl_completed_new > .commercial_tab_long,#dl_completed > .commercial_tab_long").show();
            jQuery("#dl_completed_new > #get_new_version").html("<a href=\"javascript:videoCheckBalance('null','" + A + "');\">" + GT.gettext("Get an updated mpeg4 version of your video") + "</a>")
        }
    } else {
        if (responseArray.json.code == 2) {
            jQuery("#dl_error > .dl_err_title").text(GT.gettext("You do not have the permission to download this video"));
            jQuery("#dl_error > .dl_err_desc").text(GT.gettext("The creator of the video may have disallowed downloads for this video. Get in touch with him or her for more information."));
            jQuery("#dl_error").show()
        } else {
            if (responseArray.json.code == 3) {
                jQuery("#dl_error > .dl_err_title").text(GT.gettext("You cannot download this video"));
                jQuery("#dl_error > .dl_err_desc").text(GT.gettext("You have used up your download credits or the download request is expired."));
                jQuery("#dl_error").show()
            } else {
                jQuery("#dl_error > .dl_err_title").text(GT.gettext("We received invalid transaction details"));
                jQuery("#dl_error > .dl_err_desc").text(GT.gettext("Your transaction has not been processed."));
                jQuery("#dl_error").show()
            }
        }
    }
}

function showDownload(A) {
    jQuery("#dl_license_error").hide();
    jQuery("#dl_license_error").hide();
    jQuery("#transition_pp_comm").hide();
    jQuery("#commercial_payment,#confirm_commercial_dl").hide();
    jQuery(A).show()
}

function showSupportEmail(A) {
    jQuery(A).hide();
    jQuery("#sf_movieURL").attr("value", jQuery("#sf_movieURL").attr("value") + "/" + enc_movie_id);
    jQuery("#send_video_support_form_link").attr("href", "javascript:videoSendSupportEmail();");
    jQuery("#video_support_form").show()
}

function showSupportForm(A) {
    new Ajax.Request(URL_LOAD_SUPPORT_FORM, {
        method: "post",
        parameters: "user_id=" + A,
        onSuccess: function (C) {
            var B = C.responseText;
            parseResponse(B);
            if (responseArray.code == 0) {
                jQuery("#sf_movieURL").attr("value", jQuery("#sf_movieURL").attr("value") + "/" + responseArray.json.movie_id);
                jQuery("#sf_email").attr("value", responseArray.json.email);
                jQuery("#send_video_support_form_link").attr("href", "javascript:videoSendSupportEmail();");
                showDLOverlay("#video_support_form")
            }
        },
        onFailure: function () {
            grayOutDownload(false);
            displayFeedback("1" + GT.gettext("Error contacting the server"))
        }
    })
}

function showSupportFormOnLoad(A) {
    jQuery("#sf_movieURL").attr("value", jQuery("#sf_movieURL").attr("value") + "/" + A);
    jQuery("#send_video_support_form_link").attr("href", "javascript:videoSendSupportEmail();");
    showDLOverlay("#video_support_form")
}

function showDLOverlayOnLoad(B, A) {
    if (jQuery("#dl_ani_savedMovie > .dl_movie").html() != null) {
        videoCheckBalance(B, A)
    }
}

function showRedirectPPThankyou(A, B) {
    if (A == "1") {
        if (typeof (B) != undefined && B == "1") {
            jQuery("#confirm_converting > #ask_for_email > #success_email").hide();
            jQuery("#confirm_converting > #has_email").hide();
            jQuery("#confirm_converting > #ask_for_email > #email_input").show();
            jQuery("#confirm_converting > #ask_for_email").show()
        } else {
            jQuery("#confirm_converting > #ask_for_email > #email_input").hide();
            jQuery("#confirm_converting > #ask_for_email").hide();
            jQuery("#confirm_converting > #ask_for_email > #success_email").hide();
            jQuery("#confirm_converting > #has_email").show()
        }
        showDLOverlay("#confirm_converting")
    } else {
        if (A == "2") {
            jQuery("#dl_error > .dl_err_title").text(GT.gettext("We received invalid transaction details"));
            jQuery("#dl_error > .dl_err_desc").text(GT.gettext("Please contact us at support@goanimate.com for details."));
            showDLOverlay("#dl_error")
        } else {
            if (A == "3") {
                jQuery("#dl_error > .dl_err_title").text(GT.gettext("It appears you cancelled the payment for this transaction"));
                jQuery("#dl_error > .dl_err_desc").html(GT.gettext("You need to complete your payment for the download to go ahead.<br/>Contact us if any issue: support@goanimate.com"));
                showDLOverlay("#dl_error")
            }
        }
    }
}

function showDLOverlay(A) {
    grayOutDownload(true);
    jQuery(A).show()
}

function hideDLOverlay(A) {
    grayOutDownload(false);
    jQuery(A).hide()
}

function hideDLOveryAndGo(B, A) {
    hideDLOverlay(B);
    window.open(A)
}

function grayOutDownload(B) {
    var I = document.getElementById("darkenScreenObject");
    var G = $("dl_avi_overlay");
    if (B) {
        if (document.body && (document.body.scrollWidth || document.body.scrollHeight)) {
            var K = document.body.scrollWidth + 30 + "px";
            var F = document.body.scrollHeight + 30 + "px"
        } else {
            if (document.body.offsetWidth) {
                var K = document.body.offsetWidth + "px";
                var F = document.body.offsetHeight + "px"
            } else {
                var K = "100%";
                var F = "100%"
            }
        }
        var H = currPos();
        G.style.margin = H[1] + "px 0px 0px 0px";
        I.style.width = K;
        I.style.height = F;
        I.style.display = "block";
        G.style.display = "block";
        if (Prototype.Browser.IE) {
            var C = document.body.offsetWidth
        } else {
            var C = window.innerWidth
        }
        var D = 650;
        var J = (C - G.clientWidth) / 2;
        G.style.left = J > 0 ? (J + "px") : "0px";
        var E = (D - G.clientHeight) / 2;
        G.style.top = E > 0 ? (E + "px") : "0px"
    } else {
        I.style.display = "none";
        G.style.display = "none";
        var A = G.innerHTML;
        G.innerHTML = "";
        G.innerHTML = A;
        window.onResize = ""
    }
};

