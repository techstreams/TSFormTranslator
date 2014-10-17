
/*
* Copyright 2014 Laura Taylor
* (https://github.com/techstreams/TSFormTranslator)
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*      http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
 */
(function(jQuery) {
  var $, config;
  $ = jQuery;
  config = {
    initializeBtnIcon: function() {
      var icon;
      icon = $('button').children('i:first-child');
      icon.removeClass('fa-minus-circle');
      return icon.addClass('fa-plus-circle');
    },
    toggleBtnIcon: function(icon) {
      if (icon.hasClass('fa-plus-circle')) {
        icon.removeClass('fa-plus-circle');
        return icon.addClass('fa-minus-circle');
      } else {
        icon.removeClass('fa-minus-circle');
        return icon.addClass('fa-plus-circle');
      }
    }
  };
  return $(document).on("ready", function() {
    $("button").on("click", function() {
      var icon;
      icon = $(this).children('i:first-child');
      config.toggleBtnIcon(icon);
      return $(this).next('div').toggle();
    });
    $('a.next').on('click', function(e) {
      var $activetab, $parenttabs, currentAttrValue;
      currentAttrValue = $(this).attr('href');
      $('.tabs ' + currentAttrValue).show().siblings().hide();
      $parenttabs = $(this).parents('div.tabs');
      $activetab = $parenttabs.find('li.active');
      $activetab.next('li').addClass('active');
      $activetab.removeClass('active');
      $('div.hidden').hide();
      config.initializeBtnIcon();
      return e.preventDefault();
    });
    $('a.prev').on('click', function(e) {
      var $activetab, $parenttabs, currentAttrValue;
      currentAttrValue = $(this).attr('href');
      $('.tabs ' + currentAttrValue).show().siblings().hide();
      $parenttabs = $(this).parents('div.tabs');
      $activetab = $parenttabs.find('li.active');
      $activetab.prev('li').addClass('active');
      $activetab.removeClass('active');
      $('div.hidden').hide();
      config.initializeBtnIcon();
      return e.preventDefault();
    });
    return $('.tabs .tab-links a').on('click', function(e) {
      var currentAttrValue;
      currentAttrValue = $(this).attr('href');
      $('.tabs ' + currentAttrValue).show().siblings().hide();
      $(this).parent('li').addClass('active').siblings().removeClass('active');
      $('div.hidden').hide();
      config.initializeBtnIcon();
      return e.preventDefault();
    });
  });
})(jQuery);
