import $ from 'jquery';

if (typeof window !== 'undefined' && $.fn && !$.fn.easyResponsiveTabs) {
  $.fn.easyResponsiveTabs = function (options) {
    const defaults = {
      type: 'default',
      width: 'auto',
      fit: true,
      closed: false,
      activate: function () {}
    };

    const opt = $.extend(defaults, options);
    const jtype = opt.type;
    const jfit = opt.fit;
    const jwidth = opt.width;
    const vtabs = 'vertical';
    const accord = 'accordion';

    this.on('tabactivate', function (e, currentTab) {
      if (typeof opt.activate === 'function') {
        opt.activate.call(currentTab, e);
      }
    });

    return this.each(function () {
      const $respTabs = $(this);
      const $respTabsList = $respTabs.find('ul.resp-tabs-list');

      $respTabs.find('ul.resp-tabs-list li').addClass('resp-tab-item');
      $respTabs.css({ display: 'block', width: jwidth });
      $respTabs.find('.resp-tabs-container > div').addClass('resp-tab-content');

      function jtab_options() {
        if (jtype === vtabs) {
          $respTabs.addClass('resp-vtabs');
        }
        if (jfit) {
          $respTabs.css({ width: '100%', margin: '0px' });
        }
        if (jtype === accord) {
          $respTabs.addClass('resp-easy-accordion');
          $respTabs.find('.resp-tabs-list').hide();
        }
      }

      jtab_options();

      $respTabs.find('.resp-tab-content').before("<h2 class='resp-accordion' role='tab'><span class='resp-arrow'></span></h2>");

      $respTabs.find('.resp-accordion').each(function (index) {
        const title = $respTabs.find('.resp-tab-item').eq(index).html();
        $(this).append(title).attr('aria-controls', `tab_item-${index}`);
      });

      $respTabs.find('.resp-tab-item').each(function (index) {
        $(this).attr({ 'aria-controls': `tab_item-${index}`, role: 'tab' });

        if (
          opt.closed !== true &&
          !(opt.closed === 'accordion' && !$respTabsList.is(':visible')) &&
          !(opt.closed === 'tabs' && $respTabsList.is(':visible'))
        ) {
          if (index === 0) {
            $(this).addClass('resp-tab-active');
            $respTabs.find('.resp-accordion').eq(0).addClass('resp-tab-active');
            $respTabs.find('.resp-tab-content').eq(0).addClass('resp-tab-content-active').show();
          }
        }
      });

      $respTabs.find('.resp-tab-content').each(function (index) {
        $(this).attr('aria-labelledby', `tab_item-${index}`);
      });

      $respTabs.find('[role=tab]').on('click', function () {
        const $currentTab = $(this);
        const tabId = $currentTab.attr('aria-controls');

        if ($currentTab.hasClass('resp-accordion') && $currentTab.hasClass('resp-tab-active')) {
          $respTabs.find('.resp-tab-content-active').slideUp().addClass('resp-accordion-closed');
          $currentTab.removeClass('resp-tab-active');
          return false;
        }

        $respTabs.find('.resp-tab-active').removeClass('resp-tab-active');
        $respTabs.find('.resp-tab-content-active').slideUp().removeClass('resp-tab-content-active resp-accordion-closed');

        $respTabs.find(`[aria-controls=${tabId}]`).addClass('resp-tab-active');
        $respTabs.find(`.resp-tab-content[aria-labelledby=${tabId}]`).slideDown().addClass('resp-tab-content-active');

        $currentTab.trigger('tabactivate', $currentTab);
      });

      $(window).on('resize', function () {
        $respTabs.find('.resp-accordion-closed').removeAttr('style');
      });
    });
  };
}

export default $;
