$(document).ready(() => {
  /**
   * Initialize AOS
   */
  AOS.init();


  $(window).bind('scroll', () => {
    const scrollAmount = $(window).scrollTop();
    if (scrollAmount > 50) {
      $('.navbar-landing').addClass('navbar-scroll');
    } else {
      $('.navbar-landing').removeClass('navbar-scroll');
    }
  });
});
