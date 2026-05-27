var URL_POST_RATING = "/ajax/rate";
var responseArray = new Array();
var URL_TEMPLATE_PREFERENCE = "/ajax/templatePreference";
var URL_FORCE_SHOW_TEMPLATE = "/ajax/forceShowTemplate";
var URL_LOGIN = "/ajax/doLogin";
var URL_SIGNUP = "/ajax/doSignup";
var URL_PREVIEW_MOVIE = "/ajax/getMovie";
var URL_FBCONNECT_CHECK = "/ajax/FBConnectCheck";
var URL_FBCONNECT_SIGNIN = "/ajax/FBConnectSignIn";
var URL_GENERATE_TXN = "/ajax/generateTxn";
var URL_CHOOSE_LANGUAGE = "/ajax/chooseLanguage";
var flashVar = "";
var flashAppName = "Player";
var inviteContactName = "rcpt_ml_area";
var on_signup_or_login_complete_handler;
var on_signup_or_login_cancel_handler;
registerSignupLoginCompleteHandler(redirect_after_signup_complete);
registerSignupLoginCancelHandler(goVoid);
//todo: innerhtml for jquery stuff might be bugged so use .text instead
function goVoid() { }

function flashInterfaceWithTracking(A, B) {
    $(A).share(B)
}

function flashInterface(A, B) {
    $(A).share(B)
}

function add2flash(A) {
    $(flashAppName).addContact(A);
    showAddressBook(false)
}

function add2form(B) {
    var A = $(inviteContactName).value;
    if (A.length > 0) {
        A += "\n"
    }
    $(inviteContactName).value = A + B;
    showAddressBook(false);
    grayOut(false, "addImportToInvite")
}

function getSelected() {
    var A = "";
    if (document.contactform.mlist.length == undefined) {
        if (document.contactform.mlist.checked == true) {
            A += document.contactform.mlist.value
        }
    } else {
        for (i = 0; i < document.contactform.mlist.length; i++) {
            if (document.contactform.mlist[i].checked == true) {
                if ($("rcpt_ml_area") == null) {
                    A += document.contactform.mlist[i].value + ","
                } else {
                    if ($("movieId") != null) {
                        A += document.contactform.mlist[i].value + ", "
                    } else {
                        A += document.contactform.mlist[i].value + "\n"
                    }
                }
            }
        }
        A = A.substr(0, A.length - 1)
    }
    return A
}

function recordSignUp() {
    if (typeof pageTracker != "undefined" && pageTracker) {
        pageTracker._trackPageview("/pageTracker/ajax/signUpComplete")
    }
}

function postRating(C, B, A) {
    if (typeof pageTracker != "undefined" && pageTracker) {
        pageTracker._trackPageview("/pageTracker/ajax/rate/postRating")
    }
    new Ajax.Request(URL_POST_RATING + "/" + C + "/" + B, {
        method: "post",
        onSuccess: function (F) {
            var D = F.responseText;
            parseResponse(D);
            if (responseArray.code == "0") {
                var E = 18;
                if (typeof pageTracker != "undefined" && pageTracker) {
                    pageTracker._trackPageview("/pageTracker/ajax/rate/postComplete")
                }
                $(A + "_" + C + "_rating").style.width = B * E + "px";
                displayFeedback("0" + GT.gettext("Your rating has been sucessfully registered"))
            } else {
                if (typeof responseArray.json.url != "undefined") {
                    window.location = responseArray.json.url
                } else {
                    displayFeedback(responseArray.code + responseArray.json.error)
                }
            }
        },
        onFailure: function () {
            displayFeedback("1" + I18N.txt("feedback_rate_fail", "Error contacting the server"))
        }
    })
}

function parseResponse(B) {
    responseArray.code = B.charAt(0);
    var C = B.indexOf("{");
    var A = B.indexOf("}");
    responseArray.json = JSON.parse(B.substring(C, A + 1));
    responseArray.html = B.substring(A + 1)
    return;
}

function parseRenderString(A) {
    this.responseData = new Array();
    responseArray.code = A.charAt(0);
    responseArray.string = A.substring(1)
}

function parseResponseClass(B) {
    this.responseData = new Array();
    responseArray.code = B.charAt(0);
    var C = B.indexOf("{");
    var A = B.indexOf("}");
    this.responseData.json = JSON.parse(B.substring(C, A + 1))
    this.responseData.html = B.substring(A + 1)
}

function resetResponse() {
    responseArray = new Array()
}

function clearFeedback() {
    var A = $("#feedback_block");
    A.css("display", "none");
}

function calcServerTime(a) {
    d = new Date();
    utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    nd = new Date(utc + (3600000 * a));
    return nd
}
function timeAgo(e) {
    var a = e / 60 | 0;
    var g = a / 60 | 0;
    var h = g / 24 | 0;
    var f = h / 30 | 0;
    var c = f / 12 | 0;
    var b = "";
    if (c != 0) {
        b = GT.strargs(GT.gettext("feed_timestamp_formatstr"), [c, GT.ngettext("year", "years", c)])
    } else {
        if (f != 0) {
            b = GT.strargs(GT.gettext("feed_timestamp_formatstr"), [f, GT.ngettext("month", "months", f)])
        } else {
            if (h != 0) {
                b = GT.strargs(GT.gettext("feed_timestamp_formatstr"), [h, GT.ngettext("day", "days", h)])
            } else {
                if (g != 0) {
                    b = GT.strargs(GT.gettext("feed_timestamp_formatstr"), [g, GT.ngettext("hour", "hours", g)])
                } else {
                    if (a != 0) {
                        b = GT.strargs(GT.gettext("feed_timestamp_formatstr"), [a, GT.ngettext("minute", "minutes", a)])
                    } else {
                        /* if (e!= 0) {*/
                        b = GT.strargs(GT.gettext("feed_timestamp_formatstr"), [e, GT.ngettext("second", "seconds", e)])
                        /* } */
                    }
                }
            }
        }
    }
    return b
}

function displayFeedback(E) {
    var C = E.charAt(0);
    var B = E.substring(1);
    //var D = $("#growlfeedback");
    var D = $("#growlfeedback");
    var growlUI = $("div.growlUI")[0];
    if (D) {
        D.text(B);
    }
    D = D[0];
    if (C == "0") {
        $("#growlerror").css("display", "none");
        $("#growlnotify").css("display", "block");
    } else {
        $("#growlnotify").css("display", "none");
        $("#growlerror").css("display", "block");
    }
    jQuery.blockUI({
        message: growlUI,
        fadeIn: 700,
        fadeOut: 700,
        timeout: 5000,
        showOverlay: false,
        centerY: false,
        css: {
            width: "380px",
            top: "10px",
            left: "",
            right: "10px",
            textAlign: "left",
            border: "none",
            padding: "15px",
            backgroundColor: "#000",
            "-webkit-border-radius": "10px",
            "-moz-border-radius": "10px",
            opacity: 0.8,
            color: "#fff"
        }
    })
}
function blockUICenterX() {
    $block = jQuery(".blockUI.blockMsg");
    $block.css("left", (jQuery(window).width() - $block.width()) / 2 + jQuery(window).scrollLeft() + "px")
}
function showOverlay(C, A, F) {
    var A = A || {};
    var B = {
        padding: 0,
        margin: 0,
        width: "auto",
        top: "120px",
        left: "50%",
        textAlign: "center",
        color: "#000",
        border: "none",
        backgroundColor: "transparent",
        cursor: "auto",
    };
    jQuery.extend(B, A);
    jQuery.blockUI({
        message: C,
        css: B,
        overlayCSS: {
            cursor: "auto"
        }
    });
    if (F) {
        $('.blockUI.blockMsg').css("position", "absolute")
    }
    blockUICenterX()
}
function showTemplate() {
    new Ajax.Request(URL_FORCE_SHOW_TEMPLATE, {
        method: "post",
        onSuccess: function (C) {
            var A = C.responseText;
            parseResponse(A);
            if (responseArray.code == "0") {
                $("studioBlock").innerHTML = "";
                $("studioBlock").css("display", "none");
                $("templateBlock").css("display", "block");
                var B = new SWFObject(responseArray.json.templateUrl, "Template", "954", "629", "9.0.28", "#FFFFFF");
                B.addParam("align", "middle");
                B.addParam("AllowScriptAccess", "always");
                B.addParam("wmode", "transparent");
                B.addVariable("bgload", responseArray.json.studioUrl);
                B.addVariable("templateshow", responseArray.json.templateshow);
                B.addVariable("forceshow", responseArray.json.forceshow);
                B.addVariable("lid", responseArray.json.lid);
                B.addVariable("tts_enabled", responseArray.json.tts_enabled);
                B.addVariable("ve", responseArray.json.tts_enabled);
                B.addVariable("appCode", "go");
                B.addVariable("tlang", I18N_LANG);
                B.addVariable("apiserver", responseArray.json.apiserver);
                if (responseArray.json.tutmode != undefined) {
                    B.addVariable("tm", responseArray.json.tutmode)
                }
                B.write("templateBlock")
            } else {
                if (typeof responseArray.json.url != "undefined") {
                    window.location = responseArray.json.url
                } else {
                    displayFeedback(responseArray.code + responseArray.json.error)
                }
            }
        },
        onFailure: function () {
            displayFeedback("1" + GT.gettext("Error contacting the server"))
        }
    })
}

function saveCurFlashVar(A) {
    flashVar = A
}

function getCurFlashVar() {
    return flashVar
}

function templateComplete(C, B, D, E, A) {
    if (typeof pageTracker != "undefined" && pageTracker) {
        pageTracker._trackPageview("/pageTracker/ajax/template/" + C + "/" + B + "/" + D)
    }
    new Ajax.Request(URL_TEMPLATE_PREFERENCE + "/" + C + "/" + B, {
        method: "post",
        onSuccess: function (I) {
            var F = I.responseText;
            parseResponse(F);
            if (responseArray.code == "0") {
                $("templateBlock").css("display", "none");
                $("templateBlock").innerHTML = "";
                $("studioBlock").css("display", "block");
                var G = new SWFObject(responseArray.json.studioUrl, "Studio", "954", "629", "9.0.28", "#FFFFFF");
                G.addParam("align", "middle");
                G.addParam("AllowScriptAccess", "always");
                G.addParam("wmode", "window");
                G.addVariable("movieId", "");
                G.addVariable("originalId", responseArray.json.originalId);
                G.addVariable("st", responseArray.json.st);
                G.addVariable("apiserver", responseArray.json.apiserver);
                G.addVariable("userId", responseArray.json.userId);
                G.addVariable("username", responseArray.json.username);
                G.addVariable("uemail", responseArray.json.uemail);
                G.addVariable("isEmbed", "0");
                if (typeof (E) != "undefined") {
                    if (E == "1" && responseArray.json.tutmode != undefined) {
                        G.addVariable("tm", responseArray.json.tutmode)
                    } else {
                        G.addVariable("tm", E)
                    }
                }
                var H = (typeof URL_STUDIO_AFTER_SAVE != "undefined" ? URL_STUDIO_AFTER_SAVE : "/go/savedMovie/<movieId>/0/1");
                G.addVariable("nextUrl", H);
                G.addVariable("appCode", "go");
                G.addVariable("tts_enabled", responseArray.json.tts_enabled);
                G.addVariable("ve", responseArray.json.vip_enabled);
                if (responseArray.json.uisa != undefined) {
                    G.addVariable("uisa", responseArray.json.uisa)
                }
                if (responseArray.json.u_info != undefined) {
                    G.addVariable(user_cookie_name, responseArray.json.u_info)
                }
                if (responseArray.json.tmcc != undefined) {
                    G.addVariable("tmcc", responseArray.json.tmcc)
                }
                G.addVariable("fb_app_url", responseArray.json.fb_app_url);
                G.addVariable("numContact", responseArray.json.num_contact);
                G.addVariable("is_published", "1");
                G.addVariable("is_private_shared", "0");
                G.addVariable("tlang", I18N_LANG);
                G.addVariable("ctc", "go");
                G.addVariable("lang", I18N_LANG);
                G.addVariable("upl", responseArray.json.allow_user_upload);
                G.addVariable("hb", D == "0" ? "0" : "1");
                G.addVariable("pts", responseArray.json.pts);
                G.addVariable("siteId", D);
                G.addVariable("ad", ((document.cookie.search(/ad=1/) != -1) ? "1" : "0"));
                if (typeof (A) != undefined) {
                    G.addVariable("tray", A)
                }
                G.write("studioBlock")
            } else {
                if (typeof responseArray.json.url != "undefined") {
                    window.location = responseArray.json.url
                } else {
                    displayFeedback(responseArray.code + responseArray.json.error)
                }
            }
        },
        onFailure: function () {
            displayFeedback("1" + GT.gettext("Error contacting the server"))
        }
    })
}

function loginToRate(B, A) {
    $(B).css("display", "none");
    $(A).css("display", "block");
}

function hideLoginToRate(B, A) {
    $(B).css("display", "block");
    $(A).css("display", "none");
}

function piper(C) {
    var B = "";
    for (var A = 0; A < C.value.items.length; A++) {
        B += '<a href="' + C.value.items[A].link + '">';
        B += C.value.items[A].title + "</a><br>";
        if (C.value.items[A].description) {
            B += C.value.items[A].description
        }
    }
    $("topfeed").innerHTML = B
}

function tutpiper(C) {
    if (C.value.items.length == "3") {
        $("gotipsfeed").css("display", "block");
    }
    for (var B = 0; B < C.value.items.length; B++) {
        var A = "";
        A += '<div class="gotipsblocktitle"><a href="' + C.value.items[B].link + '">';
        A += C.value.items[B].title + "</a></div><br>";
        if (C.value.items[B].description) {
            A += '<div class="gotipsblockdesc">' + C.value.items[B].description + "</div>"
        }
        $("tutfeed" + B).innerHTML = A
    }
}

function getFeed(D, C, B) {
    var A = document.createElement("script");
    A.type = "text/javascript";
    if (B == "index") {
        A.src = "https://web.archive.org/web/20100522223421/http://pipes.yahoo.com/pipes/pipe.run?_id=a9d57eb2ac1388d7a0f9d50978bed7c2&_render=json&_callback=piper&length=" + C + "&feed=" + D
    } else {
        if (B == "htw") {
            A.src = "https://web.archive.org/web/20100522223421/http://pipes.yahoo.com/pipes/pipe.run?_id=2569724e3c819b5f0c52efd4e8fea03f&_render=json&_callback=tutpiper&length=" + C + "&feed=" + D
        }
    }
    document.getElementsByTagName("head")[0].appendChild(A)
}

function tutpickblockover(A) {
    if (A.className == "tutselectedblock") {
        return
    }
    A.className = "tutpickhover"
}

function tutpickblockout(A) {
    if (A.className == "tutselectedblock") {
        return
    }
    A.className = "tutpickblock"
}

function setpickblock(E, A, B) {
    if (E.className == "tutselectedblock") {
        return
    }
    for (var C = 0; C < A; C++) {
        $("tutpickblock" + C).className = "tutpickblock"
    }
    E.className = "tutselectedblock";
    var D = new SWFObject(B, "ads", "540", "408", "8", "#ffffff");
    D.addParam("allowfullscreen", "true");
    D.addParam("allowscriptaccess", "always");
    D.addParam("wmode", "transparent");
    D.addParam("movie", B);
    D.write("flashtut")
}

function printDot(B) {
    var A = $('#' + B).html();
    if (A.length >= 3) {
        $('#' + B).text("")
    } else {
        $('#' + B).text(A + '.')
    }
}
var wddd;

function showPleaseWait(B, A) {
    A -= 100;
    $("#overlayWaitingTitle").text(B);
    $("#overlayWaiting").css('display', 'block');
    $("#overlayObjectGlobal").css('margin', A + 'px 0px 0px 0px');
    wddd = window.setInterval('printDot("WaitingDotDotDot")', 300);
    grayOut(true, "showPleaseWait")
}

function hidePleaseWait() {
    grayOut(false, "showPleaseWait");
    $("#overlayWaiting").css("display", "none");
    window.clearInterval(wddd)
}

function showHTMLBox(G, F, D, OLDID, NEWID) {
    if (typeof NEWID === "undefined") {
        NEWID = false;
    }
    $("#overlayHTMLBoxTitle").html((G === "" ? "&nbsp;" : G));
    $("#HTMLBoxMessage").html(D.replace(OLDID, NEWID));
    $("#overlayHTMLBox").css("display", "block");
    var C = currPos();
    grayOut(true, D);
    $("#overlayObject").css("top", F + C[1] + "px")
}

function hideHTMLBox() {
    var A = $("#HTMLBoxTP").html();
    grayOut(false, A);
    $("#overlayHTMLBox").css("display", "none");
}

function showAlertBox(E, D, B, C) {
    $("#overlayAlertBoxTitle").html((E === "" ? "&nbsp;" : E));
    $("#alertBoxMessage").html(B);
    $("#overlayAlertBox").css("display", "block");
    var A = currPos();
    grayOut(true, "showAlertBox", C);
    $("#overlayObject").css("top", D + A[1] + "px")
}

function hideAlertBox() {
    grayOut(false, "showAlertBox");
    $("#overlayAlertBox").css("display", "none");
}

function showConfirmBox(F, E, C, G, A, D) {
    if (typeof E === "undefined") {
        E = 125;
    }
    if (typeof G === "undefined") {
        G = "";
    }
    if (typeof A === "undefined") {
        A = 'hideConfirmBox();';
    }
    $("#overlayConfirmBoxTitle").html((F === "" ? "&nbsp;" : F));
    $("#overlayConfirmConfirmBtn").html('<input type="button" onClick="javascript:hideConfirmBox(); ' + G + '" value="' + GT.gettext("Confirm") + '">');
    $("#overlayConfirmCancelBtn").html("<input type='button' onClick='javascript:" + A + ";' value='" + GT.gettext("Cancel") + "'>");
    $("#confirmBoxMessage").html(C);
    $("#overlayConfirmBox").css("display", "block");
    var B = currPos();
    grayOut(true, "showConfirmBox");
    $("#overlayObject").css("top", E + B[1] + "px")
}

function hideConfirmBox() {
    grayOut(false, "showConfirmBox");
    $("#overlayConfirmBox").css("display", "none");
}

function showInputBox(F, E, C, G, A, L, K) {
    if (typeof K === "undefined") {
        K = {};
    }
    if (typeof L === "undefined") {
        L = "";
    }
    if (typeof A === "undefined") {
        A = "text";
    }
    $("#overlayInputBoxTitle").html((F === "" ? "&nbsp;" : F));
    $("#overlayInputSaveBtn").html("<input type='button' onClick='javascript:" + G + "; hideInputBox();' value='" + GT.gettext("Send") + "'>");
    $("#overlayInputCancelBtn").html("<input type='button' onClick='javascript:hideInputBox();' value='" + GT.gettext("Cancel") + "'>");
    $("#inputBoxMessage").html(C);
    $("#overlayInputBox").css("display", "block");
    $("#inputTextBox").attr('type', A)
    if (A == 'number') {
        $("#inputTextBox").attr('min', K["min"])
        $("#inputTextBox").attr('max', K["max"])
        $("#inputTextBox").attr('value', K["value"])
    }
    var B = currPos();
    grayOut(true, "showInputBox");
    $("#overlayObject").css("top", E + B[1] + "px");
    $("#inputTextBox").focus()
    $("#inputTextBox").attr('placeholder', L)
}

function hideInputBox() {
    grayOut(false, "showInputBox");
    $("#overlayInputBox").css("display", "none");
}

function showRadioBox(F, E, C, G, A) {
    $("#overlayRadioBoxTitle").html((F === "" ? "&nbsp;" : F));
    $("#overlayRadioSaveBtn").html("<input type='button' onClick='javascript:" + G + ";' value='" + GT.gettext("Suspend") + "' disabled>");
    $("#overlayRadioCancelBtn").html("<input type='button' onClick='javascript:hideRadioBox();' value='" + GT.gettext("Cancel") + "'>");
    $("#radioBoxMessage").html(C);
    $("#overlayRadioBox").css("display", "block");
    $("#radioTextBox").attr('placeholder', A)
    var B = currPos();
    grayOut(true, "showRadioBox");
    $("#overlayObject").css("top", E + B[1] + "px");
}

function hideRadioBox() {
    grayOut(false, "showRadioBox");
    $("#overlayRadioBox").css("display", "none");
}

function showReportBox(F, E, C, G, A, L, K) {
    if (typeof L === "undefined") {
        L = "";
    }
    if (typeof K === "undefined") {
        K = {};
    }
    if (typeof A === "undefined") {
        A = "text";
    }
    $("#overlayReportBoxTitle").html((F === "" ? "&nbsp;" : F));
    $("#overlayReportSendBtn").html("<input type='button' onClick='javascript:" + G + "; hideReportBox();' value='" + GT.gettext("Send") + "'>");
    $("#overlayReportCancelBtn").html("<input type='button' onClick='javascript:hideReportBox();' value='" + GT.gettext("Cancel") + "'>");
    $("#reportBoxMessage").html(C);
    $("#overlayReportBox").css("display", "block");
    $("#inputReportBox").attr('type', A)
    var B = currPos();
    grayOut(true, "showReportBox");
    $("#overlayObject").css("top", E + B[1] + "px");
    $("#reportTextBox").focus()
    $("#reportTextBox").attr('placeholder', L)
}

function hideReportBox() {
    grayOut(false, "showInputBox");
    $("#overlayReportBox").css("display", "none");
}
var wsOpen = false;
var webSocket = false;
function showProgressBox(B, G, E, J, C, H, A, L) {
    if (typeof L === "undefined") {
        L = "wss://flashthemes.net/wss/";
    }
    $("#progressBoxDownload").css('display', 'none');
    if (L) {
        close = false;
        function newWebSocket() {
            if (!wsOpen) {
                webSocket = new WebSocket(L);
            } else {
                onOpen()
            }

            webSocket.onerror = function (event) {
                onError(event)
            };

            webSocket.onopen = function (event) {
                onOpen(event)
            };

            webSocket.onclose = function (event) {
                onClose(event)
            };


            webSocket.onmessage = function (event) {
                onMessage(event)
            };

            function onMessage(event) {
                d = JSON.parse(event.data)
                if (d.close) {
                    close = true;
                }
                if (!d.download) {
                    $("#progressBoxMessage2").text(d.status)
                } else {
                    $("#progressBoxMessage2").text(d.status)
                    $("#progressBoxDownload").css('display', 'block').html('<a href="' + d.download + '">Download Here</a>')
                    if ($('#animation_' + B + ' .extra_block.options_block #export_button').length) {
                        $('#animation_' + B + ' .extra_block.options_block #export_button').replaceWith('<a href="javascript:void(0);" onclick="Clicked(\'' + B + '\');" class="options_button" id="download_button">Download</a>');
                    } else {
                        if ($('#animation_' + B + ' .extra_block.options_block #download_button').length === 0) {
                            $('#animation_' + B + ' .extra_block.options_block').prepend('<a href="javascript:void(0);" onclick="Clicked(\'' + B + '\');" class="options_button" id="download_button">Download</a>');
                        }
                    }
                    $("#animation_" + B + " .pending_message").html('This video has finished exporting.')
                }
                $('.loadingBarFilled').css('width', d.percentage)
            }

            function onOpen(event) {
                if (webSocket.readyState === WebSocket.CLOSED || webSocket.readyState === WebSocket.CONNECTING) return;
                wsOpen = true;
                $("#progressBoxMessage2").text("Getting Info..")
                info = { movieId: B }
                webSocket.send(JSON.stringify(info))
            }

            function onError(event) {

            }

            function onClose(event) {
                wsOpen = false;
                if (close === false) {
                    if ($("#overlayProgressBox:visible").length !== 0) {
                        webSocket.close();
                        $("#progressBoxMessage2").text("Connection Interrupted, Reconnecting..")
                        setTimeout(function () { newWebSocket() }, 5000)
                    } else {
                        webSocket.close();
                        setTimeout(function () { newWebSocket() }, 5000)
                    }
                }
            }
        }
        newWebSocket()
    }
    $("#overlayProgressBoxTitle").html((G === "" ? "&nbsp;" : G));
    $("#progressBoxDownload").css('display', 'hide');
    $("#progressBoxMessage").html(J);
    $('.loadingBarFilled').css('width', '0%')
    $("#progressBoxMessage2").text('Getting Information..')
    $("#overlayProgressClose").html('<a href="javascript:' + A + '"></a>');
    $("#overlayProgressBoxBtn").html('<input id="overlayProgressBtn" type="button" value="' + C + '" onClick="javascript:' + H + '">');
    $("#overlayProgressBox").css("display", "block");
    var D = currPos();
    grayOut(true, "showProgressBox")
    $("#overlayObject").css('top', E + D[1] + "px")
}

function hideProgressBox(A) {
    if (A == undefined) {
        grayOut(false, "showProgressBox")
    } else {
        grayOut(false)
    }
    $("#overlayProgressBox").css("display", "none");
}

function findPosY(B) {
    obj = $(B);
    var A = 0;
    if (obj.offsetParent) {
        while (1) {
            A += obj.offsetTop;
            if (!obj.offsetParent) {
                break
            }
            obj = obj.offsetParent
        }
    } else {
        if (obj.y) {
            A += obj.y
        }
    }
    return A
}

function showLogin(C, A, D) {
    var B = currPos();
    C = B[1];
    $("#loginErr").html("&nbsp;");
    $("#overlayLogin").css("display", "block");
    $("#overlayObject").css("margin", C + "px 0px 0px 0px");
    if (A && A.length > 0) {
        document.loginform.returnto.value = A
    }
    grayOut(true, "showLogin");
    if (D && D.length > 0) {
        document.loginform.formId.value = D
    }
    $("#siteLoginBox").focus()
}

function hideLogin(A) {
    if (A && A.length > 0) {
        document.loginform.returnto.value = A
    }
    grayOut(false, "showLogin");
    $("#overlayLogin").css("display", "none");
}

function showUpdatePhone(B, C) {
    if (typeof C != "undefined") {
        if ($("phonenum").value != "") {
            location.href = "/contest_instructions/" + $("phone_ch").value;
            return
        }
    }
    var A = currPos();
    B -= 250;
    $("updateErr").innerHTML = "&nbsp;";
    $("overlayPhoneNumber").css("display", "block");
    $("overlayObject2").style.margin = A[1] + "px 0px 0px 0px";
    grayOut2(true, "showUpdatePhone");
    if (typeof pageTracker != "undefined" && pageTracker) {
        pageTracker._trackPageview("/pageTracker/ajax/overlay/updatePhone/true")
    }
    $("phonenum").focus()
}

function hideUpdatePhone() {
    if (typeof pageTracker != "undefined" && pageTracker) {
        pageTracker._trackPageview("/pageTracker/ajax/overlay/updatePhone/false")
    }
    grayOut2(false, "showUpdatePhone");
    $("overlayPhoneNumber").css("display", "none");
}

function siteLogin() {
    $("#overlayLogin").css("cursor", "wait");
    $("#site_login_button").addClass("disabled");
    $("#site_login_button").parent().removeAttr("href");
    $.ajax({
        type: "POST",
        url: URL_LOGIN,
        data: $("#loginform").serialize(),
        success: function (B) {
            sendLoginComplete(B)
        },
        failure: function () {
            displayFeedback("1" + GT.gettext("Error contacting the server"));
            $("#loginform").enable();
            grayOut(false, "sendLogin")
        },
        error: function () {
            displayFeedback("1" + GT.gettext("Error contacting the server"));
            $("#loginform").enable();
            grayOut(false, "sendLogin")
        }
    });
    $("#loginform :input").prop("disabled", true);
}

function sendLoginComplete(A) {
    parseResponse(A);
    $("#loginform :input").prop("disabled", false);
    switch (responseArray.code) {
        case "0":
            on_signup_or_login_complete_handler();
            grayOut(false, "sendLogin");
            resetResponse();
            break;
        case "1":
            $("#loginErr").text(GT.gettext(responseArray.json["errmsg"]));
            $("#loginErr").show()
            $("#overlayLogin").css("cursor", "auto");
            $("#site_login_button").removeClass("disabled");
            $("#site_login_button").parent().prop("href", "javascript:siteLogin('loginform');");
            break;
        case "2":
            txt = '<div id="feedback_block"><div id="feedback" align="center" class="info">';
            txt += responseArray.json["errmsg"];
            txt += "</div></div>";
            $("#cookieErr").html(txt);
            grayOut(false, "sendLogin");
            resetResponse();
            break;
        default:
            $("#loginErr").text(GT.gettext("We could not find a match for the given email and password. Please try again."));
            $("#overlayLogin").css("cursor", "auto");
            $("#site_login_button").removeClass("disabled");
            $("#site_login_button").parent().prop("href", "javascript:siteLogin('loginform');");
            break
    }
}

function registerSignupLoginCompleteHandler(A) {
    on_signup_or_login_complete_handler = A
}

function getSignupLoginCompleteHandler() {
    return on_signup_or_login_complete_handler
}

function registerSignupLoginCancelHandler(A) {
    on_signup_or_login_cancel_handler = A
}

function getSignupLoginCancelHandler() {
    return on_signup_or_login_cancel_handler
}

function changeSignUpButtonName(A) {
    if (A == "") {
        A = "Sign Up"
    }
    $("#signup_submit").val(A)
}

function changeLoginButtonName(A) {
    if (A == "") {
        A = "Login"
    }
    $("#login_submit").val(A)
}

function showSignup(C, A) {
    var B = currPos();
    C = B[1];
    $("#overlaySignup").css("display", "block");
    $("#overlayObject").css("margin", C + "px 0px 0px 0px");
    if (A && A.length > 0) {
        document.signupform.returnto.value = A
    }
    grayOut(true, "showSignup");
}

function hideSignup() {
    grayOut(false, "showSignup");
    $("#overlaySignup").css("display", "none");
}

function siteSignup() {
    $("#overlaySignup").css("cursor", "wait");
    $("#site_signup_button").addClass("disabled");
    $("#site_signup_button").parent().removeAttr("href");
    $.ajax({
        type: "POST",
        url: URL_SIGNUP,
        data: $("#signupform").serialize(),
        success: function (B) {
            sendSignupComplete(B)
        },
        failure: function () {
            displayFeedback("1" + GT.gettext("Error contacting the server"));
            $("#signupform :input").prop("disabled", false);
            grayOut(false, "sendSignup")
        },
        error: function () {
            displayFeedback("1" + GT.gettext("Error contacting the server"));
            $("#signupform :input").prop("disabled", false);
            grayOut(false, "sendSignup")
        }
    });
    $("#signupform :input").prop("disabled", true);
}

function goSignup() {
    email = $("#email").val();
    if (!email.match(/^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/)) {
        $("#signup_form_message").text(GT.gettext("Please enter your Email in a valid format"));
        $("#overlaySignup").css("cursor", "auto");
        $("#signup_form_message").show()
    } else {
        $("#overlaySignup").css("cursor", "wait");
        $("#site_signup_button").addClass("disabled");
        $("#site_signup_button").parent().removeAttr("href");
        $.ajax({
            type: "POST",
            url: URL_SIGNUP,
            data: $("#index_signup_form").serialize(),
            success: function (B) {
                sendSignupComplete2(B)
            },
            failure: function () {
                displayFeedback("1" + GT.gettext("Error contacting the server"));
                $("#signupform :input").prop("disabled", false);
                grayOut(false, "sendSignup")
            },
            error: function () {
                displayFeedback("1" + GT.gettext("Error contacting the server"));
                $("#signupform :input").prop("disabled", false);
                grayOut(false, "sendSignup")
            }
        });
        $("#signupform :input").prop("disabled", true);
    }
}

function redirect_after_signup_complete() {
    window.location = responseArray.json.redirect
}

function sendSignupComplete2(A) {
    parseResponse(A);
    $("#signupform :input").prop("disabled", false);
    switch (A.charAt(A.indexOf("{") - 1)) {
        case "0":
            on_signup_or_login_complete_handler();
            resetResponse();
            grayOut(false, "sendSignup");
            break;
        case "1": {
            $("#signup_form_message").text(GT.gettext(responseArray.json.email_error));
            if (responseArray.json.email_error != "&nbsp;") {
                resetResponse();
                $("#signup_form_message").show()
                $("#overlaySignup").css("cursor", "auto");
                $("#site_signup_button").removeClass("disabled");
                $("#site_signup_button").parent().prop("href", "javascript:siteSignup('signup');");
            }
            $("#signup_form_message").text(GT.gettext(responseArray.json.password_error));
            if (responseArray.json.password_error != "&nbsp;") {
                $("#signup_form_message").show()
            } else {
                $("#signup_form_message").hide()
            }
            $("#signup_form_message").text(GT.gettext(responseArray.json.nickname_error));
            if (responseArray.json.nickname_error != "&nbsp;") {
                $("#signup_form_message").show()
            } else {
                $("#signup_form_message").hide()
            }
            $("#signup_form_message").text(GT.gettext(responseArray.json.terms_error));
            if (responseArray.json.terms_error != "&nbsp;") {
                $("#signup_form_message").show()
            } else {
                $("#signup_form_message").hide()
            }
            $("#overlaySignup").css("cursor", "auto");
            $("#site_signup_button").removeClass("disabled");
            $("#site_signup_button").parent().prop("href", "javascript:goSignup('signup');");
            break;
        }
        case "2": {
            txt = '<div id="feedback_block"><div id="feedback" align="center" class="info">';
            txt += responseArray.json["errmsg"];
            txt += "</div></div>";
            $("#cookieErr").text(txt);
            grayOut2(false, "sendSignup");
            resetResponse();
            break;
        }
        default: {
            $("#email_Err").text(responseArray.json.email_error);
            $("#password_Err").text(responseArray.json.password_error);
            $("#nickname_Err").text(responseArray.json.nickname_error);
            $("#terms_Err").text(responseArray.json.terms_error);
            $("#overlaySignup").css("cursor", "auto");
            $("#site_signup_button").removeClass("disabled");
            $("#site_signup_button").parent().prop("href", "javascript:siteSignup('signup');");
            break
        }
    }
}

function sendSignupComplete(A) {
    parseResponse(A);
    $("#signupform :input").prop("disabled", false);
    switch (A.charAt(A.indexOf("{") - 1)) {
        case "0":
            on_signup_or_login_complete_handler();
            resetResponse();
            grayOut2(false, "sendSignup");
            break;
        case "1": {
            if (responseArray.json.email_error != "&nbsp;") {
                $("#email_Err").text(GT.gettext(responseArray.json.email_error));
                resetResponse();
                $("#email_Err").show()
                $("#overlaySignup").css("cursor", "auto");
                $("#site_signup_button").removeClass("disabled");
                $("#site_signup_button").parent().prop("href", "javascript:siteSignup('signup');");
            }
            if (responseArray.json.password_error != "&nbsp;") {
                $("#password_Err").text(GT.gettext(responseArray.json.password_error));
                $("#password_Err").show()
            } else {
                $("#password_Err").hide()
            }
            if (responseArray.json.nickname_error != "&nbsp;") {
                $("#nickname_Err").text(GT.gettext(responseArray.json.nickname_error));
                $("#nickname_Err").show()
            } else {
                $("#nickname_Err").hide()
            }
            if (responseArray.json.terms_error != "&nbsp;") {
                $("#terms_Err").text(GT.gettext(responseArray.json.terms_error));
                $("#terms_Err").show()
            } else {
                $("#terms_Err").hide()
            }
            $("#overlaySignup").css("cursor", "auto");
            $("#site_signup_button").removeClass("disabled");
            $("#site_signup_button").parent().prop("href", "javascript:siteSignup('signup');;");
            break;
        }
        case "2": {
            txt = '<div id="feedback_block"><div id="feedback" align="center" class="info">';
            txt += responseArray.json["errmsg"];
            txt += "</div></div>";
            $("#cookieErr").text(txt);
            grayOut2(false, "sendSignup");
            resetResponse();
            break;
        }
        default: {
            $("#email_Err").text(responseArray.json.email_error);
            $("#password_Err").text(responseArray.json.password_error);
            $("#nickname_Err").text(responseArray.json.nickname_error);
            $("#terms_Err").text(responseArray.json.terms_error);
            $("#overlaySignup").css("cursor", "auto");
            $("#site_signup_button").removeClass("disabled");
            $("#site_signup_button").parent().prop("href", "javascript:siteSignup('signup');");
            break
        }
    }
}

function getCookie(C) {
    var B = document.cookie;
    var E = C + "=";
    var D = B.indexOf("; " + E);
    if (D == -1) {
        D = B.indexOf(E);
        if (D != 0) {
            return null
        }
    } else {
        D += 2
    }
    var A = document.cookie.indexOf(";", D);
    if (A == -1) {
        A = B.length
    }
    return unescape(B.substring(D + E.length, A))
}

function utmvCookieCheck(B) {
    var A = getCookie("__utmv");
    if (A == null) {
        return false
    }
    A = A.replace(/^\d*\./, "");
    return (A == B || A == "logged-in") ? true : false
}

function currPos() {
    var B = 0,
        A = 0;
    if (typeof (window.pageYOffset) == "number") {
        A = window.pageYOffset;
        B = window.pageXOffset
    } else {
        if (document.body && (document.body.scrollLeft || document.body.scrollTop)) {
            A = document.body.scrollTop;
            B = document.body.scrollLeft
        } else {
            if (document.documentElement && (document.documentElement.scrollLeft || document.documentElement.scrollTop)) {
                A = document.documentElement.scrollTop;
                B = document.documentElement.scrollLeft
            }
        }
    }
    return [B, A]
}

function trim(A) {
    A = A.replace(/^\s+/, "");
    A = A.replace(/\s+$/, "");
    return A
}

function showCouponPremiumAssetAlert(A, C, D) {
    var B = "";
    B = '<div style="background:transparent url(/static/store/' + A + "/char/" + C + '/thumbnail.jpg) -20px top no-repeat;padding-left:100px;clear:both;width:220px;"><p style="font-size:18px">Get ' + D + ' for free</p><br/><p style="font-size: 13px;width:220px">Create an account now or just login to get access to our <span style="font-size:16px;font-weight:bold;line-height:21px;color:orange">' + D + '</span> character for free.</p><br/><ul class="overlayHTMLul"><li style="width:110px;height:47px;overflow:hidden"><a href="javascript:hideHTMLBox();showSignup(250);"><img src="/static/ft/img/v2/btn_signup_arrow_small.gif" width="110" height="94" border="0"></a></li><li style="padding:10px 0px 10px 30px;"><a href="javascript:hideHTMLBox();showLogin(250);">login</a></li></ul></div>';
    showHTMLBox("", 180, B, "pr_willie_alert")
}

function showCouponPremiumAssetConfirm(A, C, D) {
    var B = "";
    B = '<div style="background:transparent url(/static/store/' + A + "/char/" + C + '/thumbnail.jpg) -20px top no-repeat;padding-left:100px;clear:both;width:220px;"><p style="font-size:18px">Congratulations!</p><br/><p style="font-size: 13px;width:220px"><span style="font-size:16px;font-weight:bold;line-height:21px;color:orange">' + D + '</span> is waiting for you to animate him in our studio.</p><br/><br/><ul class="overlayHTMLul"><li style="width:110px;height:39px;overflow:hidden"><a href="javascript:hideHTMLBox();location.href=\'/go/create\'"><img src="/static/ft/img/v2/btn_create.png" width="110" height="78" border="0"></a></li><li style="padding:10px 0px 10px 30px;"><a href="javascript:hideHTMLBox();">Close</a></li></ul></div>';
    showHTMLBox("", 180, B, "pr_willie_confirm")
}

function previewMovie(enc_id) {
    new Ajax.Request(URL_PREVIEW_MOVIE + "/" + enc_id, {
        method: "post",
        onSuccess: function (transport) {
            var response = transport.responseText;
            parseResponse(response);
            if (responseArray.code == "0") {
                $("player_code").innerHTML = responseArray.html;
                var scripts = $("player_code").getElementsByTagName("script");
                for (var ix = 0; ix < scripts.length; ix++) {
                    eval(scripts[ix].text)
                }
            } else {
                if (typeof responseArray.json.url != "undefined") {
                    window.location = responseArray.json.url
                } else {
                    displayFeedback(responseArray.code + responseArray.json.error)
                }
            }
        },
        onFailure: function () {
            displayFeedback("1" + GT.gettext("Error contacting the server"))
        }
    })
}

function iePngFix(D, A, J) {
    var F = navigator.appVersion.split("MSIE");
    var G = parseFloat(F[1]);
    if ((G >= 5.5) && (G < 7) && (document.body.filters)) {
        var E = (D.id) ? "id='" + D.id + "' " : "";
        var I = (D.className) ? "class='" + D.className + "' " : "";
        var C = (D.title) ? "title='" + D.title + "' " : "title='" + D.alt + "' ";
        var H = "display:inline-block;" + D.style.cssText;
        if (D.align == "left") {
            H = "float:left;" + H
        }
        if (D.align == "right") {
            H = "float:right;" + H
        }
        if (D.parentElement.href) {
            H = "cursor:hand;" + H
        }
        var B = "<span " + E + I + C + ' style="width:' + A + "px; height:" + J + "px;" + H + ";filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + D.src + "', sizingMethod='scale');\"></span>";
        D.outerHTML = B
    }
}

function toggleOverlay(A) {
    $(A).style.display = ($(A).style.display == "block") ? "none" : "block"
}

function in_array(F, E, C) {
    var D = false,
        B, A = !!C;
    for (B in E) {
        if ((A && E[B] === F) || (!A && E[B] == F)) {
            D = true;
            break
        }
    }
    return D
}

function array_push(D) {
    var B, A = arguments,
        C = A.length;
    for (B = 1; B < C; B++) {
        D[D.length++] = A[B]
    }
    return D.length
}

function showDomoOverlay() {
    grayOut2(true, null);
    $("domooverlay").style.top = jQuery(document).scrollTop() + 100 + "px";
    $("domooverlay").style.left = (jQuery(window).width() - $("domooverlay").getWidth()) / 2 + "px";
    $("domooverlay").css("display", "block");
}

function hideDomoOverlay() {
    grayOut2(false, null);
    $("domooverlay").css("display", "none");
}
var textareamaxlength = 2000;

function checkmaxlengthkeypress(C, A) {
    var B = window.event ? event.keyCode : A.which;
    if ((B == 32) || (B == 13) || (B > 47)) {
        if (C.value.length > textareamaxlength - 1) {
            if (window.event) {
                window.event.returnValue = null
            } else {
                A.cancelDefault;
                return false
            }
        }
    }
}

function checkmaxlengthkeyup(A) {
    if (A.value.length > textareamaxlength - 1) {
        A.value = A.value.substr(0, textareamaxlength)
    }
}

function checkmaxlengthpaste(E) {
    if ((window.event) && (detect.indexOf("safari") + 1 == 0)) {
        var C = E.document.selection.createRange();
        var B = textareamaxlength - E.value.length + C.text.length;
        try {
            var A = window.clipboardData.getData("Text").substr(0, B);
            C.text = A
        } catch (D) { }
        if (window.event) {
            window.event.returnValue = null
        } else {
            E.value = E.value.substr(0, textareamaxlength);
            return false
        }
    }
}

function reloadiFrame(A) {
    for (i = 0; i < A.length; i++) {
        $(A[i]).src = $(A[i]).src
    }
}

function createPlayer(S, H, A, B, a, l, I, e, O, o, Z, M, d, g, C, f, j, T, c, R, L, W, P, n, b, Q, E, D, m, F, U, k, K, X, J, Y, h, V, G) {
    var N = new SWFObject(H, "Player", A, B, "9.0.115", "#464646");
    N.useExpressInstall("/static/libs/expressInstall.swf");
    N.addParam("AllowScriptAccess", "always");
    N.addParam("wmode", a);
    N.addVariable("movieOwner", l);
    N.addVariable("movieOwnerId", I);
    N.addVariable("movieId", e);
    N.addVariable("movieLid", O);
    N.addVariable("movieTitle", o);
    N.addVariable("movieDesc", Z);
    N.addVariable("userId", M);
    N.addVariable("username", d);
    N.addVariable("uemail", g);
    N.addVariable("ut", "klsdfkldsfkljdsf");
    N.addVariable("apiserver", C);
    N.addVariable("thumbnailURL", f);
    N.addVariable("copyable", j);
    N.addVariable("isPublished", T);
    N.addVariable("ctc", c);
    N.addVariable("tlang", R);
    N.addVariable("is_private_shared", L);
    N.addVariable("autostart", W);
    N.addVariable("appCode", "go");
    N.addVariable("is_slideshow", n);
    N.addVariable("originalId", b);
    N.addVariable("is_emessage", Q);
    N.addVariable("isEmbed", E);
    N.addVariable("refuser", D);
    N.addVariable("utm_source", m);
    N.addVariable("uid", F);
    N.addVariable("isTemplate", U);
    N.addVariable("showButtons", k);
    N.addVariable("chain_mids", K);
    N.addVariable("showshare", X);
    N.addVariable("averageRating", J);
    N.addVariable("ratingCount", Y);
    N.addVariable("fb_app_url", h);
    N.addVariable("numContact", V);
    N.addVariable("isInitFromExternal", G);
    N.addParam("scale", "exactfit");
    N.addParam("allowFullScreen", "true");
    N.write(S)
}

function submitFBConnect() {
    if (typeof (FB) !== "undefined") {
        FB.ensureInit(function () {
            FB.Connect.requireSession(function () {
                var A = FB.Facebook.apiClient.get_session();
                FBConnectCheck(A.uid)
            })
        })
    } else {
        displayFeedback("1" + GT.gettext("Sorry, Facebook is blocked at your location."))
    }
}

function FBConnectCheck(A) {
    new Ajax.Request(URL_FBCONNECT_CHECK, {
        method: "post",
        onSuccess: function (E) {
            var B = E.responseText;
            parseResponse(B);
            if (responseArray.code == "0") {
                if (responseArray.json.status == "USER_EXIST") {
                    var D = window.location.href.indexOf("?signup=1");
                    if (D > 0) {
                        var C = window.location.href.substring(0, D);
                        window.location.href = C
                    } else {
                        window.location.reload()
                    }
                } else {
                    if (responseArray.json.status == "NO_USER") {
                        showGAAcctOverlay(true)
                    }
                }
            } else {
                if (responseArray.code == "1") {
                    window.location = responseArray.json.url
                }
            }
        },
        onFailure: function () {
            displayFeedback("1" + GT.gettext("Error contacting the server"))
        }
    })
}

function showGAAcctOverlay(B) {
    var A = currPos();
    A[1] = A[1] + 40;
    $("gaacctoverlay").css("display", "block");
    $("overlayObject2").style.margin = A[1] + "px 0px 0px 0px";
    if (B) {
        grayOut2(true, "showGAAcct")
    } else {
        grayOut2(false, "showGAAcct")
    }
}

function hideGAAcct() {
    grayOut2(false, "showGAAcct");
    $("gaacctoverlay").css("display", "none");
}

function showHaveGAAcctOverlay(B) {
    var A = currPos();
    A[1] = A[1] + 40;
    $("havegaacctoverlay").css("display", "block");
    $("overlayObject2").style.margin = A[1] + "px 0px 0px 0px";
    if (B) {
        grayOut2(true, "showHaveGAAcct")
    } else {
        grayOut2(false, "showHaveGAAcct")
    }
}

function hideHaveGAAcct() {
    grayOut2(false, "showHaveGAAcct");
    $("havegaacctoverlay").css("display", "none");
}

function gaacctcheck() {
    for (i = 0; i < document.gaacctForm.answer.length; i++) {
        if (document.gaacctForm.answer[i].checked) {
            ans = document.gaacctForm.answer[i].value
        }
    }
    hideGAAcct();
    if (ans == "yes") {
        showHaveGAAcctOverlay(true)
    } else {
        FBConnectSignIn()
    }
}

function FBConnectSignIn() {
    new Ajax.Request(URL_FBCONNECT_SIGNIN, {
        method: "post",
        onSuccess: function (B) {
            var A = B.responseText;
            parseResponse(A);
            if (responseArray.code == "0") {
                if (responseArray.json.status == "USER_ADDED") {
                    getFBPermission()
                }
            } else {
                if (responseArray.code == "1") {
                    window.location = responseArray.json.url
                }
            }
        },
        onFailure: function () {
            displayFeedback("1" + GT.gettext("Error contacting the server"))
        }
    })
}

function getFBPermission() {
    FB.ensureInit(function () {
        FB.Connect.showPermissionDialog("offline_access,publish_stream", function (A) {
            var C = FB.Facebook.apiClient.get_session();
            var B = false;
            if (C.expires == 0) {
                var C = FB.Facebook.apiClient.get_session();
                FBConnectUpdate(C.session_key);
                B = true
            }
            if (B == false) {
                FBConnectUpdate("no_key")
            }
        })
    })
}

function FBConnectUpdate(A) {
    new Ajax.Request(URL_FBCONNECT_SIGNIN, {
        method: "post",
        parameters: "fb_key=" + A,
        onSuccess: function (C) {
            var B = C.responseText;
            parseResponse(B);
            if (responseArray.code == "0") {
                if (responseArray.json.status == "USER_UPDATED") {
                    window.location.reload()
                } else {
                    if (responseArray.json.status == "USER_NO_KEY") {
                        window.location.reload()
                    }
                }
            } else {
                if (responseArray.code == "1") {
                    window.location = responseArray.json.url
                }
            }
        },
        onFailure: function () {
            displayFeedback("1" + GT.gettext("Error contacting the server"))
        }
    })
}

function checkFBLogin(B, A) {
    if (getCookie(B) == null && getCookie(A)) {
        FBConnectCheck()
    }
}

function chooseLanguage(A) {
    $.ajax({
        type: "POST",
        url: URL_CHOOSE_LANGUAGE + "?lang=" + A + "&uri=" + window.location,
        success: function (C) {
            chooseLanguageComplete(C)
        },
        failure: function () {
            displayFeedback("1" + GT.gettext("Error contacting the server"))
        }
    })
}

function chooseLanguageComplete(A) {
    parseResponse(A);
    if (typeof responseArray.json.url != "undefined") {
        window.location = responseArray.json.url
    }
    resetResponse()
}

function buttonOver(B, A) {
    $('#' + B + 'left').css('margin', A + 'px 0 0 0');
    $('#' + B + 'right').css('margin', A + 'px 0 0 0');
    $('#' + B + 'centerinactive').css('display', 'none');
    $('#' + B + 'centeractive').css('display', 'block');
}

function buttonOut(A) {
    $('#' + A + 'left').css('margin', '0 0 0 0');
    $('#' + A + 'right').css('margin', '0 0 0 0');
    $('#' + A + 'centerinactive').css('display', 'none');
    $('#' + A + 'centeractive').css('display', 'block');
}

function checkEnter(e, js_func, js_params) {
    var keycode;
    if (window.event) {
        keycode = window.event.keyCode
    } else {
        if (e) {
            keycode = e.which
        } else {
            return true
        }
    }
    if (keycode == 13) {
        eval(js_func + "(" + js_params + ");");
        return false
    } else {
        return true
    }
}

function isPepperFlashInForce() {
    var e = false;
    var c = "application/x-shockwave-flash";
    var b = navigator.mimeTypes;
    var a = function (g, f) {
        return g.indexOf(f, g.length - f.length) !== -1
    };
    if (b && b[c] && b[c].enabledPlugin && (b[c].enabledPlugin.filename == "pepflashplayer.dll" || b[c].enabledPlugin.filename == "libpepflashplayer.so" || a(b[c].enabledPlugin.filename, "PepperFlashPlayer.plugin"))) {
        e = true
    }
    return e
}

function fullscreenStudio(b) {
    var a;
    if (isPepperFlashInForce()) {
        window.location.href = b
    } else {
        a = window.open(b, "wndstudio");
        if (a == null) {
            window.alert("Cannot open new window for studio")
        }
    }
}
loadedFullscreenStudio = false;

function full_screen_studio() {
    loadedFullscreenStudio = true;
    $("body").addClass("full_screen_studio");

}

function createPreviewPlayer(b, c, a) {
    $("#" + b).flash({
        id: "Player",
        swf: c.player_url,
        height: c.height,
        width: c.width,
        quality: c.quality,
        scale: "exactfit",
        allowScriptAccess: "always",
        allowFullScreen: "true",
        wmode: "window",
        hasVersion: "10.3",
        flashvars: a
    })
}


//settings

function unescapeStuff(content) {
    if (!$(content).val()) { return; }
    var escaped = {
        '&amp;': "&",
        '&lt;': '<',
        '&gt;': '>',
        "&#39;": "'",
        '&quot;': '"',
        '&#x2F;': '/',
        '&#x60;': '`',
        '&#x3D;': '=',
        '&#35;': '#'
    };
    return $(content).val($(content).val().replace(/(?:&(?:[A-Za-z_:][\w:.-]*|\#(?:[0-9]+|x[0-9a-fA-F]+));)/g, function (m) {
        return escaped[m];
    }));
}

function repAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function startTimer(duration) {
    var timer = duration, minutes, seconds;
    elapsed = 0
    johnelapsed = 0
    johntimer = setInterval(function () {
        johnelapsed = johnelapsed + 0.1;
        var johnpercentage = (15 + (johnelapsed / (duration / 60)))
        if (--johntimer < 0) {
            clearInterval(johntimer)
        }
        if (johnpercentage < 19) {
            $('#john').css('left', 19 + "%")
        }
        else if (johnpercentage < 72) {
            $('#john').css('left', johnpercentage + "%")
        }
    }, 100)
    time = setInterval(function () {
        //0 - 60
        elapsed++
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);
        var percentage = ((elapsed / (duration / 60))) + "%"
        $('#fill').css('width', percentage)
        $('#minute_2').removeClass();
        $('#minute_2').addClass('number_' + minutes);
        if (!minutes) {
            $('#minute').addClass('number_' + 0);
        }

        if (seconds <= 30 && minutes == 0) {
            $('#second_1').css('filter', 'invert(44%) sepia(55%) saturate(7229%) hue-rotate(345deg) brightness(91%) contrast(126%)')
            $('#second_2').css('filter', 'invert(44%) sepia(55%) saturate(7229%) hue-rotate(345deg) brightness(91%) contrast(126%)')
            $('#minute_1').css('filter', 'invert(44%) sepia(55%) saturate(7229%) hue-rotate(345deg) brightness(91%) contrast(126%)')
            $('#minute_2').css('filter', 'invert(44%) sepia(55%) saturate(7229%) hue-rotate(345deg) brightness(91%) contrast(126%)')
            $('#number_divider').css('filter', 'invert(44%) sepia(55%) saturate(7229%) hue-rotate(345deg) brightness(91%) contrast(126%)')
        }

        if (seconds >= 10) {
            var num = seconds.toString().split('');
            $('#second_1').removeClass();
            $('#second_2').removeClass();
            $('#second_1').addClass('number_' + num[0]);
            $('#second_2').addClass('number_' + num[1]);
        } else {
            $('#second_1').removeClass();
            $('#second_2').removeClass();
            $('#second_1').addClass('number_0');
            $('#second_2').addClass('number_' + seconds);
        }
        if (--timer < 0) {
            clearInterval(time)
        }
    }, 1000);
}

var isSearchOpen = false;
function doSearch() {
    if (!isSearchOpen) {
        $('#searchbar').focus();
        $('#searchbar').addClass("active")
        $('#searchbar').on('keydown', function (event) {
            var charCode = (typeof event.which === "number") ? event.which : event.keyCode;
            if (charCode == 13) {
                doSearch();
            }
        })
        isSearchOpen = true;
    } else {
        if (!$('#searchbar').val() == "") {
            if (section == "videos") {
                window.location = '/searchresults/videos/?criteria=' + encodeURIComponent($('#searchbar').val())
            } else if (section == "users") {
                window.location = '/searchresults/users/?criteria=' + encodeURIComponent($('#searchbar').val())
            } else if (section == "shop") {
                window.location = '/searchresults/shop/?criteria=' + encodeURIComponent($('#searchbar').val())
            }
        } else {
            $('#searchbar').blur()
            $('#searchbar').removeClass("active")
            isSearchOpen = false;
        }
    }
}

function showOutlinkWarning(link) {
    showConfirmBox('Are you sure you want to leave?', 125, 'Be careful and always check what links you click!', 'javascript:window.open(\'' + link + '\');')
}