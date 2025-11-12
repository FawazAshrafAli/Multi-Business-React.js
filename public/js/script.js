import $ from 'jquery';
import '/public/easy-responsive-tabs';

$(function () {
    $('#horizontalTab').easyResponsiveTabs({
        type: 'default',
        width: 'auto',
        fit: true,
        closed: 'accordion',
        activate: function (event) {
            var $tab = $(this);
            var $info = $('#tabInfo');
            var $name = $('span', $info);
            $name.text($tab.text());
            $info.show();
        }
    });

    $('#verticalTab').easyResponsiveTabs({
        type: 'vertical',
        width: 'auto',
        fit: true
    });
 

    // jQuery for custom accordion functionality
    $(document).on('click', '.faqs_accordion', function() {


        var $this = $(this);
        var $panel = $this.next('.faqs_panel');
        $this.toggleClass('active');
        $panel.toggleClass('show');
        $('.faqs_accordion').not($this).removeClass('active');
        $('.faqs_panel').not($panel).removeClass('show');
    });
});


$(function () {
    window.onscroll = function() { myFunction() };

    var navbar = document.getElementById("stick_navbar");
    var sticky = navbar?.offsetTop;
    
    function myFunction() {
        if (navbar) {
            if (window.pageYOffset >= sticky) {
              navbar.classList.add("bz_sticky")
            } else {
              navbar.classList.remove("bz_sticky");
            }
        }
    }
  });


  /*----------------------------------------*/
 /* 18. Category menu Activation
 /*----------------------------------------*/
 $('.category-sub-menu li.has-sub > a').on('click', function () {
    $(this).removeAttr('href');
    var element = $(this).parent('li');
    if (element.hasClass('open')) {
        element.removeClass('open');
        element.find('li').removeClass('open');
        element.find('ul').slideUp();
    } else {
        element.addClass('open');
        element.children('ul').slideDown();
        element.siblings('li').children('ul').slideUp();
        element.siblings('li').removeClass('open');
        element.siblings('li').find('li').removeClass('open');
        element.siblings('li').find('ul').slideUp();
    }
});


$(function () {
    $('.navbar-toggler').on('click', function(){
        $('.navbar-collapse').slideToggle(300);
    });
    
    smallScreenMenu();
    let temp;
    function resizeEnd(){
        smallScreenMenu();
    }

    $(window).on('resize', function(){
        clearTimeout(temp);
        temp = setTimeout(resizeEnd, 100);
        resetMenu();
    });
});


const subMenus = $('.sub-menu');
const menuLinks = $('.menu-link');

function smallScreenMenu(){
    if($(window).innerWidth() <= 992){
        menuLinks.each(function(item){
            $(this).on('click', function(){
                $(this).next().slideToggle();
            });
        });
    } else {
        menuLinks.each(function(item){
            $(this).off('click');
        });
    }
}

function resetMenu(){
    if($(window).innerWidth() > 992){
        subMenus.each(function(item){
            $(this).css('display', 'none');
        });
    }
}

(function () {
  const BP = 992; // mobile+tablet breakpoint
  const toggler = document.querySelector('.navbar-toggler');
  const panel   = document.querySelector('.navbar-collapse');

  if (!toggler || !panel) return;

  // Helper: are we on small screen?
  const isSmall = () => window.innerWidth <= BP;

  // Toggle menu on burger click (small screens only)
  toggler.addEventListener('click', function () {
    if (!isSmall()) return; // desktop: do nothing
    const willOpen = !panel.classList.contains('open');
    panel.classList.toggle('open', willOpen);
    panel.style.maxHeight = willOpen ? panel.scrollHeight + 'px' : null;
  });

  // Close menu when a nav link is clicked (optional but nicer on mobile)
  panel.addEventListener('click', function (e) {
    const el = e.target.closest('a');
    if (!el || !isSmall()) return;
    panel.classList.remove('open');
    panel.style.maxHeight = null;
  });

  // On resize back to desktop, reset inline styles (won't touch your desktop CSS)
  let t;
  window.addEventListener('resize', function () {
    clearTimeout(t);
    t = setTimeout(() => {
      if (!isSmall()) {
        panel.classList.remove('open');
        panel.style.maxHeight = null;
      } else if (panel.classList.contains('open')) {
        // keep height accurate if content/height changed
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    }, 120);
  });
})();

export default $.fn.scripts;