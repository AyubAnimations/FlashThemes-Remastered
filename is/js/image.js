function MM_preloadImages() {
    var D = document;
    if (D.images) {
        if (!D.MM_p) {
            D.MM_p = new Array()
        }
        var C, B = D.MM_p.length,
            A = MM_preloadImages.arguments;
        for (C = 0; C < A.length; C++) {
            if (A[C].indexOf("#") != 0) {
                D.MM_p[B] = new Image;
                D.MM_p[B++].src = A[C]
            }
        }
    }
}

function MM_swapImgRestore() {
    var C, A, B = document.MM_sr;
    for (C = 0; B && C < B.length && (A = B[C]) && A.oSrc; C++) {
        A.src = A.oSrc
    }
}

function MM_findObj(E, D) {
    var C, B, A;
    if (!D) {
        D = document
    }
    if ((C = E.indexOf("?")) > 0 && parent.frames.length) {
        D = parent.frames[E.substring(C + 1)].document;
        E = E.substring(0, C)
    }
    if (!(A = D[E]) && D.all) {
        A = D.all[E]
    }
    for (B = 0; !A && B < D.forms.length; B++) {
        A = D.forms[B][E]
    }
    for (B = 0; !A && D.layers && B < D.layers.length; B++) {
        A = MM_findObj(E, D.layers[B].document)
    }
    if (!A && D.getElementById) {
        A = D.getElementById(E)
    }
    return A
}

function MM_swapImage() {
    var D, C = 0,
        A, B = MM_swapImage.arguments;
    document.MM_sr = new Array;
    for (D = 0; D < (B.length - 2); D += 3) {
        if ((A = MM_findObj(B[D])) != null) {
            document.MM_sr[C++] = A;
            if (!A.oSrc) {
                A.oSrc = A.src
            }
            A.src = B[D + 2]
        }
    }
};