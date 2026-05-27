if(typeof studio === "undefined"){
    var studio = "2016";
}
var widescreen = "1";
var tutorial = "full";
var oldSupported = true;
var colortheme = "";

function createActive(B, D) {
    var A = "createblock" + B;
    var C = "createflashobj" + B;
    $(A).className = D;
    $(C).gotoOverMode()
}

function createInactive(B, D) {
    var A = "createblock" + B;
    var C = "createflashobj" + B;
    $(A).className = D;
    $(C).gotoInitMode()
}

function startCCUpload() {
    document.getElementById('importFileId').value = '';
    document.getElementById('importFileId').click();
}

function uploadCharacter(ev) {
    ev.preventDefault();
    var formData = new FormData();
    formData.append('file', $('#importFileId').prop('files')[0])
    $.ajax({
        type: "POST",
        url: "/ajax/characterUpload",
        contentType: false,
        processData: false,
        cache: false,
        data: formData,
        success: function (response) {
            if (response.redirect) {
                //redirect
                window.location = response.redirect;
            } else if (response.error) {
                displayFeedback('1' + GT.gettext(response.error));
            } else {
                displayFeedback('1' + GT.gettext("Service is unavailable at the moment, please try again later"));
            }
            return false;
        },
        error: function (data) {
            displayFeedback("1" + GT.gettext("Error occurred, please try again later."))
            return false;
        }
    })
}

function changepage(to, from) {
    $("#" + from).hide();
    $("#" + to).show();
}

function signupStudio() {
    registerSignupLoginCompleteHandler(function () {
        location.reload(true);
    });
    showSignup(250);
}

function studioPreview() {
    showOverlay($('#notloggedincreate-overlay'));
}

function studioSelect(theme) {
    switch (theme) {
        case "ninjaanime":
        case "spacecitizen":
        case "politics2":
        case "ninja":
        case "chibi":
        case "space":
        case "animal":
        case "sticklybiz":
        case "vietnam":
        case "anime":
        case "action": {
            oldSupported = false;
            break;
        }
        default: {
            oldSupported = true;
        }
    }
    if (!oldSupported) {
        $("#studio2010a").addClass('studio-disabled');
    } else {
        $("#studio2010a").removeClass('studio-disabled');
    }
    $("#gotoVideoMakerEdit").attr("onclick", "goToVideomaker(false, '" + theme + "')")
    showOverlay($('#create-overlay'), {}, true);
}

function selectStudio(era) {
    $('.studioselected').css("background-color", "unset");
    $('#studio' + era).css("background-color", "#6ca4c9");
    $('#ct' + $('.studioselected').attr('id').replace('studio', '')).hide();
    if (era == 2010 || 2011 || 2012 || 2013) {
        $('#ct' + era).show();
    } else {
        colortheme = "";
    }
    if(era == 2010){
        $("#widescreen").hide();
        $('[for="widescreen"]').hide();
    }else{
        $("#widescreen").show();
        $('[for="widescreen"]').show();
    }
    $('.studioselected').removeClass("studioselected");
    $('#studio' + era).addClass("studioselected");
}

function goToVideomaker(onlytheme, theme) {
    if(typeof onlytheme === "undefined"){
        onlytheme = false;
    }
    if (onlytheme) {
        window.location = '/videomaker/' + theme + '/full';
        return;
    }
    if ($('#widescreen').prop('checked')) {
        widescreen = "1"
    } else {
        widescreen = "0"
    }
    if ($('#tutorial').prop('checked')) {
        tutorial = "tutorial";
    } else {
        tutorial = "full";
    }
    var extra = '?e=' + studio + '&w=' + widescreen;
    if ($('#ct' + studio + 'select').length != 0) {
        extra += '&ct=' + $('#ct' + studio + 'select').val();
    }
    window.location = '/videomaker/' + theme + '/' + tutorial + '/' + extra;
}

function initButtons() {
    $("createblock1").onmouseout = function (B) {
        if (!B) {
            var B = window.event
        }
        var A = (B.relatedTarget) ? B.relatedTarget : B.toElement;
        while (A.tagName != "BODY") {
            if (A.id == this.id) {
                return
            }
            A = A.parentNode
        }
        createInactive(1, "createblock")
    };
    $("createblock2").onmouseout = function (B) {
        if (!B) {
            var B = window.event
        }
        var A = (B.relatedTarget) ? B.relatedTarget : B.toElement;
        while (A.tagName != "BODY") {
            if (A.id == this.id) {
                return
            }
            A = A.parentNode
        }
        createInactive(2, "createblock")
    };
    $("createblock3").onmouseout = function (B) {
        if (!B) {
            var B = window.event
        }
        var A = (B.relatedTarget) ? B.relatedTarget : B.toElement;
        while (A.tagName != "BODY") {
            if (A.id == this.id) {
                return
            }
            A = A.parentNode
        }
        createInactive(3, "createblock")
    };
    $("createblock4").onmouseout = function (B) {
        if (!B) {
            var B = window.event
        }
        var A = (B.relatedTarget) ? B.relatedTarget : B.toElement;
        while (A.tagName != "BODY") {
            if (A.id == this.id) {
                return
            }
            A = A.parentNode
        }
        createInactive(4, "createblock")
    }
};
