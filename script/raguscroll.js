$(window).on("load", function () {
    $(window).scroll(function () {
        var windowBottom = $(this).scrollTop() + $(this).innerHeight();
        $(".reveal").each(function () {
            /* Check the location of each desired element */
            var objectBottom = $(this).offset().top + $(this).outerHeight();
            /* If the element is completely within bounds of the window, fade it in */
            if (objectBottom < windowBottom) { //object comes into view (scrolling down)
                if ($(this).css("opacity") == 0) { $(this).fadeTo(500, 1); }
            } else { //object goes out of view (scrolling up)
                if ($(this).css("opacity") == 1) { $(this).fadeTo(500, 0); }
            }
        });
    }).scroll(); //invoke scroll-handler on page-load
});




// ----------- RED LINE DRAWING -------------

var redline = document.getElementById("redline");
var length = redline.getTotalLength();

redline.style.strokeDasharray = length;
redline.style.strokeDashoffset = length;
window.addEventListener("scroll", myFunction);


function myFunction() {

    var scrollpercent = (document.body.scrollTop + document.documentElement.scrollTop) / (document.documentElement.scrollHeight - document.documentElement.clientHeight);
    var draw = length * scrollpercent;

    // Reverse the drawing (when scrolling upwards)
    redline.style.strokeDashoffset = length - draw;
}

// ----------- SIDEBAR OPEN/CLOSE -------------

function openNav() {
    document.getElementById("sidebar").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
    document.getElementById("sections-opacity").style.opacity = "0.1";
    document.getElementById("red-line").style.opacity = "0.03";
    document.getElementById("img-sidebar").style.display = "none";
}

function closeNav() {
    document.getElementById("sidebar").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
    document.body.style.backgroundColor = "#f8f8f8";
    document.getElementById("sections-opacity").style.opacity = "100%";
    document.getElementById("red-line").style.opacity = "100%";
    document.getElementById("img-sidebar").style.display = "block";
}


