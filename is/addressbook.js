
var URL_IMPORT_GMAIL = "/ajax/importgmail";
var URL_ADDRESS_BOOK = "/ajax/addressbook";
var URL_IMPORT_ALL_CONTACT = "/ajax/getAllAddress";
var URL_SEND_INVITE = "/ajax/sendInvite";
var URL_IMPORT_YAHOO = "/ajax/importyahoo";
var URL_YAHOO_ADDRESSBOOK = "/ajax/yahooAddressbookAuth";
var URL_LOGIN_CONTACT = "/ajax/importcontacts";
var URL_GET_USER_CONTACT = "/ajax/getUserVars";
var URL_SEND_SHARE = "/ajax/sendShare";
var URL_FETCH_PREVIEW = "/ajax/fetchMailPreview";
var URL_SECURE_LOGIN_CONTACT = "http://" + location.hostname + "/ajax/importcontacts";
var ddd = "";
var inviteContactName = "rcpt_ml_area";
var userAdded = function (A) { };
var userRemoved = function (A) { };
Picker.setServiceName("FlashThemes.net Address Book");
Picker.setUserAddCallback(userAdded);
Picker.setUserRemoveCallback(userRemoved);

function CheckAll(A) {
    if (A.length == undefined) {
        A.checked = true
    } else {
        for (i = 0; i < A.length; i++) {
            A[i].checked = true
        }
    }
}

function UnCheckAll(A) {
    if (A.length == undefined) {
        A.checked = false
    } else {
        for (i = 0; i < A.length; i++) {
            A[i].checked = false
        }
    }
}

function importFromGmail() {
    var B = $("#contactlist");
    var A = $("#importgmail");
    var C = $("#importyahoo");
    B.css('display','none');
    C.css('display','none');
    A.css('display','block');
    Picker.render("picker_container")
}

function importFromYahoo() {
    var C = $("#contactlist");
    var B = $("#importgmail");
    var D = $("#importyahoo");
    var A = $("#page_name").html();
    C.css('display','none')
    D.css('display','block')
    B.css('display','none')
    yddd = window.setInterval('printDot("LoadingContactddd")', 300);
    $.ajax({
        type: "POST",
        url: URL_YAHOO_ADDRESSBOOK + "/" + A,
        success: function (E) {
            parseResponse(E);
            $("#yahooloading").css('display','none');
            window.clearInterval(yddd);
            if (responseArray.code == "0") {
                importyahoocss();
                D.html(responseArray.html)
            } else {
                displayFeedback(responseArray.code + responseArray.json.error)
            }
        },
        error: function () {
            displayFeedback("1" + GT.gettext("Error contacting the server"))
        },
        failure: function () {
            displayFeedback("1" + GT.gettext("Error contacting the server"))
        }
    })
}

function importyahoocss() {
    var A = "yahoo_import_container";
    var B = document.createElement("style");
    B.setAttribute("type", "text/css");
    var C = `#${A} {        font: 100% Arial, sans-serif;        -moz-border-radius: 3px;        -webkit-border-radius: 3px;        position: relative;        top: 0.5em;      }            #${A} div {        height: 100%;        float: left;        margin: 0;        padding: 0;      }            #${A} div#yahoo_header_pane {        height: 32px;        background: transparent url(/static/go/img/v2/nav_bg.gif) repeat-x scroll 0 0;        vertical-align: middle;        width: 100%;      }            #${A} div#yahoo_groups_container {        width: 25%;        height: 200px;        position: relative;        border-right: 2px solid #c3d9ff;      }            #${A} div#yahoo_contacts_container {        width: 70%;        height: 200px;        position: relative;        border-right: 2px solid #c3d9ff;      }            #${A} div#yahoo_info_container {        width: 33%;        height: 200px;        position: relative;      }            #${A} div.yahoo_column {        width: 100%;      }            #${A} div#yahoo_groups_pane {        position: static;        overflow: auto;      }            #${A} div#yahoo_groups_pane li {        overflow: hidden;      }            #${A} div#yahoo_groups_pane li a {        width: 9999%;      }            #${A} div#yahoo_contacts_pane {        position: static;        overflow: auto;      }            #${A} div#yahoo_contacts_pane li {        overflow: hidden;      }            #${A} div#yahoo_contacts_pane li a {        width: 9999%;      }            #${A} div#yahoo_info_pane {        width: 100%;        position: relative;        overflow: auto;      }            #${A} div#yahoo_footer_pane {        height: 32px;        background-color: #ACCBE0;        vertical-align: middle;        width: 100%;        clear: both;        /*float: none;*/      }            #${A} #yahoo_title {        font-weight: bold;        margin: 0;        padding: 0.4em;        height: 100%;        vertical-align: middle;        font-size: 125%;      }            #${A} ul {        list-style-type: none;        padding: 0;        margin: 0;      }            #${A} li {        margin: 0;        padding: 2px 5px;        height: 1.3em;        line-height: 1.3em;      }            #${A} li input {        margin: 0 3px;      }            #${A} li.yahoo_endspecial {        border-bottom: 1px solid #c3d9ff;      }            #${A} li a {        display: block;        color: #000;        text-decoration: none;      }            #${A} li.yahoo_selected, #${A} li.yahoo_selected:hover {        background-color: #c3d9ff;        color: #0000cc;        font-weight: bold;      }            #${A} li.yahoo_selected a, #${A} li.yahoo_selected:hover a {        color: #0000cc;      }            #${A} li:hover {        background-color:  #ffffcc;      }            #${A} .yahoo_info_block {        float: none;        width: 95%;        position: static;        padding: 0.5em;        height: auto;      }            #${A} #yahoo_info_pane p {        margin: 0;        padding: 0;      }            #${A} .yahoo_info_title {        font-weight: bold;        font-size: 1.1em;      }            #${A} .yahoo_info_meta {        color: #777;      }            #${A} #yahoo_logout {        margin: 0 1em;        line-height: 32px;      }            #${A} #yahoo_logout a {        text-decoration: none;      }`;
    if (B.styleSheet) {
        B.styleSheet.cssText = C
    } else {
        var D = document.createTextNode(C);
        B.appendChild(D)
    }
    document.getElementsByTagName("head")[0].appendChild(B)
}

function yahooSignin(A) {
    location.href = A
}

function showContact() {
    if ($("#json_user").text() == "1") {
        var A = get_cookie("gmaillogin");
        if (A == "1") {
            delete_cookie("gmaillogin")
        }
        var C = $("#contactlist");
        var B = $("#importgmail");
        var D = $("#importyahoo");
        C.css('display','block');
        D.css('display','none');
        B.css('display','none');
    } else {
        showAddressBook(false);
        grayOut(false, "showInviteAddressBook")
    }
}

function checkGmailProcess() {
    var A = get_cookie("gmaillogin");
    if (A == "1") {
        showAddressBook(true)
    }
}

function checkYahooProcess() {
    var A = get_cookie("yahoologin");
    if (A == "1") {
        showAddressBook(true)
    }
}

function showInvitePreview(B) {
    var A = $("#overlayInvitePreview");
    if (B) {
        if (A != null) {
            A.css('display','block')
            $("#sndr_nm_text").html($("#sndr_nm_input").val());
            $("#sndr_ml_text").html($("#sndr_ml_input").val());
            INVITE_FRIEND_FOOTER = INVITE_FRIEND_FOOTER.replace(/<<<username>>>/g, $("sndr_nm_input").val());
            INVITE_FRIEND_FOOTER = INVITE_FRIEND_FOOTER.replace(/<<<useremail>>>/g, $("sndr_ml_input").val());
            if ($("#cntnt_area").val() == "") {
                $("#preview_area").val(INVITE_FRIEND_STANDARD_MSG + INVITE_FRIEND_FOOTER)
            } else {
                $("#preview_area").val($("#cntnt_area").val() + INVITE_FRIEND_FOOTER)
            }
        }
    } else {
        A.css('display','none')
    }
}

function showSharePreview(B) {
    var A = $("#overlaySharePreview");
    if (B) {
        if (A != null) {
            A.css('display','block');
            $("#sndr_nm_text").html($("#sndr_nm_input").val());
            $("#sndr_nm_text2").html($("#sndr_nm_input").val());
            $("#sndr_ml_text").html($("#sndr_ml_input").val());
            if (call_src == "") {
                $.ajax({
                    type: "POST",
                    url: URL_FETCH_PREVIEW,
                    data: { 
                        type: "movieshare",
                        sendername: $("#sndr_nm_input").val(),
                        senderemail: $("#sndr_ml_input").val(),
                        movie: $("#movieId").val(),
                        msg: ($("#cntnt_area").val() == "" ? SHARE_EMAIL_STANDARD_MSG : $("#cntnt_area").val())
                    },
                    success: function (C) {
                        parseResponse(C);
                        if (responseArray.code == "0") {
                            $("#preview_area").val( )= responseArray.json.emailText
                        }
                    }
                })
            } else {
                if (call_src == "faf" || call_src == "invite") {
                    $.ajax({
                        type: "POST",
                        url: URL_FETCH_PREVIEW,
                        data: {
                            type: "invite",
                            sendername: $("#sndr_nm_input").val(),
                            senderemail: $("#sndr_ml_input").val(),
                            msg: ($("#cntnt_area").val() == "" ? SHARE_EMAIL_STANDARD_MSG : $("#cntnt_area").val())
                        },
                        success: function (C) {
                            parseResponse(C);
                            if (responseArray.code == "0") {
                                $("#preview_area").val() = responseArray.json.emailText
                            }
                        }
                    })
                }
            }
        }
    } else {
        A.css('display','none')
    }
}

function showAddressBook(E) {
    if (E == "ymail") {
        var A = true
    }
    if (E == "gmail") {
        var D = true
    }
    if ($("#overlayAddressbook") == null) {
        flashAppName = "Studio"
    }
    if ($("#sndr_nm_box") != null) {
        flashAppName = "Invite"
    }
    var B = $("#overlayAddressbook");
    if (B == null) {
        B = $("#overlayStudioAddressbook")
    }
    var C = $("#overlayAddressBar");
    if (!E) {
        B.css('display','none');
        if (C != null) {
            C.css('display','none')
        }
        return
    }
    $.ajax({
        type: "POST",
        url: URL_ADDRESS_BOOK + "/" + flashAppName,
        success: function (G) {
            parseResponse(G);
            if (responseArray.code == "0") {
                B.html(responseArray.html);
                if (E) {
                    if (B != null) {
                        B.css('display','block')
                    }
                    if (C != null) {
                        C.css('display','block')
                    }
                    var F = get_cookie("gmaillogin");
                    if (F == "1" || (D != null && D)) {
                        importFromGmail()
                    } else {
                        if (A != null && A) {
                            importFromYahoo()
                        } else {
                            showContact()
                        }
                    }
                }
            } else {
                displayFeedback(responseArray.code + responseArray.json.error)
            }
        },
        error: function () {
            displayFeedback("1" + GT.gettext("Error contacting the server"))
        },
        failure: function () {
            displayFeedback("1" + GT.gettext("Error contacting the server"))
        }
    })
}

function importEmailContacts(E, D) {
    if ($("#json_user").text() == "1") {
        var serialized = $(`#${E}`).serializeArray();
        var postdata = {};
        for (var i = 0; i < serialized.length; i++) {
            postdata[i]["name"] = serialized[i]["value"];
        }
        $.ajax({
            type: "POST",
            url: URL_IMPORT_GMAIL,
            data: postdata,
            success: function (G) {
                parseResponse(G);
                if (responseArray.code == "0") {
                    displayFeedback(responseArray.code + D + " contacts successfully imported.");
                    showAddressBook(true)
                } else {
                    displayFeedback(responseArray.code + responseArray.json.error)
                }
            },
            error: function () {
                displayFeedback("1" + GT.gettext("Error contacting the server"));
                $(`#${E}`).enable()
            },
            failure: function () {
                displayFeedback("1" + GT.gettext("Error contacting the server"));
                $(`#${E}`).enable()
            }
        })
    } else {
        var F = "";
        var C = 0;
        var A = $("#contact_selector_" + C);
        while (A != null && C < 10) {
            if (A.checked == true) {
                var B = A.value;
                B = B.split(";");
                if ($("#rcpt_ml_area") == null) {
                    F += B[1] + ","
                } else {
                    F += B[1] + "\n"
                }
            }
            C++;
            A = $("#contact_selector_" + C)
        }
        F = F.substr(0, F.length - 1);
        if ($("#rcpt_ml_area") == null) {
            add2flash(F)
        } else {
            add2form(F)
        }
        showAddressBook(false);
        grayOut(false, "showInviteAddressBook")
    }
}

function importAllContacts(A) {
    $.ajax({
        type: "POST",
        url: URL_IMPORT_ALL_CONTACT + "/" + A, 
        success: function (B) {
            parseResponse(B);
            if (typeof responseArray.json.url != "undefined") {
                window.location = responseArray.json.url
            } else {
                if (responseArray.code == "0") {
                    displayFeedback(responseArray.code + "All contacts are successfully added");
                    $("#rcpt_ml_area").val(responseArray.json.email_list);
                    var C = responseArray.json.email_list.split(",");
                    $("#import_all_num").text(C.length)
                } else {
                    displayFeedback(responseArray.code + responseArray.json.error)
                }
            }
            resetResponse()
        },
        error: function () {
            displayFeedback("1" + GT.gettext("Error contacting the server"))
        },
        failure: function () {
            displayFeedback("1" + GT.gettext("Error contacting the server"))
        }
    })
}

function checkSelectNum(C, B) {
    var A = B;
    $("#listing_counter").html("&nbsp;");
    for (i = 0; i < document.contactform.mlist.length; i++) {
        if (document.contactform.mlist[i].checked == true) {
            A--
        }
    }
    if (A <= 6 && A > 0) {
        $("#listing_counter").css("color", "orange");
        $("#listing_counter").html(A + " remaining");
    } else {
        if (A <= 0) {
            $("#listing_counter").css("color", "red");
            $("#listing_counter").html("reached maximum " + B);
        }
    }
    if (A < 0) {
        if (C.checked == true) {
            C.checked = false;
            alert("Oops, maximum " + B + " messages reached.\nPlease unselect one to choose this one.")
        }
    }
}

function showPreview(A) {
    if (validateInviteForm(A)) {
        grayOut(true, "showEmailPreview");
        showInvitePreview(true)
    }
}

function clearInviteForm() {
    $("#nvtfrm").reset();
    $("#rcpt_ml_area").val("")
}

function validateInviteForm(A) {
    $("#errMsg").html("&nbsp;");
    $("#sndr_nm_ttl").css("color", "black");
    $("#sndr_ml_ttl").css("color", "black");
    $("#rcpt_ml_ttl").css("color", "black");
    if ($("#sndr_nm_input").val() == "") {
        $("#errMsg").html("Please enter Your Name");
        $("#sndr_nm_ttl").css("color", "red");
        return false
    }
    if ($("#sndr_ml_input").val() == "") {
        $("#errMsg").html("Please enter Your Email");
        $("#sndr_ml_ttl").css("color", "red");
        return false
    }
    if ($("#rcpt_ml_area").val() == "") {
        $("#errMsg").html("Please enter Your Friend Emails");
        $("#rcpt_ml_ttl").css("color", "red");
        return false
    }
    if (validateEmailList() > A) {
        $("#errMsg").html("Over maximum of " + A + " email addresses");
        $("#rcpt_ml_ttl").css("color", "red");
        return false
    }
    var B = $("#rcpt_ml_area").val();
    if (B.indexOf(",") >= 0) {
        $("#errMsg").html("Please remove commas in Your Friend Emails");
        $("#rcpt_ml_ttl").css("color", "red");
        return false
    }
    return true
}

function validateEmailList() {
    var A = $("#rcpt_ml_area").val();
    A = A.split("\n");
    return A.length
}

function sendInvite(A) {
    if (validateInviteForm(A)) {
        var B = $("rcpt_ml_area").value;
        B = B.replace(/\r\n/g, ",");
        B = B.replace(/\n/g, ",");
        $("#rcpt_ml_area").val(B);
        $("#cntnt_subject").val($("#sndr_sub").html() + $("#sndr_nm_text2").html());
        ddd = window.setInterval('printDot("dotdotdot")', 300);
        grayOut(true, "sendInviteEmail");
        $("#overlaySending").css('display','block');
        var serialized = $(`#nvtfrm`).serializeArray();
        var postdata = {};
        for (var i = 0; i < serialized.length; i++) {
            postdata[i]["name"] = serialized[i]["value"];
        }
        $.ajax({
            type: "POST",
            url: URL_SEND_INVITE,
            data: postdata,
            success: function (C) {
                sendInviteComplete(C)
            },
            error: function () {
                displayFeedback("1" + GT.gettext("Error contacting the server"));
                $("#nvtfrm").enable();
                grayOut(false, "sendInviteEmail");
                $("#overlaySending").css('display','none');
                window.clearInterval(ddd)
            },
            failure: function () {
                displayFeedback("1" + GT.gettext("Error contacting the server"));
                $("#nvtfrm").enable();
                grayOut(false, "sendInviteEmail");
                $("#overlaySending").css('display','none');
                window.clearInterval(ddd)
            }
        });
        $("#nvtfrm").disable()
    }
}

function sendInviteComplete(B) {
    parseResponse(B);
    $("#nvtfrm").enable();
    switch (responseArray.code) {
        case "0":
            location.href = responseArray.json.url;
            break;
        case "1":
            $("#captcha_type").setAttribute("value", "image");
            $("#captcha_id").setAttribute("value", responseArray.json.session_id);
            $("#captcha_image").setAttribute("src", responseArray.json.url);
            $("#comment_captcha").css('display','block');
            $("#image_captcha").css('display','block');
            $("#audio_captcha").css('display','none');
            $("#inviterighttop").css("height", "350px");
            var A = $("#rcpt_ml_area").val();
            A = A.replace(/,/g, "\n");
            $("#rcpt_ml_area").val(A);
            break;
        case "2":
            $("#captcha_type").setAttribute("value", "audio");
            $("#captcha_id").setAttribute("value", responseArray.json.session_id);
            $("#captcha_audio").innerHTML = getAudioEmbedString(responseArray.json.url);
            $("#comment_captcha").css('display','block');
            $("#image_captcha").css('display','none');
            $("#audio_captcha").css('display','block');
            $("#inviterighttop").css("height", "350px");
            var A = $("#rcpt_ml_area").val();
            A = A.replace(/,/g, "\n");
            $("#rcpt_ml_area").val(A);
            break;
        case "3":
        default:
            displayFeedback(responseArray.code + responseArray.json.error);
            break
    }
    grayOut(false, "sendInviteEmail");
    $("#overlaySending").css('display','none');
    window.clearInterval(ddd);
    resetResponse()
}

function showContactCancel() {
    window.clearInterval(lddd);
    $("#overlayObject").css("margin", "150px 0px 0px 0px");
    $("#overlayContact").css('display','block');
    $("#overlayLoadingContact").css('display','none');
    $("#overlayContactFound").css('display','none');
    $("#overlayContactList").css('display','none');
    $("#overlayShareComplete").css('display','none');
    $("#overlaySharePreview").css('display','none');
    $("#overlayCaptcha").css('display','none');
    $("#overlayContactLogin").css('display','block');
    $("#contactLoginForm").css('display','block');
    $("#contactShareForm").css('display','block');
    $("#emailshare_captcha_id").setAttribute("value", "")
}

function sendAnotherEmail() {
    $("#cntnt_area").val(SHARE_EMAIL_STANDARD_MSG + "\n");
    showContactCancel()
}
var call_src = "";

function showContactOverlay(B, C) {
    var A = currPos();
    A[1] = A[1] - 246;
    $("#overlayContact").css('top',A[1] + "px");
    window.clearInterval(lddd);
    if (B) {
        if (C == undefined) {
            $("#overlayShareEmail").css('display','block');
            $("#overlayShareEmail").css('top',A[1] + 60 + "px");
            $("#eaf_body").html('<iframe src="/email_a_friend/' + $("#eaf_movie_enc_id").html() + '" frameborder="0" scrolling="no" style="width:640px;height:370px;-webkit-border-radius:10px;-moz-border-radius:10p;border-radius:10px"></iframe>');
            grayOut(true, "showEmailContact")
        } else {
            if (C == "faf" || C == "invite") {
                showContactCancel();
                call_src = C;
                $("#cntnt_area").val(INVITE_FRIEND_STANDARD_MSG + "\n");
                if (typeof view_name != "undefined" && view_name == "domo") {
                    $("#overlayContactTitle").html("Invite your friends to Domo")
                } else {
                    $("#overlayContactTitle").html(GT.gettext("Invite your friends to GoAnimate"))
                }
                $("#cntnt_subject").val($("#sndr_sub").html());
                grayOut(true, "findFriends/showEmailContact")
            }
        }
    } else {
        if (call_src == "") {
            $("#overlayShareEmail").css('display','none');
            grayOut(false, "showEmailContact");
            $("#eaf_body").html("")
        } else {
            if (call_src == "faf" || call_src == "invite") {
                $("#contactLoginErr").html("&nbsp;");
                $("#errMsg").html("&nbsp;");
                $("#sndr_nm_ttl").css("color", "black");
                $("#sndr_ml_ttl").css("color", "black");
                $("#rcpt_ml_ttl").css("color", "black");
                $("#overlayContact").css('display','none');
                grayOut(false, "findFriends/showEmailContact")
            }
        }
    }
}
var lddd = "";

function contactLogin(E) {
    var D = $(`#${E}`);
    $("#contactLoginErr").html("&nbsp;");
    if (D.find("#username").val() == "") {
        $("#contactLoginErr").html(GT.gettext("Please enter email"));
        return
    }
    if (D.find("#passwd").val() == "") {
        $("#contactLoginErr").html(GT.gettext("Please enter password"));
        return
    }
    var G = D.find("#username").val();
    var F = G.substring(0, G.lastIndexOf("@") + 1);
    var C = G.substring(F.length, G.length + 1);
    var B = GT.gettext("Import Contacts from <PROVIDER>");
    if (C.indexOf("gmail") != -1) {
        $("#contactProvider").html("<img src='/static/go/img/email_import/logo_gmail.gif'>");
        $("#contactProviderHeader").html(B.replace("<PROVIDER>", "<img src='/static/go/img/email_import/logo_gmail_s.gif'>"))
    } else {
        if (C.indexOf("yahoo") != -1 || C.indexOf("ymail") != -1) {
            $("#contactProvider").html("<img src='/static/go/img/email_import/logo_yahoo.gif'>");
            $("#contactProviderHeader").html(B.replace("<PROVIDER>", "<img src='/static/go/img/email_import/logo_yahoo_s.gif'>"))
        } else {
            if (C.indexOf("aol") != -1 || C.indexOf("aim.com") != -1) {
                $("#contactProvider").html("<img src='/static/go/img/email_import/logo_aol.gif'>");
                $("#contactProviderHeader").html(B.replace("<PROVIDER>", "<img src='/static/go/img/email_import/logo_aol_s.gif'>"))
            } else {
                if (C.indexOf("hotmail") != -1 || C.indexOf("live") != -1 || C.indexOf("msn.com") != -1 || C.indexOf("passport.com") != -1) {
                    $("#contactProvider").html("<img src='/static/go/img/email_import/logo_window.gif'>");
                    $("#contactProviderHeader").html(B.replace("<PROVIDER>", "<img src='/static/go/img/email_import/logo_windowLive_s.gif'>"))
                } else {
                    $("#contactLoginErr").html(GT.gettext("Please enter an email from supported providers"));
                    return
                }
            }
        }
    }
    $("#overlayContactLogin").css('display','none');
    $("#overlayLoadingTextGo").css('display','none');
    $("#overlayLoadingTextOI").css('display','block');
    $("#overlayLoadingTextSnd").css('display','none');
    $("#overlayLoadingContact").css('display','block');
    lddd = window.setInterval('printDot("LoadingDotDotDot")', 300);
    var A = navigator.userAgent;
    A = A.toLowerCase();
    var serialized = D.serializeArray();
    var postdata = {};
    for (var i = 0; i < serialized.length; i++) {
        postdata[i]["name"] = serialized[i]["value"];
    }
    $.ajax({
        type: "POST",
        url: URL_LOGIN_CONTACT,
        data: postdata,
        success: function (H) {
            contactLoginCallback(H, E)
        },
        error: function () {
            displayFeedback("1" + GT.gettext("Error contacting the server"));
            D.enable();
            window.clearInterval(lddd)
        },
        failure: function () {
            displayFeedback("1" + GT.gettext("Error contacting the server"));
            D.enable();
            window.clearInterval(lddd)
        }
    });
    D.disable()
}

function contactLoginCallback(C, B) {
    var A = $(`#${B}`);
    parseResponse(C);
    A.enable();
    if (responseArray.code == "0") {
        if (typeof responseArray.json.url != "undefined") {
            window.location = responseArray.json.url
        } else {
            if (typeof responseArray.json.error != "undefined") {
                $("#overlayContactLogin").css('display','block');
                $("#overlayLoadingContact").css('display','none');
                $("#contactLoginErr").html(responseArray.json.error);
                $("#usr_box").focus()
            } else {
                if ($("#overlayLoadingContact").css("display") == "block") {
                    $("#contactform").reset();
                    $("#FoundNum").html(responseArray.json.found_num);
                    $("#overlayLoadingContact").css('display','none');
                    $("#overlayContactFound").css('display','block')
                }
                $("ListContacts").html(responseArray.html);
                CheckAll(document.contactform.mlist)
            }
        }
    } else {
        if (typeof responseArray.json.url != "undefined") {
            window.location = responseArray.json.url
        } else {
            displayFeedback(responseArray.code + responseArray.json.error)
        }
    }
    window.clearInterval(lddd)
}

function getUserInfo(param) {
    $.ajax({
        type: "POST",
        url: URL_GET_USER_CONTACT, 
        data: param,
        success: function (response) {
            parseResponse(response);
            if (typeof responseArray.json.url != "undefined") {
                window.location = responseArray.json.url
            } else {
                if (responseArray.code != "0") {
                    displayFeedback(responseArray.code + responseArray.json.error)
                } else {
                    div_id = responseArray.json.div_id;
                    div_ids = div_id.split(",");
                    for (var i = 0; i < div_ids.length; i++) {
                        $(div_ids[i]).value = eval("responseArray['json']." + div_ids[i])
                    }
                }
            }
        },
        error: function () {
            displayFeedback("1" + GT.gettext("Error contacting the server"))
        },
        failure: function () {
            displayFeedback("1" + GT.gettext("Error contacting the server"))
        }
    })
}

function selectContacts() {
    $("#overlayContactList").show();
    $("#overlayContactFound").hide()
}

function selectall() {
    CheckAll(document.contactform.mlist);
    add2contact(getSelected(document.contactform))
}

function add2contact(D) {
    var C = $(`#${inviteContactName}`).val();
    $(`#${inviteContactName}`).val(C + D);
    if ($(`#${inviteContactName}`).val() != "") {
        var B = $("#import_btn").attr('class');
        if (B.indexOf("_gray") < 0) {
            $("#import_btn").attr('class', B + "_gray")
        }
        var A = $("#snd_btn").attr('class');
        if (A.indexOf("_orange") < 0) {
            $("snd_btn").attr('class', A + "_orange")
        }
    }
    $("#overlayContactLogin").css('display','block');
    $("#overlayContactList").hide();
    $("#overlayContactFound").hide()
}

function swapButton() {
    if ($(`#${inviteContactName}`).val() != "") {
        var B = $("#import_btn").attr('class');
        if (B.indexOf("_gray") < 0) {
            $("import_btn").attr('class', B + "_gray")
        }
        var A = $("#snd_btn").attr('class');
        if (A.indexOf("_orange") < 0) {
            $("snd_btn").attr('class', A + "_orange")
        }
    } else {
        $("#import_btn").attr('class', "import_btn");
        $("#snd_btn").attr('class', "snd_btn")
    }
}

function SelectContact() {
    showContactCancel();
    $("#overlayContactLogin").css('display','none');
    $("#overlayLoadingTextGo").css('display','block');
    $("#overlayLoadingTextOI").css('display','none');
    $("#overlayLoadingTextSnd").css('display','none');
    $("#overlayLoadingContact").css('display','block');
    lddd = window.setInterval('printDot("LoadingDotDotDot")', 300);
    $("#contactProviderHeader").html("Select the contacts you want to email");
    $.ajax({
        type: "POST",
        url: URL_ADDRESS_BOOK + "/0", 
        success: function (A) {
            parseResponse(A);
            if (typeof responseArray.json.url != "undefined") {
                window.location = responseArray.json.url
            } else {
                if (responseArray.code != "0") {
                    displayFeedback(responseArray.code + responseArray.json.error)
                } else {
                    $("#ListContacts").innerHTML = responseArray.html;
                    CheckAll(document.contactform.mlist);
                    if ($("overlayLoadingContact").css("display") == "block") {
                        $("overlayLoadingContact").css('display','none');
                        $("overlayContactList").show()
                    }
                }
            }
            window.clearInterval(lddd)
        },
        error: function () {
            window.clearInterval(lddd);
            displayFeedback("1" + GT.gettext("Error contacting the server"))
        },
        failure: function () {
            window.clearInterval(lddd);
            displayFeedback("1" + GT.gettext("Error contacting the server"))
        }
    })
}

function showContactPreview() {
    if (validateShareForm()) {
        $("overlayContactLogin").css('display','none');
        showSharePreview(true)
    }
}

function checkKeySubmit(A, B) {
    var C = "";
    if (B.which) {
        C = B.which
    } else {
        C = B.keyCode
    }
    if (C == 13) {
        $(A).submit()
    }
}

function validateShareForm() {
    $("#errMsg").html("&nbsp;");
    $("#captcha_err").html("&nbsp;");
    $("#sndr_nm_ttl").css("color", "#777");
    $("#sndr_ml_ttl").css("color", "#777");
    $("#rcpt_ml_ttl").css("color", "#777");
    if ($("#sndr_nm_input").val() == "") {
        $("#errMsg").html(GT.gettext("Please enter Your Name"));
        $("#sndr_nm_ttl").css("color", "red");
        return false
    }
    if ($("#sndr_ml_input").val() == "") {
        $("#errMsg").html(GT.gettext("Please enter Your Email"));
        $("#sndr_ml_ttl").css("color", "red");
        return false
    }
    if ($("#rcpt_ml_area").val() == "") {
        $("#errMsg").html(GT.gettext("Please enter Your Friend Emails"));
        $("#rcpt_ml_ttl").css("color", "red");
        return false
    }
    return true
}

function sendShare() {
    if (validateShareForm()) {
        var A = URL_SEND_SHARE;
        if (call_src == "") {
            $("#sndr_sub").html("Cool animation from ");
            $("#sndr_nm_text2").html($("#sndr_nm_input").val());
            $("#cntnt_subject").val($("#sndr_sub").html() + $("#sndr_nm_text2").html())
        } else {
            if (call_src == "faf" || call_src == "invite") {
                A = URL_SEND_INVITE;
                $("#sndr_sub").html("Cool site from ");
                $("#sndr_nm_text2").html($("sndr_nm_input").val());
                $("#cntnt_subject").val($("#sndr_sub").html() + $("#sndr_nm_text2").html())
            }
        }
        $("#overlayContactLogin").css('display','none');
        $("#overlayLoadingTextGo").css('display','none');
        $("#overlayLoadingTextOI").css('display','none');
        $("#overlaySharePreview").css('display','none');
        if ($("#overlayLoadingCaptcha").css("display") != "block") {
            $("#overlayLoadingTextSnd").css('display','block')
        }
        $("#overlayLoadingContact").css('display','block');
        lddd = window.setInterval('printDot("LoadingDotDotDot")', 300);
        var serialized = $("#nvtfrm").serializeArray();
        var postdata = {};
        for (var i = 0; i < serialized.length; i++) {
            postdata[i]["name"] = serialized[i]["value"];
        }
        $.ajax({
            type: "POST",
            url: A, 
            data: postdata,
            success: function (B) {
                window.clearInterval(lddd);
                sendShareComplete(B)
            },
            failure: function () {
                window.clearInterval(lddd);
                displayFeedback("1" + GT.gettext("Error contacting the server"));
                $("#nvtfrm").enable();
                showContactOverlay(false)
            }
        });
        $("#nvtfrm").disable()
    }
}

function sendShareComplete(A) {
    parseResponse(A);
    $("#nvtfrm").enable();
    $("#overlayLoadingCaptcha").css('display','none');
    switch (responseArray.code) {
        case "0":
            if ($("#overlayLoadingContact").css("display") == "block") {
                $("#new_contact").html(responseArray.json.contact_add_num);
                $("#overlayShareComplete").css('display','block');
                $("#overlayLoadingTextSnd").css('display','none');
                $("#overlayLoadingContact").css('display','none');
                if ($("#action_content") != "undefined") {
                    $("#action_content").html("You will appear here once views are generated from your sharing.")
                }
            }
            if (call_src == "faf") {
                $("#foundPageNote,#foundPageInviteBtn,#foundPageFrankie").hide();
                $("#foundPageThankNote,#foundPageThankFrankie").show();
                showContactOverlay(false);
                if ($("fanPage").css("display") == "block") {
                    $("#fanPage").hide("slide", {
                        direction: "right"
                    }, 500);
                    $("#foundPage").show("slide", {
                        direction: "left"
                    }, 500)
                } else {
                    $("#waitingPage,#loginPage,#fanPage,#manualPage").hide();
                    $("#foundPage").show()
                }
            }
            break;
        case "1":
            if ($("#overlayLoadingContact").css("display") == "block") {
                $("#emailshare_captcha_type").setAttribute("value", "image");
                $("#emailshare_captcha_id").setAttribute("value", responseArray.json.session_id);
                $("#emailshare_captcha_image").setAttribute("src", responseArray.json.url);
                $("#emailshare_comment_captcha").css('display','block');
                $("#emailshare_image_captcha").css('display','block');
                $("#emailshare_audio_captcha").css('display','none');
                $("#overlayCaptcha").css('display','block');
                $("#contactLoginForm").css('display','none');
                $("#contactShareForm").css('display','none');
                $("#overlayLoadingContact").css('display','none');
                $("#overlayContactLogin").css('display','block')
            }
            break;
        case "2":
            if ($("#overlayLoadingContact").css("display") == "block") {
                $("#emailshare_captcha_type").setAttribute("value", "audio");
                $("#emailshare_captcha_id").setAttribute("value", responseArray.json.session_id);
                $("#emailshare_captcha_audio").html(getAudioEmbedString(responseArray.json.url));
                $("#emailshare_comment_captcha").css('display','block');
                $("#emailshare_image_captcha").css('display','none');
                $("#emailshare_audio_captcha").css('display','block');
                $("#overlayCaptcha").css('display','block');
                $("#contactLoginForm").css('display','none');
                $("#contactShareForm").css('display','none');
                $("#overlayLoadingContact").css('display','none');
                $("#overlayContactLogin").css('display','block')
            }
            break;
        case "3":
            $("#overlayCaptcha").css('display','block');
            $("#contactLoginForm").css('display','none');
            $("#contactShareForm").css('display','none');
            $("#overlayLoadingContact").css('display','none');
            $("#overlayContactLogin").css('display','block');
            $("#captcha_err").html(responseArray.json.error);
            break;
        default:
            showContactOverlay(false);
            displayFeedback(responseArray.code + responseArray.json.error);
            break
    }
    window.clearInterval(lddd);
    resetResponse()
};

