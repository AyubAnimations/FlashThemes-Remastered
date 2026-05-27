{
  function grayOut(C, I, A) {
      var J = $("#darkenScreenObject");
      var H = $("#overlayObject");
      if (C) {
            var L = "100%";
            var G = "100%"
          J.css('width',G);
          J.css('height',G);
          J.css('display','block');
          H.css('display','block');
          if (navigator.userAgent.search("MSIE") >= 0) {
              var D = document.body.offsetWidth
          } else {
              var D = window.innerWidth
          }
          var E = 650;
      } else {
          J.css('display','none');
          H.css('display','none');
          var B = H.html();
          H.html("");
          H.html(B);
          window.onResize = ""
      }
  }

  function grayOut2(B, H) {
      var I = $("#darkenScreenObject");
      var G = $("#overlayObject2");
      if (B) {
          var K = "100%";
          var F = "100%";
          I.css('width', K);
          I.css('height', F);
          I.css('display','block');
          G.css('display','block');
          if (navigator.userAgent.search("MSIE") >= 0) {
              var C = document.body.offsetWidth
          } else {
              var C = window.innerWidth
          }
          var D = 650;
          var J = (C - G.clientWidth) / 2;
          G.css('left', (J > 0 ? (J + "px") : "0px"));
          var E = (D - G.clientHeight) / 2;
          G.css('top', (E > 0 ? (E + "px") : "0px"))
      } else {
          I.css('display','none');
          G.css('display','none');
          var A = G.html();
          G.html("");
          G.html(A);
          window.onResize = ""
      }
  }

  function grayOutPreview(C, I, A) {
      var J = document.getElementById("darkenScreenObject");
      var H = $("overlayObjectPreview");
      if (C) {
          if (document.body && (document.body.scrollWidth || document.body.scrollHeight)) {
              var L = document.body.scrollWidth + 30 + "px";
              var G = document.body.scrollHeight + 30 + "px"
          } else {
              if (document.body.offsetWidth) {
                  var L = document.body.offsetWidth + "px";
                  var G = document.body.offsetHeight + "px"
              } else {
                  var L = "100%";
                  var G = "100%"
              }
          }
          J.css('display','block');
          H.css('display','block');
          if (navigator.userAgent.search("MSIE") >= 0) {
              var D = document.body.offsetWidth
          } else {
              var D = window.innerWidth
          }
          var E = 650;
          var K = (D - H.clientWidth) / 2;
          if (A == undefined) {
              H.style.left = K > 0 ? (K + "px") : "0px"
          } else {
              K += A;
              H.style.left = K > 0 ? (K + "px") : "0px"
          }
          var F = (E - H.clientHeight) / 2;
          H.style.top = F > 0 ? (F + "px") : "0px"
      } else {
          J.css('display','none');
          H.css('display','none');
          var B = H.innerHTML;
          H.innerHTML = "";
          H.innerHTML = B;
          window.onResize = ""
      }
  }

  function grayOutGlobal(C, I, A) {
      var J = $("#darkenScreenObject");
      var H = $("#overlayObjectGlobal");
      if (C) {
          if (document.body && (document.body.scrollWidth || document.body.scrollHeight)) {
              var L = document.body.scrollWidth + 30 + "px";
              var G = document.body.scrollHeight + 30 + "px"
          } else {
              if (document.body.offsetWidth) {
                  var L = document.body.offsetWidth + "px";
                  var G = document.body.offsetHeight + "px"
              } else {
                  var L = "100%";
                  var G = "100%"
              }
          }
          J.css("width", L);
          J.css("height", G);
          J.css('display','block');
          H.css('display','block');
          if (navigator.userAgent.search("MSIE") >= 0) {
              var D = document.body.offsetWidth
          } else {
              var D = window.innerWidth
          }
          var E = 650;
          var K = (D - H.clientWidth) / 2;
          if (A == undefined) {
              H.css("left", K > 0 ? (K + "px") : "0px")
          } else {
              K += A;
              H.css("left", K > 0 ? (K + "px") : "0px")
          }
          var F = (E - H.clientHeight) / 2;
          H.css("top", F > 0 ? (F + "px") : "0px")
      } else {
          J.css('display','none');
          H.css('display','none');
          var B = H.html();
          H.html("");
          H.html(B);
          window.onResize = ""
      }
  }

  function reloadNow(A) {
      var G = document.getElementById("darkenScreenObject");
      if ($(G).is("none")) {
          if (document.body && (document.body.scrollWidth || document.body.scrollHeight)) {
              var I = document.body.scrollWidth + 30 + "px";
              var E = document.body.scrollHeight + 30 + "px"
          } else {
              if (document.body.offsetWidth) {
                  var I = document.body.offsetWidth + "px";
                  var E = document.body.offsetHeight + "px"
              } else {
                  var I = "100%";
                  var E = "100%"
              }
          }
          $(G).css('height', E)
      }
      var F = $("#overlayObject");
      if (F.is("none")) {
          if (navigator.userAgent.search("MSIE") >= 0) {
              var B = document.body.offsetWidth
          } else {
              var B = window.innerWidth
          }
          var C = 650;
          var H = (B - F.clientWidth) / 2;
          if (A == undefined) {
              F.style.left = H > 0 ? (H + "px") : "0px"
          } else {
              H += A;
              F.style.left = H > 0 ? (H + "px") : "0px"
          }
          var D = (C - F.clientHeight) / 2;
          F.style.top = D > 0 ? (D + "px") : "0px"
      }
  }

  function reloadNow2() {
      var E = document.getElementById("darkenScreenObject");
      if (!$(E).is("none")) {
          if (document.body && (document.body.scrollWidth || document.body.scrollHeight)) {
              var C = document.body.scrollWidth + 30 + "px";
              var F = document.body.scrollHeight + 30 + "px"
          } else {
              if (document.body.offsetWidth) {
                  var C = document.body.offsetWidth + "px";
                  var F = document.body.offsetHeight + "px"
              } else {
                  var C = "100%";
                  var F = "100%"
              }
          }
          $(E).css('width', C);
          $(E).css('height', F)
      }
      var D = document.getElementById("overlayObject2");
      if ($(D).length) {
          if (navigator.userAgent.search("MSIE") >= 0) {
              var H = document.body.offsetWidth
          } else {
              var H = window.innerWidth
          }
          var G = 650;
          var B = (H - D.clientWidth) / 2;
          $(D).css('left', B > 0 ? (B + "px") : "0px");
          var A = (G - D.clientHeight) / 2;
          $(D).css('top', A > 0 ? (A + "px") : "0px")
      }
  }

  function reloadNowGlobal(A) {
      var G = document.getElementById("darkenScreenObject");
      if (!$(G).is("none")) {
          if (document.body && (document.body.scrollWidth || document.body.scrollHeight)) {
              var I = document.body.scrollWidth + 30 + "px";
              var E = document.body.scrollHeight + 30 + "px"
          } else {
              if (document.body.offsetWidth) {
                  var I = document.body.offsetWidth + "px";
                  var E = document.body.offsetHeight + "px"
              } else {
                  var I = "100%";
                  var E = "100%"
              }
          }
          $(G).css('height', E)
      }
      var F = $("#overlayObjectGlobal");
      if (F.is("none")) {
          if (navigator.userAgent.search("MSIE") >= 0) {
              var B = document.body.offsetWidth
          } else {
              var B = window.innerWidth
          }
          var C = 650;
          var H = (B - F.clientWidth) / 2;
          if (A == undefined) {
              F.css('left', H > 0 ? (H + "px") : "0px")
          } else {
              H += A;
              F.css('left', H > 0 ? (H + "px") : "0px")
          }
          var D = (C - F.clientHeight) / 2;
          F.css('top', D > 0 ? (D + "px") : "0px")
      }
  }
  var t;

  function countDown(B, A) {
      $("transferLink").href = "javascript:cancelTransfer();$('" + B + "').submit();";
      $("transfer_sec").innerHTML = A;
      A = A - 1;
      if (A >= 0) {
          t = setTimeout("countDown('" + B + "'," + A + ")", 1000)
      } else {
          $(B).submit()
      }
  }

  function cancelTransfer() {
      clearTimeout(t)
  }

  function hideObject(B) {
      var A = $("overlayObject" + B);
      A.style.display = "none"
  }

  function ssShowPreviewOverlay(C, D, B) {
      var A = currPos();
      B = A[1];
      $("overlaySSPreviewBoxTitle").innerHTML = (D === "" ? "&nbsp;" : D);
      $("overlaySSPreviewBox").css('display','block');
      $("overlayObject").style.margin = B + "px 0px 0px 0px";
      jQuery("#ss-home-usethisbtn_button").click(function() {
          ssChooseTemplate(C, true)
      });
      jQuery("#ss-home-preview-demo").attr("src", "/static/" + view_name + "/tutorial/slideshow/demo_" + C + ".html");
      grayOut(true, "slideshow/previewdemo/" + C + "/true")
  }

  function showPreviewOverlay(B, C, A) {
      A -= 100;
      $("overlaySSPreviewBoxTitle").innerHTML = (C === "" ? "&nbsp;" : C);
      $("overlaySSPreviewBox").css('display','block');
      $("overlayObject").style.margin = A + "px 0px 0px 0px";
      $("ss-home-usethisbtn-a").href = "javascript:ssChooseTemplate('" + B + "', true)";
      $("ss-home-preview-demo").src = "/static/" + view_name + "/tutorial/slideshow/demo_" + B + ".html";
      grayOut(true, "slideshow/previewdemo/" + B + "/true")
  }

  function showSoundTutorial() {
      grayOut(true, "studio/soundtutorial/true")
  }

  function ssHidePreviewOverlay() {
      grayOut(false, "slideshow/previewdemo/false");
      $("overlaySSPreviewBox").style.display = "none"
  }
  var emsg_overlay_url = "";

  function previewMovieOverlay(C, D, A) {
      previewMovie(C);
      if (A == "emessage") {
          $("emsg_link").show();
          emsg_overlay_url = "/go/studio/copyemessage/" + C
      } else {
          if (A == "cn") {
              $("msg_link").href = "javascript:hidePreviewMovieOverlay();showUpdatePhone(250,true);";
              $("phone_ch").value = C
          } else {
              $("emsg_link").hide()
          }
      }
      var B = currPos();
      $("overlayPreviewBoxTitle").innerHTML = (D === "" ? "&nbsp;" : D);
      $("overlayPreviewBox").css('display','block');
      $("overlayObjectPreview").style.margin = B[1] + "px 0px 0px 0px";
      grayOutPreview(true, "movie/preview/" + C + "/true")
  }

  function gotoPreviewURL() {
      location.href = emsg_overlay_url
  }

  function hidePreviewMovieOverlay() {
      grayOutPreview(false, "movie/preview/false");
      $("overlayPreviewBox").style.display = "none"
  }

  function previewYouTubeOverlay(G, B, C, F) {
      var D = currPos();
      $("#overlayObject").css("width", "700px");
      $("#overlayObject").css("height", "530px");
      $("#OG_title").html((G === "" ? "&nbsp;" : G));
      $("#overlayGeneral").css('margin', D[1] + "px 0px 0px 0px");
      $("#overlayGeneral").css('display','block');
      grayOut(true, 'weirdthing');
      var A = '<div id="OG_content_child" style="padding:10px 10px 0;height:409px"></div>';
      if (typeof F == "undefined" || !F) {
          $("#OG_content").css(A + '<div style="padding:10px 10px 0;width:680px;"><div class="centeredentity"><ul class="centeredentity_ul"><li class="centeredentity_ul_li"><div onclick="javascript:hideOG();showBizSignup(250);" onmouseout="javascript:buttonOut(this.id);" onmouseover="javascript:buttonOver(this.id, -40);" style="overflow: hidden; height: 40px; cursor: pointer; float: left;" id="youtube_signup_btn"><ol style="margin: 0px;"><li style="margin: 0pt; float: left; display: block; height: 80px;" id="youtube_signup_btnleft"><img width="10" height="80" onload="javascript:iePngFix(this, 10, 80);" src="/static/go/img/buttons/green/btn_green_80_left.png"/></li><li style="padding: 5px 5px 0px; background: transparent url(/static/go/img/buttons/green/btn_green_80_mid.gif) repeat-x scroll 0pt 0pt; float: left; display: block; height: 80px;" id="youtube_signup_btncenterinactive"><span style="color:white;font-size:20px;line-height:30px;vertical-align:top;font-weight:normal;">' + GT.gettext("Sign up now") + '</span></li><li style="padding: 5px 5px 0px; background: transparent url(/static/go/img/buttons/green/btn_green_80_mid.gif) repeat-x scroll 0pt -40px; float: left; display: none; height: 80px;" id="youtube_signup_btncenteractive"><span style="color:white;font-size:20px;line-height:30px;vertical-align:top;font-weight:normal;">' + GT.gettext("Sign up now") + '</span></li><li style="margin: 0pt; float: left; display: block; height: 80px;" id="youtube_signup_btnright"><img width="10" height="80" onload="javascript:iePngFix(this, 10, 80);" src="/static/go/img/buttons/green/btn_green_80_right.png"/></li></ol></div></li></ul></div></div>')
      } else {
          $("#OG_content").css(A)
      }
      var E = new SWFObject(B, "ads", "680", "409", "8", "#ffffff");
      E.addParam("allowfullscreen", "true");
      E.addParam("allowscriptaccess", "always");
      E.addParam("wmode", "transparent");
      E.addParam("movie", B);
      E.write("#OG_content_child")
  }

  function hideOG() {
      var A = $("tracker_id").innerHTML;
      grayOutGlobal(false, A);
      $("overlayObjectGlobal").style.width = "550px";
      $("OG_content").style.padding = "0px"
  };

}