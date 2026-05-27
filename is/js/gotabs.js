{

    var URL_LOAD_RELATED = "/ajax/relatedMovies";
    var URL_LOAD_AUTHOR = "/ajax/userMovies";
    var URL_LOAD_STAFF_PICKS = "/ajax/featuredAndStaffPicksMovies";
    var URL_LOAD_TOP_SCORE_MOVIES = "/ajax/topScoredMovies";

    function loadRelated(E) {
        var D = E.split(",");
        var C = D[0].split("-");
        var A = D[1];
        var B = D[2];
        if ($(C[0]).innerHTML == "") {
            new Ajax.Request(URL_LOAD_RELATED + "/" + A, {
                method: "post",
                onSuccess: function(G) {
                    var F = G.responseText;
                    parseResponse(F);
                    updateDiv(C[0], responseArray.html);
                    resetResponse()
                },
                onFailure: function() {
                    displayFeedback("1Error contacting the server")
                }
            })
        }
        for (i = 1; i < C.length; i++) {
            $(C[i]).hide()
        }
        $(C[0]).show()
    }

    function loadStaffPicks(E) {
        var D = E.split(",");
        var C = D[0].split("-");
        var A = D[1];
        var B = D[2];
        if ($(C[0]).innerHTML == "") {
            new Ajax.Request(URL_LOAD_STAFF_PICKS + "/" + A, {
                method: "post",
                onSuccess: function(G) {
                    var F = G.responseText;
                    parseResponse(F);
                    updateDiv(C[0], responseArray.html);
                    resetResponse()
                },
                onFailure: function() {
                    displayFeedback("1Error contacting the server")
                }
            })
        }
        for (i = 1; i < C.length; i++) {
            $(C[i]).hide()
        }
        $(C[0]).show()
    }

    function loadTopScoredMovies(E) {
        var D = E.split(",");
        var C = D[0].split("-");
        var A = D[1];
        var B = D[2];
        if ($(C[0]).innerHTML == "") {
            new Ajax.Request(URL_LOAD_TOP_SCORE_MOVIES + "/10/0/30/all/thumb/frame_no_view", {
                method: "post",
                onSuccess: function(G) {
                    var F = G.responseText;
                    parseResponse(F);
                    updateDiv(C[0], responseArray.html);
                    resetResponse()
                },
                onFailure: function() {
                    displayFeedback("1Error contacting the server")
                }
            })
        }
        for (i = 1; i < C.length; i++) {
            $(C[i]).hide()
        }
        $(C[0]).show()
    }

    function loadMoreAuthor(F) {
        var E = F.split(",");
        var C = E[0].split("-");
        var A = E[1];
        var D = E[2];
        var B = E[3];
        if ($(C[0]).innerHTML == "") {
            new Ajax.Request(URL_LOAD_AUTHOR + "/" + A + "/" + D, {
                method: "post",
                onSuccess: function(H) {
                    var G = H.responseText;
                    parseResponse(G);
                    updateDiv(C[0], responseArray.html);
                    resetResponse()
                },
                onFailure: function() {
                    displayFeedback("1Error contacting the server")
                }
            })
        }
        for (i = 1; i < C.length; i++) {
            $(C[i]).hide()
        }
        $(C[0]).show()
    }

    function updateDiv(B, A) {
        if (responseArray.code != "0") {
            displayFeedback(responseArray.code + responseArray.json.error)
        } else {
            $(B).innerHTML = A.substring(1)
        }
    }

    function switchTab(A, B, I, F) {
        if ($(A).hasClass("tabactive")) {
            return
        }
        var H = B.split(",");
        for (i = 0; i < H.length; i++) {
            if ($('#' + H[i]).hasClass("tabactive")) {
                $('#' + H[i]).removeClass("tabactive");
                $('#' + H[i]).addClass("tabinactive");
                var E = $('#' + H[i]).find('.tabc')
                if (typeof view_name != "undefined" && view_name == "domo") {
                    $('#' + H[i]).html('<div class="tabl"></div><div class="tabc"><a id="' + H[i] + 'link" href="javascript:goVoid();">' + E.html() + '</a></div><div class="tabr"></div>')
                } else {
                    $('#' + H[i]).html('<div class="tabc"><a id="' + H[i] + 'link" href="javascript:goVoid();">' + E.html() + "</a></div>")
                }
            }
        }
        $('#' + A).removeClass("tabinactive");
        $('#' + A).addClass("tabactive");
        var C = $('#' + A + "link").html();
        if (typeof view_name != "undefined" && view_name == "domo") {
            $('#' + A).html('<div class="tabl"></div><div class="tabc">' + C + '</div><div class="tabr"></div>')
        } else {
            $('#' + A).html('<div class="tabc">' + C + "</div>")
        }
        if (typeof I != "undefined") {
            if (A == "idolfeeds" || A == "myfeeds") {
                var D = F.split(",");
                var G = D[5];
                $('#' + G).html("0")
            }
            I(F)
        }
    }

    function switchIndexRSSTab(B) {
        var A = new SWFObject(B.rssplayer_src_path, "RSSPlayer", B.width == undefined ? "570" : B.width, B.height == undefined ? "550" : B.height, "10.0.12", "#464646");
        A.useExpressInstall("/static/libs/expressInstall.swf");
        A.addParam("AllowScriptAccess", "always");
        A.addParam("wmode", "transparent");
        A.addVariable("apiserver", B.api_server);
        A.addVariable("appCode", "go");
        A.addVariable("autostart", B.is_autostart ? "1" : "0");
        A.addVariable("ctc", "go");
        A.addVariable("isEmbed", "0");
        A.addVariable("movieNum", "10");
        A.addVariable("movieOwnerId", encodeURI(B.movieOwnerId));
        A.addVariable("channel", "all");
        A.addVariable("nextanicallback", "");
        A.addVariable("rsspath", encodeURI(B.rsspath));
        A.addVariable("styleCode", "gray");
        A.addVariable("storePath", "\/static\/store\/<store>");
        A.addVariable("clientThemePath", "\/static\/ct\/30\/<client_theme>")
        A.addVariable("uemail", B.uemail);
        A.addVariable("userId", encodeURI(B.userId));
        if (B.randomizeFeed != undefined) {
            A.addVariable("randomizeFeed", B.randomizeFeed)
        } else {
            A.addVariable("randomizeFeed", "1")
        }
        if (B.username != undefined) {
            A.addVariable("username", encodeURI(B.username))
        }
        if (B.isShowGetWidget != undefined) {
            A.addVariable("isShowGetWidget", "1")
        }
        if (B.customGetWidgetParam != undefined) {
            A.addVariable("customGetWidgetParam", B.customGetWidgetParam)
        }
        A.addParam("scale", "exactfit");
        A.addParam("allowFullScreen", "true");
        A.write("rss_player_container")
    }

    function switchFeedTab(A, B, I, F) {
        if ($(A).className == "tabfeedactive") {
            return
        }
        var H = B.split(",");
        for (i = 0; i < H.length; i++) {
            if ($(H[i]).className == "tabfeedactive") {
                $(H[i]).className = "tabfeedinactive";
                var E = $(H[i]).select('[class="tabc"]')[0];
                $(H[i]).innerHTML = '<div class="tabspacing"></div><div class="tabc"><a id="' + H[i] + 'link" href="javascript:goVoid();">' + E.innerHTML + '</a></div><div class="tabspacing"></div>'
            }
        }
        $(A).className = "tabfeedactive";
        var C = $(A + "link").innerHTML;
        $(A).innerHTML = '<div class="tabspacing"></div><div class="tabc">' + C + '</div><div class="tabspacing"></div>';
        if (typeof I != "undefined") {
            if (A == "idolfeeds" || A == "myfeeds") {
                var D = F.split(",");
                var G = D[5];
                $(G).innerHTML = "0"
            }
            I(F, true)
        }
    }

    function switchBlueTab(A, B, I, F) {
        if ($(A).className == "tabblueactive") {
            return
        }
        var H = B.split(",");
        for (i = 0; i < H.length; i++) {
            if ($(H[i]).className == "tabblueactive") {
                $(H[i]).className = "tabblueinactive";
                var E = $(H[i]).select('[class="tabc"]')[0];
                $(H[i]).innerHTML = '<div class="tabl"></div><div class="tabc"><a id="' + H[i] + 'link" href="javascript:goVoid();">' + E.innerHTML + '</a></div><div class="tabr"></div>'
            }
        }
        $(A).className = "tabblueactive";
        var C = $(A + "link").innerHTML;
        $(A).innerHTML = '<div class="tabl"></div><div class="tabc">' + C + '</div><div class="tabr"></div>';
        if (typeof I != "undefined") {
            if (A == "idolfeeds" || A == "myfeeds") {
                var D = F.split(",");
                var G = D[5];
                $(G).innerHTML = "0"
            }
            I(F)
        }
    }

    function switchFanTab(A, B, I, F) {
        if ($(A).className == "tabfanactive") {
            return
        }
        var H = B.split(",");
        for (i = 0; i < H.length; i++) {
            if ($(H[i]).className == "tabfanactive") {
                $(H[i]).className = "tabfaninactive";
                var E = $(H[i]).select('[class="tabc"]')[0];
                $(H[i]).innerHTML = '<div class="tabl"></div><div class="tabc"><a id="' + H[i] + 'link" href="javascript:goVoid();">' + E.innerHTML + '</a></div><div class="tabr"></div>'
            }
        }
        $(A).className = "tabfanactive";
        var C = $(A + "link").innerHTML;
        $(A).innerHTML = '<div class="tabl"></div><div class="tabc">' + C + '</div><div class="tabr"></div>';
        if (typeof I != "undefined") {
            if (A == "idolfeeds" || A == "myfeeds") {
                var D = F.split(",");
                var G = D[5];
                $(G).innerHTML = "0"
            }
            I(F)
        }
    }

    function switchTabNoAjax(E, A) {
        E = E.split(":");
        if ($(E[0]).className == "contacttabactive") {
            return
        }
        var C = A.split(",");
        for (i = 0; i < C.length; i++) {
            C[i] = C[i].split(":");
            if ($(C[i][0]).className == "contacttabactive") {
                $(C[i][0]).className = "contacttabinactive";
                var D = $(C[i][0]).select('[class="contacttabc"]')[0];
                $(C[i][0]).innerHTML = '<div class="contacttabl"></div><div class="contacttabr"></div><div class="contacttabc"><a id="' + C[i][0] + 'link" href="javascript:goVoid();">' + D.innerHTML + "</a></div>"
            }
            $(C[i][1]).style.display = "none"
        }
        $(E[0]).className = "contacttabactive";
        var B = $(E[0] + "link").innerHTML;
        $(E[0]).innerHTML = '<div class="contacttabl"></div><div class="contacttabr"></div><div class="contacttabc">' + B + "</div>";
        $(E[1]).style.display = ""
    }

    function switchFilter(B, F, I, E) {
        var A = $(B).className;
        if (A.indexOf("active") > 0) {
            return
        }
        var J = B.replace(/^my/g, "");
        J = J.replace(/^idol/g, "");
        $(B).className = J + "_active";
        var H = F.split(",");
        for (i = 0; i < H.length; i++) {
            var C = H[i];
            C = C.replace(/^my/g, "");
            C = C.replace(/^idol/g, "");
            $(H[i]).className = C
        }
        if (typeof I != "undefined") {
            if (B.indexOf("feedfilter_all") > 0 || B.indexOf("feedfilter_ani") > 0) {
                var D = E.split(",");
                var G = D[5];
                $(G).innerHTML = "0"
            }
            I(E, false)
        }
    }

    function switchLanguage(B) {
        if ($("#lang_" + B).hasClass("active")) {
            return
        }
        lang = B;
        var A = ["all", "de", "en", "es", "fr", "it", "pt", "tc", "sc"];
        for (i = 0; i < A.length; i++) {
            if ($("#lang_" + A[i]).hasClass("active")) {
                $("#lang_" + A[i]).removeClass("active");
                $("#lang_" + A[i]).html('<a id="lang_text_' + A[i] + '" href="javascript:switchLanguage(\'' + A[i] + "', 'func', 'param1,param2')\"> " + $("#lang_" + A[i]).html() + "</a>")
            }
        }
        $("#lang_" + B).addClass("active");
        $("#lang_" + B).replaceWith('<span id="lang_' + B + '" class="active">' + $("#lang_text_" + B).html() + '</span>');
        if(search){
            loadAnotherPage('cell_list','all','movies',16,'movies_page_number','prevPageMovies','nextPageMovies','init',movcategory, search, false, B);
        }else{
            loadAnotherPage('cell_list','all','movies',16,'movies_page_number','prevPageMovies','nextPageMovies','init',movcategory, 'false', false, B);
        }
        //location.href = $("page_name").innerHTML + "/" + B
    };

}