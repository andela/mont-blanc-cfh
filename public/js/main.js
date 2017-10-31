$(document).ready(() => {
  //  Initialize AOS
  AOS.init();


  $(window).bind('scroll', () => {
    const scrollAmount = $(window).scrollTop();
    if (scrollAmount > 50) {
      $('.navbar').addClass('navbar-scroll');
    } else {
      $('.navbar').removeClass('navbar-scroll');
    }
  });
});
