
// import smoothScroll from 'smoothscroll';

$(document).ready(() => {
  //  Initialize AOS
  AOS.init();

  $(window).bind('scroll', () => {
    const scrollAmount = $(window).scrollTop();
    if (scrollAmount > 50) {
      $('.navbar-landing').addClass('navbar-scroll');
      $('.navbar-brand-fixed').addClass('navbar-brand-animate');
      $('.nav-link').addClass('nav-link-animate');
      $('.nav').addClass('link-adjust');
      $('#image').removeClass('initialLogo');
      $('#image').addClass('finalLogo');
    } else {
      $('.navbar-landing').removeClass('navbar-scroll');
      $('.navbar-brand-fixed').removeClass('navbar-brand-animate');
      $('.nav-link').removeClass('nav-link-animate');
      $('.nav').removeClass('link-adjust');
      $('#image').addClass('initialLogo');
      $('#image').removeClass('finalLogo');
    }
  });

  // Hide nabvar on click

  $('nav').find('li').bind('click', 'a', function () {
    $(this).collapse('hide');
  });
});
