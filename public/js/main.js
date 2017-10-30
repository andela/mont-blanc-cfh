$(document).ready(function(){
    //  Initialize AOS
    AOS.init();


    $(window).bind('scroll', function(){
        var scrollAmount = $(window).scrollTop()
        if(scrollAmount > 50) {
            $('.navbar').addClass('navbar-scroll');
        } else {
            $('.navbar').removeClass('navbar-scroll');
        }
    });
    
});
