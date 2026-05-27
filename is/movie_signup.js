(function(F) {
    var E = false;

    function G() {
        var L = F("#email"),
            K = F.trim(L.val()),
            J = F("#username"),
            M = F.trim(J.val()),
            I = F('#password1[type="password"]'),
            N = F("#termsofuse");
        F("#email, #username, #password1").removeClass("error");
        B("");
        if (!K || K == L.prop("placeholder")) {
            L.focus();
            L.addClass("error");
            B("Email address required");
            return false
        }
        if (!K.match(/^([\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+\.)*[\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+@((((([a-z0-9]{1}[a-z0-9\-]{0,62}[a-z0-9]{1})|[a-z])\.)+[a-z]{2,6})|(\d{1,3}\.){3}\d{1,3}(\:\d{1,5})?)$/i)) {
            L.focus();
            L.addClass("error");
            B("Invalid email address");
            return false
        }
        if (!M || M == J.prop("placeholder")) {
            J.focus();
            J.addClass("error");
            B("Please enter your display name");
            return false
        }
        if (!I.val()) {
            I.focus();
            I.addClass("error");
            B("Password required");
            return false
        }
        if (I.val().length <= 3) {
            I.focus();
            I.addClass("error");
            B("Password must be longer than 3 characters");
            return false
        }
        if (!N.prop("checked")) {
            N.focus();
            B("You have to agree the Term of Use");
            return false
        }
        return true
    }

    function B(I) {
        F("#signup_form_message").html(I)
    }

    function A() {
        if (!G()) {
            return
        }
        if (E) {
            return
        }
        E = true;
        F.post("/ajax/doSignUp", F("#movie_signup_form").serialize(), function(I) {
            parseResponse(I);
            if (responseArray.code == 0) {
                window.location = responseArray.json.redirect
            } else {
                E = false;
                B(responseArray.json.error)
            }
        })
    }

    function C(J) {
        var I = F("#username");
        var K = J.indexOf("@");
        if (K > 0) {
            I.val(J.substring(0, K))
        }
    }
    F(document).ready(function() {
        F("#movie_signup_form input").placeholder();
        F("#movie_signup_submit").on("click", function(I) {
            I.preventDefault();
            A()
        });
        F("#email").bind("blur", function(I) {
            C(F(this).val())
        })
    });

    function H() {
        if (!FB) {
            return
        }
        FB.login(function(I) {
            if (I.session) {
                D()
            }
        }, {
            perms: "email,publish_stream,offline_access"
        })
    }

    function D() {
        F.post("/ajax/FBConnectCheck", function(I) {
            parseResponse(I);
            if (responseArray.code == "0") {
                if (_kmq) {
                    var J = new Date();
                    _kmq.push(["record", "Completed Signup", {
                        "Signup Cohort": J.getFullYear() + "-" + (J.getMonth() + 1)
                    }])
                }
                if (optimizely) {
                    optimizely.trackEvent("Sign up completed")
                }
                window.location = responseArray.json.url
            } else {
                displayFeedback("1" + responseArray.json.error)
            }
        })
    }
    F("#facebook_signup_button").on("click", function(I) {
        I.preventDefault();
        H()
    })
})(jQuery);