function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function ($) {
  var $ = jQuery = $;
  var cc = {
    sections: []
  };
  theme.cartNoteMonitor = {
    load: function load($notes) {
      $notes.on('change.themeCartNoteMonitor paste.themeCartNoteMonitor keyup.themeCartNoteMonitor', function () {
        theme.cartNoteMonitor.postUpdate($(this).val());
      });
    },
    unload: function unload($notes) {
      $notes.off('.themeCartNoteMonitor');
    },
    updateThrottleTimeoutId: -1,
    updateThrottleInterval: 500,
    postUpdate: function postUpdate(val) {
      clearTimeout(theme.cartNoteMonitor.updateThrottleTimeoutId);
      theme.cartNoteMonitor.updateThrottleTimeoutId = setTimeout(function () {
        $.post(theme.routes.cart_url + '/update.js', {
          note: val
        }, function (data) {}, 'json');
      }, theme.cartNoteMonitor.updateThrottleInterval);
    }
  }; // Loading third party scripts

  theme.scriptsLoaded = {};

  theme.loadScriptOnce = function (src, callback, beforeRun, sync) {
    if (typeof theme.scriptsLoaded[src] === 'undefined') {
      theme.scriptsLoaded[src] = [];
      var tag = document.createElement('script');
      tag.src = src;

      if (sync || beforeRun) {
        tag.async = false;
      }

      if (beforeRun) {
        beforeRun();
      }

      if (typeof callback === 'function') {
        theme.scriptsLoaded[src].push(callback);

        if (tag.readyState) {
          // IE, incl. IE9
          tag.onreadystatechange = function () {
            if (tag.readyState == "loaded" || tag.readyState == "complete") {
              tag.onreadystatechange = null;

              for (var i = 0; i < theme.scriptsLoaded[this].length; i++) {
                theme.scriptsLoaded[this][i]();
              }

              theme.scriptsLoaded[this] = true;
            }
          }.bind(src);
        } else {
          tag.onload = function () {
            // Other browsers
            for (var i = 0; i < theme.scriptsLoaded[this].length; i++) {
              theme.scriptsLoaded[this][i]();
            }

            theme.scriptsLoaded[this] = true;
          }.bind(src);
        }
      }

      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      return true;
    } else if (_typeof(theme.scriptsLoaded[src]) === 'object' && typeof callback === 'function') {
      theme.scriptsLoaded[src].push(callback);
    } else {
      if (typeof callback === 'function') {
        callback();
      }

      return false;
    }
  };

  theme.loadStyleOnce = function (src) {
    var srcWithoutProtocol = src.replace(/^https?:/, '');

    if (!document.querySelector('link[href="' + encodeURI(srcWithoutProtocol) + '"]')) {
      var tag = document.createElement('link');
      tag.href = srcWithoutProtocol;
      tag.rel = 'stylesheet';
      tag.type = 'text/css';
      var firstTag = document.getElementsByTagName('link')[0];
      firstTag.parentNode.insertBefore(tag, firstTag);
    }
  };

  theme.Disclosure = function () {
    var selectors = {
      disclosureList: '[data-disclosure-list]',
      disclosureToggle: '[data-disclosure-toggle]',
      disclosureInput: '[data-disclosure-input]',
      disclosureOptions: '[data-disclosure-option]'
    };
    var classes = {
      listVisible: 'disclosure-list--visible'
    };

    function Disclosure($disclosure) {
      this.$container = $disclosure;
      this.cache = {};

      this._cacheSelectors();

      this._connectOptions();

      this._connectToggle();

      this._onFocusOut();
    }

    Disclosure.prototype = $.extend({}, Disclosure.prototype, {
      _cacheSelectors: function _cacheSelectors() {
        this.cache = {
          $disclosureList: this.$container.find(selectors.disclosureList),
          $disclosureToggle: this.$container.find(selectors.disclosureToggle),
          $disclosureInput: this.$container.find(selectors.disclosureInput),
          $disclosureOptions: this.$container.find(selectors.disclosureOptions)
        };
      },
      _connectToggle: function _connectToggle() {
        this.cache.$disclosureToggle.on('click', function (evt) {
          var ariaExpanded = $(evt.currentTarget).attr('aria-expanded') === 'true';
          $(evt.currentTarget).attr('aria-expanded', !ariaExpanded);
          this.cache.$disclosureList.toggleClass(classes.listVisible);
        }.bind(this));
      },
      _connectOptions: function _connectOptions() {
        this.cache.$disclosureOptions.on('click', function (evt) {
          evt.preventDefault();

          this._submitForm($(evt.currentTarget).data('value'));
        }.bind(this));
      },
      _onFocusOut: function _onFocusOut() {
        this.cache.$disclosureToggle.on('focusout', function (evt) {
          var disclosureLostFocus = this.$container.has(evt.relatedTarget).length === 0;

          if (disclosureLostFocus) {
            this._hideList();
          }
        }.bind(this));
        this.cache.$disclosureList.on('focusout', function (evt) {
          var childInFocus = $(evt.currentTarget).has(evt.relatedTarget).length > 0;
          var isVisible = this.cache.$disclosureList.hasClass(classes.listVisible);

          if (isVisible && !childInFocus) {
            this._hideList();
          }
        }.bind(this));
        this.$container.on('keyup', function (evt) {
          if (evt.which !== 27) return; // escape

          this._hideList();

          this.cache.$disclosureToggle.focus();
        }.bind(this));

        this.bodyOnClick = function (evt) {
          var isOption = this.$container.has(evt.target).length > 0;
          var isVisible = this.cache.$disclosureList.hasClass(classes.listVisible);

          if (isVisible && !isOption) {
            this._hideList();
          }
        }.bind(this);

        $('body').on('click', this.bodyOnClick);
      },
      _submitForm: function _submitForm(value) {
        this.cache.$disclosureInput.val(value);
        this.$container.parents('form').submit();
      },
      _hideList: function _hideList() {
        this.cache.$disclosureList.removeClass(classes.listVisible);
        this.cache.$disclosureToggle.attr('aria-expanded', false);
      },
      unload: function unload() {
        $('body').off('click', this.bodyOnClick);
        this.cache.$disclosureOptions.off();
        this.cache.$disclosureToggle.off();
        this.cache.$disclosureList.off();
        this.$container.off();
      }
    });
    return Disclosure;
  }(); // Turn a <select> tag into clicky boxes
  // Use with: $('select').clickyBoxes()


  $.fn.clickyBoxes = function (prefix) {
    if (prefix == 'destroy') {
      $(this).off('.clickyboxes');
      $(this).next('.clickyboxes').off('.clickyboxes');
    } else {
      return $(this).filter('select:not(.clickybox-replaced)').addClass('clickybox-replaced').each(function () {
        //Make sure rows are unique
        var prefix = prefix || $(this).attr('id'); //Create container

        var $optCont = $('<ul class="clickyboxes"/>').attr('id', 'clickyboxes-' + prefix).data('select', $(this)).insertAfter(this);
        var $label;

        if ($(this).is('[id]')) {
          $label = $('label[for="' + $(this).attr('id') + '"]'); // Grab real label
        } else {
          $label = $(this).siblings('label'); // Rough guess
        }

        if ($label.length > 0) {
          $optCont.addClass('options-' + removeDiacritics($label.text()).toLowerCase().replace(/'/g, '').replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/-*$/, ''));
        } //Add options to container


        $(this).find('option').each(function () {
          $('<li/>').appendTo($optCont).append($('<a href="#"/>').attr('data-value', $(this).val()).html($(this).html()).addClass('opt--' + removeDiacritics($(this).text()).toLowerCase().replace(/'/g, '').replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/-*$/, '')));
        }); //Select change event

        $(this).hide().addClass('replaced').on('change.clickyboxes keyup.clickyboxes', function () {
          //Choose the right option to show
          var val = $(this).val();
          $optCont.find('a').removeClass('active').filter(function () {
            return $(this).attr('data-value') == val;
          }).addClass('active');
        }).trigger('keyup'); //Initial value
        //Button click event

        $optCont.on('click.clickyboxes', 'a', function () {
          if (!$(this).hasClass('active')) {
            var $clicky = $(this).closest('.clickyboxes');
            $clicky.data('select').val($(this).data('value')).trigger('change');
            $clicky.trigger('change');
          }

          return false;
        });
      });
    }
  };

  (function () {
    function throttle(callback, threshold) {
      var debounceTimeoutId = -1;
      var tick = false;
      return function () {
        clearTimeout(debounceTimeoutId);
        debounceTimeoutId = setTimeout(callback, threshold);

        if (!tick) {
          callback.call();
          tick = true;
          setTimeout(function () {
            tick = false;
          }, threshold);
        }
      };
    }

    var scrollEvent = document.createEvent('Event');
    scrollEvent.initEvent('throttled-scroll', true, true);
    window.addEventListener("scroll", throttle(function () {
      window.dispatchEvent(scrollEvent);
    }, 200));
  })(); // requires: throttled-scroll, debouncedresize

  /*
    Define a section by creating a new function object and registering it with the section handler.
    The section handler manages:
      Instantiation for all sections on the current page
      Theme editor lifecycle events
      Deferred initialisation
      Event cleanup
  
    There are two ways to register a section.
    In a theme:
      theme.Sections.register('slideshow', theme.SlideshowSection);
      theme.Sections.register('header', theme.HeaderSection, { deferredLoad: false });
      theme.Sections.register('background-video', theme.VideoManager, { deferredLoadViewportExcess: 800 });
  
    As a component:
      cc.sections.push({ name: 'faq', section: theme.Faq });
  
    Assign any of these to receive Shopify section lifecycle events:
      this.onSectionLoad
      this.afterSectionLoadCallback
      this.onSectionSelect
      this.onSectionDeselect
      this.onBlockSelect
      this.onBlockDeselect
      this.onSectionUnload
      this.afterSectionUnloadCallback
  
    If you add any events using the manager's registerEventListener,
    e.g. this.registerEventListener(element, 'click', this.functions.handleClick.bind(this)),
    these will be automatically cleaned up after onSectionUnload.
   */


  theme.Sections = new function () {
    var _ = this;

    _._instances = [];
    _._deferredSectionTargets = [];
    _._sections = [];
    _._deferredLoadViewportExcess = 300; // load defferred sections within this many px of viewport

    _._deferredWatcherRunning = false;

    _.init = function () {
      $(document).on('shopify:section:load', function (e) {
        // load a new section
        var target = _._themeSectionTargetFromShopifySectionTarget(e.target);

        if (target) {
          _.sectionLoad(target);
        }
      }).on('shopify:section:unload', function (e) {
        // unload existing section
        var target = _._themeSectionTargetFromShopifySectionTarget(e.target);

        if (target) {
          _.sectionUnload(target);
        }
      });
      $(window).on('throttled-scroll.themeSectionDeferredLoader debouncedresize.themeSectionDeferredLoader', _._processDeferredSections);
      _._deferredWatcherRunning = true;
    }; // register a type of section


    _.register = function (type, section, options) {
      _._sections.push({
        type: type,
        section: section,
        afterSectionLoadCallback: options ? options.afterLoad : null,
        afterSectionUnloadCallback: options ? options.afterUnload : null
      }); // load now


      $('[data-section-type="' + type + '"]').each(function () {
        if (Shopify.designMode || options && options.deferredLoad === false || !_._deferredWatcherRunning) {
          _.sectionLoad(this);
        } else {
          _.sectionDeferredLoad(this, options);
        }
      });
    }; // prepare a section to load later


    _.sectionDeferredLoad = function (target, options) {
      _._deferredSectionTargets.push({
        target: target,
        deferredLoadViewportExcess: options && options.deferredLoadViewportExcess ? options.deferredLoadViewportExcess : _._deferredLoadViewportExcess
      });

      _._processDeferredSections(true);
    }; // load deferred sections if in/near viewport


    _._processDeferredSections = function (firstRunCheck) {
      if (_._deferredSectionTargets.length) {
        var viewportTop = $(window).scrollTop(),
            viewportBottom = viewportTop + $(window).height(),
            loopStart = firstRunCheck === true ? _._deferredSectionTargets.length - 1 : 0;

        for (var i = loopStart; i < _._deferredSectionTargets.length; i++) {
          var target = _._deferredSectionTargets[i].target,
              viewportExcess = _._deferredSectionTargets[i].deferredLoadViewportExcess,
              sectionTop = $(target).offset().top - viewportExcess,
              doLoad = sectionTop > viewportTop && sectionTop < viewportBottom;

          if (!doLoad) {
            var sectionBottom = sectionTop + $(target).outerHeight() + viewportExcess * 2;
            doLoad = sectionBottom > viewportTop && sectionBottom < viewportBottom;
          }

          if (doLoad || sectionTop < viewportTop && sectionBottom > viewportBottom) {
            // in viewport, load
            _.sectionLoad(target); // remove from deferred queue and resume checks


            _._deferredSectionTargets.splice(i, 1);

            i--;
          }
        }
      } // remove event if no more deferred targets left, if not on first run


      if (firstRunCheck !== true && _._deferredSectionTargets.length === 0) {
        _._deferredWatcherRunning = false;
        $(window).off('.themeSectionDeferredLoader');
      }
    }; // load in a section


    _.sectionLoad = function (target) {
      var target = target,
          sectionObj = _._sectionForTarget(target),
          section = false;

      if (sectionObj.section) {
        section = sectionObj.section;
      } else {
        section = sectionObj;
      }

      if (section !== false) {
        var instance = {
          target: target,
          section: section,
          $shopifySectionContainer: $(target).closest('.shopify-section'),
          thisContext: {
            functions: section.functions,
            registeredEventListeners: []
          }
        };
        instance.thisContext.registerEventListener = _._registerEventListener.bind(instance.thisContext);

        _._instances.push(instance); //Initialise any components


        if ($(target).data('components')) {
          //Init each component
          var components = $(target).data('components').split(',');
          components.forEach(function (component) {
            $(document).trigger('cc:component:load', [component, target]);
          });
        }

        _._callSectionWith(section, 'onSectionLoad', target, instance.thisContext);

        _._callSectionWith(section, 'afterSectionLoadCallback', target, instance.thisContext); // attach additional UI events if defined


        if (section.onSectionSelect) {
          instance.$shopifySectionContainer.on('shopify:section:select', function (e) {
            _._callSectionWith(section, 'onSectionSelect', e.target, instance.thisContext);
          });
        }

        if (section.onSectionDeselect) {
          instance.$shopifySectionContainer.on('shopify:section:deselect', function (e) {
            _._callSectionWith(section, 'onSectionDeselect', e.target, instance.thisContext);
          });
        }

        if (section.onBlockSelect) {
          $(target).on('shopify:block:select', function (e) {
            _._callSectionWith(section, 'onBlockSelect', e.target, instance.thisContext);
          });
        }

        if (section.onBlockDeselect) {
          $(target).on('shopify:block:deselect', function (e) {
            _._callSectionWith(section, 'onBlockDeselect', e.target, instance.thisContext);
          });
        }
      }
    }; // unload a section


    _.sectionUnload = function (target) {
      var sectionObj = _._sectionForTarget(target);

      var instanceIndex = -1;

      for (var i = 0; i < _._instances.length; i++) {
        if (_._instances[i].target == target) {
          instanceIndex = i;
        }
      }

      if (instanceIndex > -1) {
        var instance = _._instances[instanceIndex]; // remove events and call unload, if loaded

        $(target).off('shopify:block:select shopify:block:deselect');
        instance.$shopifySectionContainer.off('shopify:section:select shopify:section:deselect');

        _._callSectionWith(instance.section, 'onSectionUnload', target, instance.thisContext);

        _._unloadRegisteredEventListeners(instance.thisContext.registeredEventListeners);

        _._callSectionWith(sectionObj, 'afterSectionUnloadCallback', target, instance.thisContext);

        _._instances.splice(instanceIndex); //Destroy any components


        if ($(target).data('components')) {
          //Init each component
          var components = $(target).data('components').split(',');
          components.forEach(function (component) {
            $(document).trigger('cc:component:unload', [component, target]);
          });
        }
      } else {
        // check if it was a deferred section
        for (var i = 0; i < _._deferredSectionTargets.length; i++) {
          if (_._deferredSectionTargets[i].target == target) {
            _._deferredSectionTargets[i].splice(i, 1);

            break;
          }
        }
      }
    }; // Helpers


    _._registerEventListener = function (element, eventType, callback) {
      element.addEventListener(eventType, callback);
      this.registeredEventListeners.push({
        element: element,
        eventType: eventType,
        callback: callback
      });
    };

    _._unloadRegisteredEventListeners = function (registeredEventListeners) {
      registeredEventListeners.forEach(function (rel) {
        rel.element.removeEventListener(rel.eventType, rel.callback);
      });
    };

    _._callSectionWith = function (section, method, container, thisContext) {
      if (typeof section[method] === 'function') {
        try {
          if (thisContext) {
            section[method].bind(thisContext)(container);
          } else {
            section[method](container);
          }
        } catch (ex) {
          var sectionType = container.dataset['sectionType'];
          console.warn("Theme warning: '".concat(method, "' failed for section '").concat(sectionType, "'"));
          console.debug(container, ex);
        }
      }
    };

    _._themeSectionTargetFromShopifySectionTarget = function (target) {
      var $target = $('[data-section-type]:first', target);

      if ($target.length > 0) {
        return $target[0];
      } else {
        return false;
      }
    };

    _._sectionForTarget = function (target) {
      var type = $(target).attr('data-section-type');

      for (var i = 0; i < _._sections.length; i++) {
        if (_._sections[i].type == type) {
          return _._sections[i];
        }
      }

      return false;
    };

    _._sectionAlreadyRegistered = function (type) {
      for (var i = 0; i < _._sections.length; i++) {
        if (_._sections[i].type == type) {
          return true;
        }
      }

      return false;
    };
  }();

  var ccComponent = /*#__PURE__*/function () {
    "use strict";

    function ccComponent(name) {
      var cssSelector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ".cc-".concat(name);

      _classCallCheck(this, ccComponent);

      var _this = this;

      this.instances = []; // Initialise any instance of this component within a section

      $(document).on('cc:component:load', function (event, component, target) {
        if (component === name) {
          $(target).find("".concat(cssSelector, ":not(.cc-initialized)")).each(function () {
            _this.init(this);
          });
        }
      }); // Destroy any instance of this component within a section

      $(document).on('cc:component:unload', function (event, component, target) {
        if (component === name) {
          $(target).find(cssSelector).each(function () {
            _this.destroy(this);
          });
        }
      }); // Initialise any instance of this component

      $(cssSelector).each(function () {
        _this.init(this);
      });
    }

    _createClass(ccComponent, [{
      key: "init",
      value: function init(container) {
        $(container).addClass('cc-initialized');
      }
    }, {
      key: "destroy",
      value: function destroy(container) {
        $(container).removeClass('cc-initialized');
      }
    }, {
      key: "registerInstance",
      value: function registerInstance(container, instance) {
        this.instances.push({
          container: container,
          instance: instance
        });
      }
    }, {
      key: "destroyInstance",
      value: function destroyInstance(container) {
        this.instances = this.instances.filter(function (item) {
          if (item.container === container) {
            if (typeof item.instance.destroy === 'function') {
              item.instance.destroy();
            }

            return item.container !== container;
          }
        });
      }
    }]);

    return ccComponent;
  }(); /// Show a short-lived text popup above an element


  theme.showQuickPopup = function (message, $origin) {
    var $popup = $('<div class="simple-popup"/>');
    var offs = $origin.offset();
    $popup.html(message).css({
      'left': offs.left,
      'top': offs.top
    }).hide();
    $('body').append($popup);
    $popup.css({
      marginTop: -$popup.outerHeight() - 10,
      marginLeft: -($popup.outerWidth() - $origin.outerWidth()) / 2
    });
    $popup.fadeIn(200).delay(3500).fadeOut(400, function () {
      $(this).remove();
    });
  };

  theme.Shopify = {
    formatMoney: function formatMoney(t, r) {
      function e(t, r) {
        return void 0 === t ? r : t;
      }

      function a(t, r, a, o) {
        if (r = e(r, 2), a = e(a, ","), o = e(o, "."), isNaN(t) || null == t) return 0;
        t = (t / 100).toFixed(r);
        var n = t.split(".");
        return n[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + a) + (n[1] ? o + n[1] : "");
      }

      "string" == typeof t && (t = t.replace(".", ""));
      var o = "",
          n = /\{\{\s*(\w+)\s*\}\}/,
          i = r || this.money_format;

      switch (i.match(n)[1]) {
        case "amount":
          o = a(t, 2);
          break;

        case "amount_no_decimals":
          o = a(t, 0);
          break;

        case "amount_with_comma_separator":
          o = a(t, 2, ".", ",");
          break;

        case "amount_with_space_separator":
          o = a(t, 2, " ", ",");
          break;

        case "amount_with_period_and_space_separator":
          o = a(t, 2, " ", ".");
          break;

        case "amount_no_decimals_with_comma_separator":
          o = a(t, 0, ".", ",");
          break;

        case "amount_no_decimals_with_space_separator":
          o = a(t, 0, " ", "");
          break;

        case "amount_with_apostrophe_separator":
          o = a(t, 2, "'", ".");
          break;

        case "amount_with_decimal_separator":
          o = a(t, 2, ".", ".");
      }

      return i.replace(n, o);
    },
    formatImage: function formatImage(originalImageUrl, format) {
      return originalImageUrl ? originalImageUrl.replace(/^(.*)\.([^\.]*)$/g, '$1_' + format + '.$2') : '';
    },
    Image: {
      imageSize: function imageSize(t) {
        var e = t.match(/.+_((?:pico|icon|thumb|small|compact|medium|large|grande)|\d{1,4}x\d{0,4}|x\d{1,4})[_\.@]/);
        return null !== e ? e[1] : null;
      },
      getSizedImageUrl: function getSizedImageUrl(t, e) {
        if (null == e) return t;
        if ("master" == e) return this.removeProtocol(t);
        var o = t.match(/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i);

        if (null != o) {
          var i = t.split(o[0]),
              r = o[0];
          return this.removeProtocol(i[0] + "_" + e + r);
        }

        return null;
      },
      removeProtocol: function removeProtocol(t) {
        return t.replace(/http(s)?:/, "");
      }
    }
  };

  var ccPopup = /*#__PURE__*/function () {
    "use strict";

    function ccPopup($container, namespace) {
      _classCallCheck(this, ccPopup);

      this.$container = $container;
      this.namespace = namespace;
      this.cssClasses = {
        visible: 'cc-popup--visible',
        bodyNoScroll: 'cc-popup-no-scroll',
        bodyNoScrollPadRight: 'cc-popup-no-scroll-pad-right'
      };
    }
    /**
     * Open popup on timer / local storage - move focus to input ensure you can tab to submit and close
     * Add the cc-popup--visible class
     * Update aria to visible
     */


    _createClass(ccPopup, [{
      key: "open",
      value: function open(callback) {
        var _this2 = this;

        // Prevent the body from scrolling
        if (this.$container.data('freeze-scroll')) {
          $('body').addClass(this.cssClasses.bodyNoScroll); // Add any padding necessary to the body to compensate for the scrollbar that just disappeared

          var scrollDiv = document.createElement('div');
          scrollDiv.className = 'popup-scrollbar-measure';
          document.body.appendChild(scrollDiv);
          var scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;
          document.body.removeChild(scrollDiv);

          if (scrollbarWidth > 0) {
            $('body').css('padding-right', scrollbarWidth + 'px').addClass(this.cssClasses.bodyNoScrollPadRight);
          }
        } // Add reveal class


        this.$container.addClass(this.cssClasses.visible); // Track previously focused element

        this.previouslyActiveElement = document.activeElement; // Focus on the close button after the animation in has completed

        setTimeout(function () {
          _this2.$container.find('.cc-popup-close')[0].focus();
        }, 500); // Pressing escape closes the modal

        $(window).on('keydown' + this.namespace, function (event) {
          if (event.keyCode === 27) {
            _this2.close();
          }
        });

        if (callback) {
          callback();
        }
      }
    }, {
      key: "close",
      value:
      /**
       * Close popup on click of close button or background - where does the focus go back to?
       * Remove the cc-popup--visible class
       */
      function close(callback) {
        var _this3 = this;

        // Remove reveal class
        this.$container.removeClass(this.cssClasses.visible); // Revert focus

        if (this.previouslyActiveElement) {
          $(this.previouslyActiveElement).focus();
        } // Destroy the escape event listener


        $(window).off('keydown' + this.namespace); // Allow the body to scroll and remove any scrollbar-compensating padding

        if (this.$container.data('freeze-scroll')) {
          var transitionDuration = 500;
          var $innerModal = this.$container.find('.cc-popup-modal');

          if ($innerModal.length) {
            transitionDuration = parseFloat(getComputedStyle($innerModal[0])['transitionDuration']);

            if (transitionDuration && transitionDuration > 0) {
              transitionDuration *= 1000;
            }
          }

          setTimeout(function () {
            $('body').removeClass(_this3.cssClasses.bodyNoScroll).removeClass(_this3.cssClasses.bodyNoScrollPadRight).css('padding-right', '0');
          }, transitionDuration);
        }

        if (callback) {
          callback();
        }
      }
    }]);

    return ccPopup;
  }();

  ;

  var FacetedFiltersInstance = /*#__PURE__*/function () {
    "use strict";

    function FacetedFiltersInstance(el) {
      _classCallCheck(this, FacetedFiltersInstance);

      this.filteringEnabled = el.dataset.filtering === 'true';
      this.sortingEnabled = el.dataset.sorting === 'true';
      this.filtersControl = document.querySelector('.cc-filters-control');
      this.filtersContainer = document.querySelector('.cc-filters-container');
      this.productList = document.querySelector('.cc-product-list');

      if (this.filteringEnabled) {
        this.filters = document.querySelector('.cc-filters');
        this.filtersFooter = document.querySelector('.cc-filters__footer');
        this.activeFilters = document.querySelector('.cc-active-filters');
        this.clearFiltersBtn = document.querySelector('.js-clear-filters');
      }

      if (this.sortingEnabled) {
        this.sortBy = document.querySelector('.cc-filter--sort');
        this.activeSortText = document.querySelector('.cc-sort-selected');
      }

      this.utils = {
        hidden: 'is-hidden',
        loading: 'is-loading',
        open: 'is-open',
        filtersOpen: 'filters-open'
      };

      if (this.filteringEnabled && !this.filtersFooter.classList.contains(this.utils.hidden)) {
        this.filters.style.height = "calc(100% - ".concat(this.filtersFooter.offsetHeight, "px)");
      }

      this.bindEvents();
    }

    _createClass(FacetedFiltersInstance, [{
      key: "bindEvents",
      value: function bindEvents() {
        this.filtersControl.addEventListener('click', this.handleControlClick.bind(this));
        this.filtersContainer.addEventListener('click', this.handleFiltersClick.bind(this));
        this.filtersContainer.addEventListener('input', this.debounce(this.handleFilterChange.bind(this), 500));

        if (this.filteringEnabled) {
          if (document.querySelector('.cc-price-range')) {
            this.filtersContainer.addEventListener('change', this.debounce(this.handleFilterChange.bind(this), 500));
          }

          this.activeFilters.addEventListener('click', this.handleActiveFiltersClick.bind(this));
        }

        document.addEventListener('click', this.handleClickOutside.bind(this));
        window.addEventListener('popstate', this.handleHistoryChange.bind(this));
      }
    }, {
      key: "debounce",
      value: function debounce(fn, wait) {
        var _this4 = this;

        var timer;
        return function () {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          clearTimeout(timer);
          timer = setTimeout(function () {
            return fn.apply(_this4, args);
          }, wait);
        };
      }
      /**
       * Handles 'click' event on the filter/sort buttons (mobile only)
       * @param {Object} e - The event object
       */

    }, {
      key: "handleControlClick",
      value: function handleControlClick(e) {
        var _this5 = this;

        if (!e.target.matches('.cc-filters-control__btn')) return;
        document.body.classList.add(this.utils.filtersOpen);

        if (e.target.matches('.js-show-filters')) {
          this.filters.classList.add(this.utils.open);
        } else {
          this.sortBy.open = true; // Slight delay required before starting transition

          setTimeout(function () {
            _this5.sortBy.classList.add(_this5.utils.open);
          }, 10);
        }
      }
      /**
       * Handles 'click' event on the filters container
       * @param {Object} e - The event object
       */

    }, {
      key: "handleFiltersClick",
      value: function handleFiltersClick(e) {
        var _this6 = this;

        var target = e.target;
        var filter = target.closest('.cc-filter'); // Filter 'clear' button clicked

        if (target.matches('.cc-filter-clear-btn')) {
          e.preventDefault();
          this.applyFilters(new URL(e.target.href).searchParams.toString(), e);
          return;
        } // Filters/Sort 'close' button, '[x] results' button or 'apply' button clicked (mobile only)


        if (target.matches('.js-close-filters')) {
          if (filter) {
            // Delay to allow for filter closing transition
            setTimeout(function () {
              filter.classList.remove(_this6.utils.open);
              filter.open = false;
            }, 300);
          }

          if (this.filteringEnabled) {
            this.filters.classList.remove(this.utils.open);
          }

          document.body.classList.remove(this.utils.filtersOpen);
          return;
        }

        if (target.matches('.cc-filter__toggle') || target.matches('.cc-filter-back-btn')) {
          var openFilter = document.querySelector(".cc-filter[open]:not([data-index=\"".concat(filter.dataset.index, "\"])")); // If a filter was opened (tablet/desktop) and there's one already open, close it

          if (openFilter) {
            this.closeFilter(openFilter, false);
          } // Open/close the filter, class added to allow for css transition


          if (!filter.classList.contains(this.utils.open)) {
            setTimeout(function () {
              filter.classList.add(_this6.utils.open);
            }, 10);
          } else {
            e.preventDefault();
            this.closeFilter(filter);
          }
        }
      }
      /**
       * Handles 'click' event outside the filters (tablet/desktop)
       * @param {Object} e - The event object
       */

    }, {
      key: "handleClickOutside",
      value: function handleClickOutside(e) {
        var openFilter = document.querySelector(".cc-filter.".concat(this.utils.open)); // If there's a filter open and the click event wasn't on it, close it (tablet/desktop)

        if (openFilter) {
          var filter = e.target.closest('.cc-filter');

          if (!filter || filter !== openFilter) {
            e.preventDefault();
            this.closeFilter(openFilter);
          }
        }
      }
      /**
       * Handles 'input' and 'change' events on the filters and sort by
       * @param {Object} e - The event object
       */

    }, {
      key: "handleFilterChange",
      value: function handleFilterChange(e) {
        // Ignore 'change' events not triggered by user moving the price range slider
        if (e.type === 'change' && (!e.detail || e.detail.sender !== 'theme:component:price_range')) return; // If price min/max input value changed, dispatch 'change' event to trigger update of the slider

        if (e.type === 'input' && e.target.classList.contains('cc-price-range__input')) {
          e.target.dispatchEvent(new Event('change', {
            bubbles: true
          }));
        }

        var formData = new FormData(document.getElementById('filters'));
        var searchParams = new URLSearchParams(formData);
        this.applyFilters(searchParams.toString(), e);
      }
      /**
       * Handles 'click' event on the active filters
       * @param {Object} e - The event object
       */

    }, {
      key: "handleActiveFiltersClick",
      value: function handleActiveFiltersClick(e) {
        e.preventDefault();

        if (e.target.tagName === 'A') {
          this.applyFilters(new URL(e.target.href).searchParams.toString(), e);
        }
      }
      /**
       * Handles history changes (e.g. back button clicked)
       * @param {Object} e - The event object
       */

    }, {
      key: "handleHistoryChange",
      value: function handleHistoryChange(e) {
        var searchParams = '';

        if (e.state && e.state.searchParams) {
          searchParams = e.state.searchParams;
        }

        this.applyFilters(searchParams, null, false);
      }
      /**
       * Fetches the filtered/sorted page data and updates the current page
       * @param {string} searchParams - The filter/sort search parameters
       * @param {Object} e - The event object
       * @param {boolean} [updateUrl=true] - Whether to update the url with the selected filter/sort options
       */

    }, {
      key: "applyFilters",
      value: function applyFilters(searchParams, e) {
        var _this7 = this;

        var updateUrl = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
        this.productList.classList.add(this.utils.loading);
        fetch("".concat(window.location.pathname, "?").concat(searchParams)).then(function (response) {
          return response.text();
        }).then(function (responseText) {
          var html = responseText;
          var fetchedHTML = new DOMParser().parseFromString(html, 'text/html');

          _this7.updateFilters(fetchedHTML, e);

          _this7.productList.innerHTML = fetchedHTML.querySelector('.cc-product-list').innerHTML;
          document.dispatchEvent(new CustomEvent('filters-applied', {
            bubbles: true
          }));

          _this7.productList.classList.remove(_this7.utils.loading);
        });

        if (updateUrl) {
          this.updateURL(searchParams);
        }
      }
      /**
       * Updates the filters relevant to the fetched data
       * @param {html} fetchedHTML - HTML of the fetched page
       * @param {Object} e - The event object
       */

    }, {
      key: "updateFilters",
      value: function updateFilters(fetchedHTML, e) {
        var _this8 = this;

        // Update the Filter/Sort buttons (mobile only)
        this.filtersControl.innerHTML = fetchedHTML.querySelector('.cc-filters-control').innerHTML; // Update the 'selected' option in the 'Sort by' dropdown button (tablet/desktop)

        if (e && e.target.name === 'sort_by') {
          this.activeSortText.textContent = e.target.nextElementSibling.textContent;
        }

        if (!this.filteringEnabled) return;
        document.querySelectorAll('.cc-filter').forEach(function (filter) {
          var index = filter.dataset.index;
          if (index === '0') return; // Sort by

          var fetchedFilter = fetchedHTML.querySelector(".cc-filter[data-index=\"".concat(index, "\"]"));

          if (filter.dataset.type === 'price_range') {
            _this8.updateFilter(filter, fetchedFilter, false);

            if (!e || e.target.tagName !== 'INPUT') {
              // Update price fields and trigger update of slider
              filter.querySelectorAll('input').forEach(function (input) {
                input.value = fetchedHTML.getElementById(input.id).value;
                input.dispatchEvent(new CustomEvent('change', {
                  bubbles: true,
                  detail: {
                    sender: 'reset'
                  }
                }));
              });
            }
          } else {
            if (e && e.target.tagName === 'INPUT') {
              var changedFilter = e.target.closest('.cc-filter');

              _this8.updateFilter(filter, fetchedFilter, filter.dataset.index !== changedFilter.dataset.index);
            } else {
              _this8.updateFilter(filter, fetchedFilter, true);
            }
          }
        }); // Update the active filters

        this.updateActiveFilters(fetchedHTML); // Update the 'Clear all' button visibility (mobile only)

        this.clearFiltersBtn.hidden = fetchedHTML.querySelector('.js-clear-filters').hidden; // Update the '[x] results' button (mobile only)

        var footerEl = fetchedHTML.querySelector('.cc-filters__footer');
        var footerHidden = footerEl.classList.contains(this.utils.hidden);
        this.filtersFooter.innerHTML = footerEl.innerHTML;
        this.filtersFooter.classList.toggle(this.utils.hidden, footerHidden);
        this.filters.style.height = footerHidden ? null : "calc(100% - ".concat(this.filtersFooter.offsetHeight, "px)");
      }
      /**
       * Updates a filter
       * @param {HTMLElement} filter - The filter element
       * @param {HTMLElement} fetchedFilter - The fetched filter element
       * @param {boolean} updateAll - Whether to update all filter markup or just toggle/header
       */

    }, {
      key: "updateFilter",
      value: function updateFilter(filter, fetchedFilter, updateAll) {
        if (updateAll) {
          filter.innerHTML = fetchedFilter.innerHTML;
        } else {
          // Update toggle and header only
          filter.replaceChild(fetchedFilter.querySelector('.cc-filter__toggle'), filter.querySelector('.cc-filter__toggle'));
          filter.querySelector('.cc-filter__header').innerHTML = fetchedFilter.querySelector('.cc-filter__header').innerHTML;
        }
      }
      /**
       * Updates the active filter
       * @param {html} fetchedHTML - HTML of the fetched page
       */

    }, {
      key: "updateActiveFilters",
      value: function updateActiveFilters(fetchedHTML) {
        var activeFilters = fetchedHTML.querySelector('.cc-active-filters');
        this.activeFilters.innerHTML = activeFilters.innerHTML;
        this.activeFilters.hidden = !this.activeFilters.querySelector('.cc-active-filter');
      }
      /**
       * Updates the url with the current filter/sort parameters
       * @param {string} searchParams - The filter/sort parameters
       */

    }, {
      key: "updateURL",
      value: function updateURL(searchParams) {
        history.pushState({
          searchParams: searchParams
        }, '', "".concat(window.location.pathname).concat(searchParams && '?'.concat(searchParams)));
      }
      /**
       * Closes a filter
       * @param {HTMLElement} filter - The filter element
       * @param {boolean} [delay=true] - Whether to wait for the css transition
       */

    }, {
      key: "closeFilter",
      value: function closeFilter(filter) {
        var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
        clearTimeout(this.closeTimer);
        filter.classList.remove(this.utils.open); // Delay to allow for filter closing transition

        this.closeTimer = setTimeout(function () {
          filter.open = false;
        }, delay ? 300 : null);
      }
    }]);

    return FacetedFiltersInstance;
  }();

  var FacetedFilters = /*#__PURE__*/function (_ccComponent) {
    "use strict";

    _inherits(FacetedFilters, _ccComponent);

    var _super = _createSuper(FacetedFilters);

    function FacetedFilters() {
      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'faceted-filters';
      var cssSelector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ".cc-faceted-filters";

      _classCallCheck(this, FacetedFilters);

      return _super.call(this, name, cssSelector);
    }

    _createClass(FacetedFilters, [{
      key: "init",
      value: function init(container) {
        _get(_getPrototypeOf(FacetedFilters.prototype), "init", this).call(this, container);

        this.registerInstance(container, new FacetedFiltersInstance(container));
      }
    }, {
      key: "destroy",
      value: function destroy(container) {
        this.destroyInstance(container);

        _get(_getPrototypeOf(FacetedFilters.prototype), "destroy", this).call(this, container);
      }
    }]);

    return FacetedFilters;
  }(ccComponent);

  new FacetedFilters();
  theme.MapSection = new function () {
    var _ = this;

    _.config = {
      zoom: 14,
      styles: {
        "default": [],
        silver: [{
          "elementType": "geometry",
          "stylers": [{
            "color": "#f5f5f5"
          }]
        }, {
          "elementType": "labels.icon",
          "stylers": [{
            "visibility": "off"
          }]
        }, {
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#616161"
          }]
        }, {
          "elementType": "labels.text.stroke",
          "stylers": [{
            "color": "#f5f5f5"
          }]
        }, {
          "featureType": "administrative.land_parcel",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#bdbdbd"
          }]
        }, {
          "featureType": "poi",
          "elementType": "geometry",
          "stylers": [{
            "color": "#eeeeee"
          }]
        }, {
          "featureType": "poi",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#757575"
          }]
        }, {
          "featureType": "poi.park",
          "elementType": "geometry",
          "stylers": [{
            "color": "#e5e5e5"
          }]
        }, {
          "featureType": "poi.park",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#9e9e9e"
          }]
        }, {
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [{
            "color": "#ffffff"
          }]
        }, {
          "featureType": "road.arterial",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#757575"
          }]
        }, {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [{
            "color": "#dadada"
          }]
        }, {
          "featureType": "road.highway",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#616161"
          }]
        }, {
          "featureType": "road.local",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#9e9e9e"
          }]
        }, {
          "featureType": "transit.line",
          "elementType": "geometry",
          "stylers": [{
            "color": "#e5e5e5"
          }]
        }, {
          "featureType": "transit.station",
          "elementType": "geometry",
          "stylers": [{
            "color": "#eeeeee"
          }]
        }, {
          "featureType": "water",
          "elementType": "geometry",
          "stylers": [{
            "color": "#c9c9c9"
          }]
        }, {
          "featureType": "water",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#9e9e9e"
          }]
        }],
        retro: [{
          "elementType": "geometry",
          "stylers": [{
            "color": "#ebe3cd"
          }]
        }, {
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#523735"
          }]
        }, {
          "elementType": "labels.text.stroke",
          "stylers": [{
            "color": "#f5f1e6"
          }]
        }, {
          "featureType": "administrative",
          "elementType": "geometry.stroke",
          "stylers": [{
            "color": "#c9b2a6"
          }]
        }, {
          "featureType": "administrative.land_parcel",
          "elementType": "geometry.stroke",
          "stylers": [{
            "color": "#dcd2be"
          }]
        }, {
          "featureType": "administrative.land_parcel",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#ae9e90"
          }]
        }, {
          "featureType": "landscape.natural",
          "elementType": "geometry",
          "stylers": [{
            "color": "#dfd2ae"
          }]
        }, {
          "featureType": "poi",
          "elementType": "geometry",
          "stylers": [{
            "color": "#dfd2ae"
          }]
        }, {
          "featureType": "poi",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#93817c"
          }]
        }, {
          "featureType": "poi.park",
          "elementType": "geometry.fill",
          "stylers": [{
            "color": "#a5b076"
          }]
        }, {
          "featureType": "poi.park",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#447530"
          }]
        }, {
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [{
            "color": "#f5f1e6"
          }]
        }, {
          "featureType": "road.arterial",
          "elementType": "geometry",
          "stylers": [{
            "color": "#fdfcf8"
          }]
        }, {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [{
            "color": "#f8c967"
          }]
        }, {
          "featureType": "road.highway",
          "elementType": "geometry.stroke",
          "stylers": [{
            "color": "#e9bc62"
          }]
        }, {
          "featureType": "road.highway.controlled_access",
          "elementType": "geometry",
          "stylers": [{
            "color": "#e98d58"
          }]
        }, {
          "featureType": "road.highway.controlled_access",
          "elementType": "geometry.stroke",
          "stylers": [{
            "color": "#db8555"
          }]
        }, {
          "featureType": "road.local",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#806b63"
          }]
        }, {
          "featureType": "transit.line",
          "elementType": "geometry",
          "stylers": [{
            "color": "#dfd2ae"
          }]
        }, {
          "featureType": "transit.line",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#8f7d77"
          }]
        }, {
          "featureType": "transit.line",
          "elementType": "labels.text.stroke",
          "stylers": [{
            "color": "#ebe3cd"
          }]
        }, {
          "featureType": "transit.station",
          "elementType": "geometry",
          "stylers": [{
            "color": "#dfd2ae"
          }]
        }, {
          "featureType": "water",
          "elementType": "geometry.fill",
          "stylers": [{
            "color": "#b9d3c2"
          }]
        }, {
          "featureType": "water",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#92998d"
          }]
        }],
        dark: [{
          "elementType": "geometry",
          "stylers": [{
            "color": "#212121"
          }]
        }, {
          "elementType": "labels.icon",
          "stylers": [{
            "visibility": "off"
          }]
        }, {
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#757575"
          }]
        }, {
          "elementType": "labels.text.stroke",
          "stylers": [{
            "color": "#212121"
          }]
        }, {
          "featureType": "administrative",
          "elementType": "geometry",
          "stylers": [{
            "color": "#757575"
          }]
        }, {
          "featureType": "administrative.country",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#9e9e9e"
          }]
        }, {
          "featureType": "administrative.land_parcel",
          "stylers": [{
            "visibility": "off"
          }]
        }, {
          "featureType": "administrative.locality",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#bdbdbd"
          }]
        }, {
          "featureType": "poi",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#757575"
          }]
        }, {
          "featureType": "poi.park",
          "elementType": "geometry",
          "stylers": [{
            "color": "#181818"
          }]
        }, {
          "featureType": "poi.park",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#616161"
          }]
        }, {
          "featureType": "poi.park",
          "elementType": "labels.text.stroke",
          "stylers": [{
            "color": "#1b1b1b"
          }]
        }, {
          "featureType": "road",
          "elementType": "geometry.fill",
          "stylers": [{
            "color": "#2c2c2c"
          }]
        }, {
          "featureType": "road",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#8a8a8a"
          }]
        }, {
          "featureType": "road.arterial",
          "elementType": "geometry",
          "stylers": [{
            "color": "#373737"
          }]
        }, {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [{
            "color": "#3c3c3c"
          }]
        }, {
          "featureType": "road.highway.controlled_access",
          "elementType": "geometry",
          "stylers": [{
            "color": "#4e4e4e"
          }]
        }, {
          "featureType": "road.local",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#616161"
          }]
        }, {
          "featureType": "transit",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#757575"
          }]
        }, {
          "featureType": "water",
          "elementType": "geometry",
          "stylers": [{
            "color": "#000000"
          }]
        }, {
          "featureType": "water",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#3d3d3d"
          }]
        }],
        night: [{
          "elementType": "geometry",
          "stylers": [{
            "color": "#242f3e"
          }]
        }, {
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#746855"
          }]
        }, {
          "elementType": "labels.text.stroke",
          "stylers": [{
            "color": "#242f3e"
          }]
        }, {
          "featureType": "administrative.locality",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#d59563"
          }]
        }, {
          "featureType": "poi",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#d59563"
          }]
        }, {
          "featureType": "poi.park",
          "elementType": "geometry",
          "stylers": [{
            "color": "#263c3f"
          }]
        }, {
          "featureType": "poi.park",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#6b9a76"
          }]
        }, {
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [{
            "color": "#38414e"
          }]
        }, {
          "featureType": "road",
          "elementType": "geometry.stroke",
          "stylers": [{
            "color": "#212a37"
          }]
        }, {
          "featureType": "road",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#9ca5b3"
          }]
        }, {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [{
            "color": "#746855"
          }]
        }, {
          "featureType": "road.highway",
          "elementType": "geometry.stroke",
          "stylers": [{
            "color": "#1f2835"
          }]
        }, {
          "featureType": "road.highway",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#f3d19c"
          }]
        }, {
          "featureType": "transit",
          "elementType": "geometry",
          "stylers": [{
            "color": "#2f3948"
          }]
        }, {
          "featureType": "transit.station",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#d59563"
          }]
        }, {
          "featureType": "water",
          "elementType": "geometry",
          "stylers": [{
            "color": "#17263c"
          }]
        }, {
          "featureType": "water",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#515c6d"
          }]
        }, {
          "featureType": "water",
          "elementType": "labels.text.stroke",
          "stylers": [{
            "color": "#17263c"
          }]
        }],
        aubergine: [{
          "elementType": "geometry",
          "stylers": [{
            "color": "#1d2c4d"
          }]
        }, {
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#8ec3b9"
          }]
        }, {
          "elementType": "labels.text.stroke",
          "stylers": [{
            "color": "#1a3646"
          }]
        }, {
          "featureType": "administrative.country",
          "elementType": "geometry.stroke",
          "stylers": [{
            "color": "#4b6878"
          }]
        }, {
          "featureType": "administrative.land_parcel",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#64779e"
          }]
        }, {
          "featureType": "administrative.province",
          "elementType": "geometry.stroke",
          "stylers": [{
            "color": "#4b6878"
          }]
        }, {
          "featureType": "landscape.man_made",
          "elementType": "geometry.stroke",
          "stylers": [{
            "color": "#334e87"
          }]
        }, {
          "featureType": "landscape.natural",
          "elementType": "geometry",
          "stylers": [{
            "color": "#023e58"
          }]
        }, {
          "featureType": "poi",
          "elementType": "geometry",
          "stylers": [{
            "color": "#283d6a"
          }]
        }, {
          "featureType": "poi",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#6f9ba5"
          }]
        }, {
          "featureType": "poi",
          "elementType": "labels.text.stroke",
          "stylers": [{
            "color": "#1d2c4d"
          }]
        }, {
          "featureType": "poi.park",
          "elementType": "geometry.fill",
          "stylers": [{
            "color": "#023e58"
          }]
        }, {
          "featureType": "poi.park",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#3C7680"
          }]
        }, {
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [{
            "color": "#304a7d"
          }]
        }, {
          "featureType": "road",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#98a5be"
          }]
        }, {
          "featureType": "road",
          "elementType": "labels.text.stroke",
          "stylers": [{
            "color": "#1d2c4d"
          }]
        }, {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [{
            "color": "#2c6675"
          }]
        }, {
          "featureType": "road.highway",
          "elementType": "geometry.stroke",
          "stylers": [{
            "color": "#255763"
          }]
        }, {
          "featureType": "road.highway",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#b0d5ce"
          }]
        }, {
          "featureType": "road.highway",
          "elementType": "labels.text.stroke",
          "stylers": [{
            "color": "#023e58"
          }]
        }, {
          "featureType": "transit",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#98a5be"
          }]
        }, {
          "featureType": "transit",
          "elementType": "labels.text.stroke",
          "stylers": [{
            "color": "#1d2c4d"
          }]
        }, {
          "featureType": "transit.line",
          "elementType": "geometry.fill",
          "stylers": [{
            "color": "#283d6a"
          }]
        }, {
          "featureType": "transit.station",
          "elementType": "geometry",
          "stylers": [{
            "color": "#3a4762"
          }]
        }, {
          "featureType": "water",
          "elementType": "geometry",
          "stylers": [{
            "color": "#0e1626"
          }]
        }, {
          "featureType": "water",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#4e6d70"
          }]
        }]
      }
    };
    _.apiStatus = null;

    this.geolocate = function ($map) {
      var deferred = $.Deferred();
      var geocoder = new google.maps.Geocoder();
      var address = $map.data('address-setting');
      geocoder.geocode({
        address: address
      }, function (results, status) {
        if (status !== google.maps.GeocoderStatus.OK) {
          deferred.reject(status);
        }

        deferred.resolve(results);
      });
      return deferred;
    };

    this.createMap = function (container) {
      var $map = $('.map-section__map-container', container);
      return _.geolocate($map).then(function (results) {
        var mapOptions = {
          zoom: _.config.zoom,
          styles: _.config.styles[$(container).data('map-style')],
          center: results[0].geometry.location,
          scrollwheel: false,
          disableDoubleClickZoom: true,
          disableDefaultUI: true,
          zoomControl: true
        };
        _.map = new google.maps.Map($map[0], mapOptions);
        _.center = _.map.getCenter();
        var marker = new google.maps.Marker({
          map: _.map,
          position: _.center,
          clickable: false
        });
        google.maps.event.addDomListener(window, 'resize', function () {
          google.maps.event.trigger(_.map, 'resize');

          _.map.setCenter(_.center);
        });
      }.bind(this)).fail(function () {
        var errorMessage;

        switch (status) {
          case 'ZERO_RESULTS':
            errorMessage = theme.strings.addressNoResults;
            break;

          case 'OVER_QUERY_LIMIT':
            errorMessage = theme.strings.addressQueryLimit;
            break;

          default:
            errorMessage = theme.strings.addressError;
            break;
        } // Only show error in the theme editor


        if (Shopify.designMode) {
          var $mapContainer = $map.parents('.map-section');
          $mapContainer.addClass('page-width map-section--load-error');
          $mapContainer.find('.map-section__wrapper').html('<div class="errors text-center">' + errorMessage + '</div>');
        }
      });
    };

    this.onSectionLoad = function (target) {
      var $container = $(target); // Global function called by Google on auth errors

      window.gm_authFailure = function () {
        if (!Shopify.designMode) return;
        $container.addClass('page-width map-section--load-error');
        $container.find('.map-section__wrapper').html('<div class="errors text-center">' + theme.strings.authError + '</div>');
      }; // create maps


      var key = $container.data('api-key');

      if (typeof key !== 'string' || key === '') {
        return;
      } // load map


      theme.loadScriptOnce('https://maps.googleapis.com/maps/api/js?key=' + key, function () {
        _.createMap($container);
      });
    };

    this.onSectionUnload = function (target) {
      if (typeof window.google !== 'undefined' && typeof google.maps !== 'undefined') {
        google.maps.event.clearListeners(this.map, 'resize');
      }
    };
  }(); // Register the section

  cc.sections.push({
    name: 'map',
    section: theme.MapSection
  }); // Manage videos

  theme.VideoManager = new function () {
    var _ = this;

    _._permitPlayback = function (container) {
      return !($(container).hasClass('video-container--background') && $(window).outerWidth() < 768);
    }; // Youtube


    _.youtubeVars = {
      incrementor: 0,
      apiReady: false,
      videoData: {},
      toProcessSelector: '.video-container[data-video-type="youtube"]:not(.video--init)'
    };

    _.youtubeApiReady = function () {
      _.youtubeVars.apiReady = true;

      _._loadYoutubeVideos();
    };

    _._loadYoutubeVideos = function (container) {
      if ($(_.youtubeVars.toProcessSelector, container).length) {
        if (_.youtubeVars.apiReady) {
          // play those videos
          $(_.youtubeVars.toProcessSelector, container).each(function () {
            // Don't init background videos on mobile
            if (_._permitPlayback($(this))) {
              $(this).addClass('video--init');
              _.youtubeVars.incrementor++;
              var containerId = 'theme-yt-video-' + _.youtubeVars.incrementor;
              $(this).data('video-container-id', containerId);
              var videoElement = $('<div class="video-container__video-element">').attr('id', containerId).appendTo($('.video-container__video', this));
              var autoplay = $(this).data('video-autoplay');
              var loop = $(this).data('video-loop');
              var player = new YT.Player(containerId, {
                height: '360',
                width: '640',
                videoId: $(this).data('video-id'),
                playerVars: {
                  iv_load_policy: 3,
                  modestbranding: 1,
                  autoplay: 0,
                  loop: loop ? 1 : 0,
                  playlist: $(this).data('video-id'),
                  rel: 0,
                  showinfo: 0
                },
                events: {
                  onReady: _._onYoutubePlayerReady.bind({
                    autoplay: autoplay,
                    loop: loop,
                    $container: $(this)
                  }),
                  onStateChange: _._onYoutubePlayerStateChange.bind({
                    autoplay: autoplay,
                    loop: loop,
                    $container: $(this)
                  })
                }
              });
              _.youtubeVars.videoData[containerId] = {
                id: containerId,
                container: this,
                videoElement: videoElement,
                player: player
              };
            }
          });
        } else {
          // load api
          theme.loadScriptOnce('https://www.youtube.com/iframe_api');
        }
      }
    };

    _._onYoutubePlayerReady = function (event) {
      event.target.setPlaybackQuality('hd1080');

      if (this.autoplay) {
        event.target.mute();
        event.target.playVideo();
      }

      _._initBackgroundVideo(this.$container);
    };

    _._onYoutubePlayerStateChange = function (event) {
      if (event.data == YT.PlayerState.PLAYING) {
        this.$container.addClass('video--play-started');

        if (this.autoplay) {
          event.target.mute();
        }

        if (this.loop) {
          // 4 times a second, check if we're in the final second of the video. If so, loop it for a more seamless loop
          var finalSecond = event.target.getDuration() - 1;

          if (finalSecond > 2) {
            var loopTheVideo = function loopTheVideo() {
              if (event.target.getCurrentTime() > finalSecond) {
                event.target.seekTo(0);
              }

              setTimeout(loopTheVideo, 250);
            };

            loopTheVideo();
          }
        }
      }
    };

    _._unloadYoutubeVideos = function (container) {
      for (var dataKey in _.youtubeVars.videoData) {
        var data = _.youtubeVars.videoData[dataKey];

        if ($(container).find(data.container).length) {
          data.player.destroy();
          delete _.youtubeVars.videoData[dataKey];
          return;
        }
      }
    }; // Vimeo


    _.vimeoVars = {
      incrementor: 0,
      apiReady: false,
      videoData: {},
      toProcessSelector: '.video-container[data-video-type="vimeo"]:not(.video--init)'
    };

    _.vimeoApiReady = function () {
      _.vimeoVars.apiReady = true;

      _._loadVimeoVideos();
    };

    _._loadVimeoVideos = function (container) {
      if ($(_.vimeoVars.toProcessSelector, container).length) {
        if (_.vimeoVars.apiReady) {
          // play those videos
          $(_.vimeoVars.toProcessSelector, container).each(function () {
            // Don't init background videos on mobile
            if (_._permitPlayback($(this))) {
              $(this).addClass('video--init');
              _.vimeoVars.incrementor++;
              var $this = $(this);
              var containerId = 'theme-vi-video-' + _.vimeoVars.incrementor;
              $(this).data('video-container-id', containerId);
              var videoElement = $('<div class="video-container__video-element">').attr('id', containerId).appendTo($('.video-container__video', this));
              var autoplay = !!$(this).data('video-autoplay');
              var player = new Vimeo.Player(containerId, {
                url: $(this).data('video-url'),
                width: 640,
                loop: $(this).data('video-autoplay'),
                autoplay: autoplay,
                muted: $this.hasClass('video-container--background')
              });
              player.on('playing', function () {
                $(this).addClass('video--play-started');
              }.bind(this));
              player.ready().then(function () {
                if (autoplay) {
                  player.setVolume(0);
                  player.play();
                }

                if (player.element && player.element.width && player.element.height) {
                  var ratio = parseInt(player.element.height) / parseInt(player.element.width);
                  $this.find('.video-container__video').css('padding-bottom', ratio * 100 + '%');
                }

                _._initBackgroundVideo($this);
              });
              _.vimeoVars.videoData[containerId] = {
                id: containerId,
                container: this,
                videoElement: videoElement,
                player: player,
                autoPlay: autoplay
              };
            }
          });
        } else {
          // load api
          if (window.define) {
            // workaround for third parties using RequireJS
            theme.loadScriptOnce('https://player.vimeo.com/api/player.js', function () {
              _.vimeoVars.apiReady = true;

              _._loadVimeoVideos();

              window.define = window.tempDefine;
            }, function () {
              window.tempDefine = window.define;
              window.define = null;
            });
          } else {
            theme.loadScriptOnce('https://player.vimeo.com/api/player.js', function () {
              _.vimeoVars.apiReady = true;

              _._loadVimeoVideos();
            });
          }
        }
      }
    };

    _._unloadVimeoVideos = function (container) {
      for (var dataKey in _.vimeoVars.videoData) {
        var data = _.vimeoVars.videoData[dataKey];

        if ($(container).find(data.container).length) {
          data.player.unload();
          delete _.vimeoVars.videoData[dataKey];
          return;
        }
      }
    }; // Init third party apis - Youtube and Vimeo


    _._loadThirdPartyApis = function (container) {
      //Don't init youtube or vimeo background videos on mobile
      if (_._permitPlayback($('.video-container', container))) {
        _._loadYoutubeVideos(container);

        _._loadVimeoVideos(container);
      }
    }; // Mp4


    _.mp4Vars = {
      incrementor: 0,
      videoData: {},
      toProcessSelector: '.video-container[data-video-type="mp4"]:not(.video--init)'
    };

    _._loadMp4Videos = function (container) {
      if ($(_.mp4Vars.toProcessSelector, container).length) {
        // play those videos
        $(_.mp4Vars.toProcessSelector, container).addClass('video--init').each(function () {
          _.mp4Vars.incrementor++;
          var $this = $(this);
          var containerId = 'theme-mp-video-' + _.mp4Vars.incrementor;
          $(this).data('video-container-id', containerId);
          var videoElement = $('<div class="video-container__video-element">').attr('id', containerId).appendTo($('.video-container__video', this));
          var $video = $('<video playsinline>');

          if ($(this).data('video-loop')) {
            $video.attr('loop', 'loop');
          }

          if ($(this).data('video-autoplay')) {
            $video.attr({
              autoplay: 'autoplay',
              muted: 'muted'
            });
            $video[0].muted = true; // required by Chrome - ignores attribute

            $video.one('loadeddata', function () {
              this.play();
            });
          }

          $video.on('playing', function () {
            $(this).addClass('video--play-started');
          }.bind(this));
          $video.attr('src', $(this).data('video-url')).appendTo(videoElement);
        });
      }
    };

    _._unloadMp4Videos = function (container) {}; // background video placement for iframes


    _._initBackgroundVideo = function ($container) {
      if ($container.hasClass('video-container--background') && $container.find('.video-container__video iframe').length) {
        var assessBackgroundVideo = function assessBackgroundVideo() {
          var $container = this,
              cw = $container.width(),
              ch = $container.height(),
              cr = cw / ch,
              $frame = $('.video-container__video iframe', this),
              vr = $frame.attr('width') / $frame.attr('height'),
              $pan = $('.video-container__video', this),
              vCrop = 75; // pushes video outside container to hide controls

          if (cr > vr) {
            var vh = cw / vr + vCrop * 2;
            $pan.css({
              marginTop: (ch - vh) / 2 - vCrop,
              marginLeft: '',
              height: vh + vCrop * 2,
              width: ''
            });
          } else {
            var vw = cw * vr + vCrop * 2 * vr;
            $pan.css({
              marginTop: -vCrop,
              marginLeft: (cw - vw) / 2,
              height: ch + vCrop * 2,
              width: vw
            });
          }
        };

        assessBackgroundVideo.bind($container)();
        $(window).on('debouncedresize.' + $container.data('video-container-id'), assessBackgroundVideo.bind($container));
      }
    }; // Compatibility with Sections


    this.onSectionLoad = function (container) {
      // url only - infer type
      $('.video-container[data-video-url]:not([data-video-type])').each(function () {
        var url = $(this).data('video-url');

        if (url.indexOf('.mp4') > -1) {
          $(this).attr('data-video-type', 'mp4');
        }

        if (url.indexOf('vimeo.com') > -1) {
          $(this).attr('data-video-type', 'vimeo');
          $(this).attr('data-video-id', url.split('?')[0].split('/').pop());
        }

        if (url.indexOf('youtu.be') > -1 || url.indexOf('youtube.com') > -1) {
          $(this).attr('data-video-type', 'youtube');

          if (url.indexOf('v=') > -1) {
            $(this).attr('data-video-id', url.split('v=').pop().split('&')[0]);
          } else {
            $(this).attr('data-video-id', url.split('?')[0].split('/').pop());
          }
        }
      });

      _._loadThirdPartyApis(container);

      _._loadMp4Videos(container);

      $(window).on('debouncedresize.video-manager-resize', function () {
        _._loadThirdPartyApis(container);
      }); // play button

      $('.video-container__play', container).on('click', function (evt) {
        evt.preventDefault();
        var $container = $(this).closest('.video-container'); // reveal

        $container.addClass('video-container--playing'); // broadcast a play event on the section container

        $(container).trigger("cc:video:play"); // play

        var id = $container.data('video-container-id');

        if (id.indexOf('theme-yt-video') === 0) {
          _.youtubeVars.videoData[id].player.playVideo();
        } else {
          _.vimeoVars.videoData[id].player.play();
        }
      }); // modal close button

      $('.video-container__stop', container).on('click', function (evt) {
        evt.preventDefault();
        var $container = $(this).closest('.video-container'); // hide

        $container.removeClass('video-container--playing'); // broadcast a stop event on the section container

        $(container).trigger("cc:video:stop"); // play

        var id = $container.data('video-container-id');

        if (id.indexOf('theme-yt-video') === 0) {
          _.youtubeVars.videoData[id].player.stopVideo();
        } else {
          _.vimeoVars.videoData[id].player.pause();

          _.vimeoVars.videoData[id].player.setCurrentTime(0);
        }
      });
    };

    this.onSectionUnload = function (container) {
      $('.video-container__play, .video-container__stop', container).off('click');
      $(window).off('.' + $('.video-container').data('video-container-id'));
      $(window).off('debouncedresize.video-manager-resize');

      _._unloadYoutubeVideos(container);

      _._unloadVimeoVideos(container);

      _._unloadMp4Videos(container);

      $(container).trigger("cc:video:stop");
    };
  }(); // Youtube API callback

  window.onYouTubeIframeAPIReady = function () {
    theme.VideoManager.youtubeApiReady();
  }; // Register the section


  cc.sections.push({
    name: 'video',
    section: theme.VideoManager
  });
  /**
   * Popup Section Script
   * ------------------------------------------------------------------------------
   *
   * @namespace Popup
   */

  theme.Popup = new function () {
    /**
     * Popup section constructor. Runs on page load as well as Theme Editor
     * `section:load` events.
     * @param {string} container - selector for the section container DOM element
     */
    var dismissedStorageKey = 'cc-theme-popup-dismissed';

    this.onSectionLoad = function (container) {
      var _this9 = this;

      this.namespace = theme.namespaceFromSection(container);
      this.$container = $(container);
      this.popup = new ccPopup(this.$container, this.namespace);
      var dismissForDays = this.$container.data('dismiss-for-days'),
          delaySeconds = this.$container.data('delay-seconds'),
          showPopup = true,
          testMode = this.$container.data('test-mode'),
          lastDismissed = window.localStorage.getItem(dismissedStorageKey); // Should we show it during this page view?
      // Check when it was last dismissed

      if (lastDismissed) {
        var dismissedDaysAgo = (new Date().getTime() - lastDismissed) / (1000 * 60 * 60 * 24);

        if (dismissedDaysAgo < dismissForDays) {
          showPopup = false;
        }
      } // Check for error or success messages


      if (this.$container.find('.cc-popup-form__response').length) {
        showPopup = true;
        delaySeconds = 1; // If success, set as dismissed

        if (this.$container.find('.cc-popup-form__response--success').length) {
          this.functions.popupSetAsDismissed.call(this);
        }
      } // Prevent popup on Shopify robot challenge page


      if (document.querySelector('.shopify-challenge__container')) {
        showPopup = false;
      } // Show popup, if appropriate


      if (showPopup || testMode) {
        setTimeout(function () {
          _this9.popup.open();
        }, delaySeconds * 1000);
      } // Click on close button or modal background


      this.$container.on('click' + this.namespace, '.cc-popup-close, .cc-popup-background', function () {
        _this9.popup.close(function () {
          _this9.functions.popupSetAsDismissed.call(_this9);
        });
      });
    };

    this.onSectionSelect = function () {
      this.popup.open();
    };

    this.functions = {
      /**
       * Use localStorage to set as dismissed
       */
      popupSetAsDismissed: function popupSetAsDismissed() {
        window.localStorage.setItem(dismissedStorageKey, new Date().getTime());
      }
    };
    /**
     * Event callback for Theme Editor `section:unload` event
     */

    this.onSectionUnload = function () {
      this.$container.off(this.namespace);
    };
  }(); // Register section

  cc.sections.push({
    name: 'newsletter-popup',
    section: theme.Popup
  });
  /**
   * StoreAvailability Section Script
   * ------------------------------------------------------------------------------
   *
   * @namespace StoreAvailability
   */

  theme.StoreAvailability = function (container) {
    var loadingClass = 'store-availability-loading';
    var initClass = 'store-availability-initialized';
    var storageKey = 'cc-location';

    this.onSectionLoad = function (container) {
      var _this10 = this;

      this.namespace = theme.namespaceFromSection(container);
      this.$container = $(container);
      this.productId = this.$container.data('store-availability-container');
      this.sectionUrl = this.$container.data('section-url');
      this.$modal;
      var firstRun = true; // Handle when a variant is selected

      $(window).on("cc-variant-updated".concat(this.namespace).concat(this.productId), function (e, args) {
        if (args.product.id === _this10.productId) {
          _this10.functions.updateContent.bind(_this10)(args.variant.id, args.product.title, firstRun, _this10.$container.data('has-only-default-variant'), typeof args.variant.available !== "undefined");

          firstRun = false;
        }
      }); // Handle single variant products

      if (this.$container.data('single-variant-id')) {
        this.functions.updateContent.bind(this)(this.$container.data('single-variant-id'), this.$container.data('single-variant-product-title'), firstRun, this.$container.data('has-only-default-variant'), this.$container.data('single-variant-product-available'));
        firstRun = false;
      }
    };

    this.onSectionUnload = function () {
      $(window).off("cc-variant-updated".concat(this.namespace).concat(this.productId));
      this.$container.off('click');

      if (this.$modal) {
        this.$modal.off('click');
      }
    };

    this.functions = {
      // Returns the users location data (if allowed)
      getUserLocation: function getUserLocation() {
        return new Promise(function (resolve, reject) {
          var storedCoords;

          if (sessionStorage[storageKey]) {
            storedCoords = JSON.parse(sessionStorage[storageKey]);
          }

          if (storedCoords) {
            resolve(storedCoords);
          } else {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(function (position) {
                var coords = {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude
                }; //Set the localization api

                fetch('/localization.json', {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(coords)
                }); //Write to a session storage

                sessionStorage[storageKey] = JSON.stringify(coords);
                resolve(coords);
              }, function () {
                resolve(false);
              }, {
                maximumAge: 3600000,
                // 1 hour
                timeout: 5000
              });
            } else {
              resolve(false);
            }
          }
        });
      },
      // Requests the available stores and calls the callback
      getAvailableStores: function getAvailableStores(variantId, cb) {
        return $.get(this.sectionUrl.replace('VARIANT_ID', variantId), cb);
      },
      // Haversine Distance
      // The haversine formula is an equation giving great-circle distances between
      // two points on a sphere from their longitudes and latitudes
      calculateDistance: function calculateDistance(coords1, coords2, unitSystem) {
        var dtor = Math.PI / 180;
        var radius = unitSystem === 'metric' ? 6378.14 : 3959;
        var rlat1 = coords1.latitude * dtor;
        var rlong1 = coords1.longitude * dtor;
        var rlat2 = coords2.latitude * dtor;
        var rlong2 = coords2.longitude * dtor;
        var dlon = rlong1 - rlong2;
        var dlat = rlat1 - rlat2;
        var a = Math.pow(Math.sin(dlat / 2), 2) + Math.cos(rlat1) * Math.cos(rlat2) * Math.pow(Math.sin(dlon / 2), 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return radius * c;
      },
      // Updates the existing modal pickup with locations with distances from the user
      updateLocationDistances: function updateLocationDistances(coords) {
        var unitSystem = this.$modal.find('[data-unit-system]').data('unit-system');
        var self = this;
        this.$modal.find('[data-distance="false"]').each(function () {
          var _this11 = this;

          var thisCoords = {
            latitude: parseFloat($(this).data('latitude')),
            longitude: parseFloat($(this).data('longitude'))
          };

          if (thisCoords.latitude && thisCoords.longitude) {
            var distance = self.functions.calculateDistance(coords, thisCoords, unitSystem).toFixed(1);
            $(this).html(distance); //Timeout to trigger animation

            setTimeout(function () {
              $(_this11).closest('.store-availability-list__location__distance').addClass('-in');
            }, 0);
          }

          $(this).attr('data-distance', 'true');
        });
      },
      // Requests the available stores and updates the page with info below Add to Basket, and append the modal to the page
      updateContent: function updateContent(variantId, productTitle, firstRun, isSingleDefaultVariant, isVariantAvailable) {
        var _this12 = this;

        this.$container.off('click', '[data-store-availability-modal-open]');
        this.$container.off('click' + this.namespace, '.cc-popup-close, .cc-popup-background');
        $('.store-availabilities-modal').remove();

        if (firstRun) {
          this.$container.hide();
        } else if (!isVariantAvailable) {
          //If the variant is Unavailable (not the same as Out of Stock) - hide the store pickup completely
          this.$container.addClass(loadingClass).addClass(initClass);
          this.$container.css('height', '0px');
        } else {
          this.$container.addClass(loadingClass).addClass(initClass);
          this.$container.css('height', this.$container.outerHeight() > 0 ? this.$container.outerHeight() + 'px' : 'auto');
        }

        if (isVariantAvailable) {
          this.functions.getAvailableStores.call(this, variantId, function (response) {
            if (response.trim().length > 0 && !response.includes('NO_PICKUP')) {
              _this12.$container.html(response);

              _this12.$container.html(_this12.$container.children().first().html()); // editor bug workaround


              _this12.$container.find('[data-store-availability-modal-product-title]').html(productTitle);

              if (isSingleDefaultVariant) {
                _this12.$container.find('.store-availabilities-modal__variant-title').remove();
              }

              _this12.$container.find('.cc-popup').appendTo('body');

              _this12.$modal = $('body').find('.store-availabilities-modal');
              var popup = new ccPopup(_this12.$modal, _this12.namespace);

              _this12.$container.on('click', '[data-store-availability-modal-open]', function () {
                popup.open(); //When the modal is opened, try and get the users location

                _this12.functions.getUserLocation().then(function (coords) {
                  if (coords && _this12.$modal.find('[data-distance="false"]').length) {
                    //Re-retrieve the available stores location modal contents
                    _this12.functions.getAvailableStores.call(_this12, variantId, function (response) {
                      _this12.$modal.find('.store-availabilities-list').html($(response).find('.store-availabilities-list').html());

                      _this12.functions.updateLocationDistances.bind(_this12)(coords);
                    });
                  }
                });

                return false;
              });

              _this12.$modal.on('click' + _this12.namespace, '.cc-popup-close, .cc-popup-background', function () {
                popup.close();
              });

              if (firstRun) {
                _this12.$container.slideDown(300);
              } else {
                _this12.$container.removeClass(loadingClass);

                var newHeight = _this12.$container.find('.store-availability-container').outerHeight();

                _this12.$container.css('height', newHeight > 0 ? newHeight + 'px' : 'auto');
              }
            }
          });
        }
      }
    }; // Initialise the section when it's instantiated

    this.onSectionLoad(container);
  }; // Register section


  cc.sections.push({
    name: 'store-availability',
    section: theme.StoreAvailability
  });
  /*================ Feature detection ================*/

  try {
    theme.shopifyFeatures = JSON.parse(document.documentElement.querySelector('#shopify-features').textContent);
  } catch (e) {
    theme.shopifyFeatures = {};
  }
  /*================ Slate ================*/

  /**
   * A11y Helpers
   * -----------------------------------------------------------------------------
   * A collection of useful functions that help make your theme more accessible
   * to users with visual impairments.
   *
   *
   * @namespace a11y
   */


  slate.a11y = {
    /**
     * For use when focus shifts to a container rather than a link
     * eg for In-page links, after scroll, focus shifts to content area so that
     * next `tab` is where user expects if focusing a link, just $link.focus();
     *
     * @param {JQuery} $element - The element to be acted upon
     */
    pageLinkFocus: function pageLinkFocus($element) {
      var focusClass = 'js-focus-hidden';
      $element.first().attr('tabIndex', '-1').focus().addClass(focusClass).one('blur', callback);

      function callback() {
        $element.first().removeClass(focusClass).removeAttr('tabindex');
      }
    },

    /**
     * If there's a hash in the url, focus the appropriate element
     */
    focusHash: function focusHash() {
      var hash = window.location.hash; // is there a hash in the url? is it an element on the page?

      if (hash && document.getElementById(hash.slice(1))) {
        this.pageLinkFocus($(hash));
      }
    },

    /**
     * When an in-page (url w/hash) link is clicked, focus the appropriate element
     */
    bindInPageLinks: function bindInPageLinks() {
      $('a[href*=#]').on('click', function (evt) {
        this.pageLinkFocus($(evt.currentTarget.hash));
      }.bind(this));
    },

    /**
     * Traps the focus in a particular container
     *
     * @param {object} options - Options to be used
     * @param {jQuery} options.$container - Container to trap focus within
     * @param {jQuery} options.$elementToFocus - Element to be focused when focus leaves container
     * @param {string} options.namespace - Namespace used for new focus event handler
     */
    trapFocus: function trapFocus(options) {
      var eventName = options.namespace ? 'focusin.' + options.namespace : 'focusin';

      if (!options.$elementToFocus) {
        options.$elementToFocus = options.$container;
      }

      options.$container.attr('tabindex', '-1');
      options.$elementToFocus.focus();
      $(document).on(eventName, function (evt) {
        if (options.$container[0] !== evt.target && !options.$container.has(evt.target).length) {
          options.$container.focus();
        }
      });
    },

    /**
     * Removes the trap of focus in a particular container
     *
     * @param {object} options - Options to be used
     * @param {jQuery} options.$container - Container to trap focus within
     * @param {string} options.namespace - Namespace used for new focus event handler
     */
    removeTrapFocus: function removeTrapFocus(options) {
      var eventName = options.namespace ? 'focusin.' + options.namespace : 'focusin';

      if (options.$container && options.$container.length) {
        options.$container.removeAttr('tabindex');
      }

      $(document).off(eventName);
    }
  };
  ;
  /**
   * Cart Template Script
   * ------------------------------------------------------------------------------
   * A file that contains scripts highly couple code to the Cart template.
   *
   * @namespace cart
   */

  slate.cart = {
    /**
     * Browser cookies are required to use the cart. This function checks if
     * cookies are enabled in the browser.
     */
    cookiesEnabled: function cookiesEnabled() {
      var cookieEnabled = navigator.cookieEnabled;

      if (!cookieEnabled) {
        document.cookie = 'testcookie';
        cookieEnabled = document.cookie.indexOf('testcookie') !== -1;
      }

      return cookieEnabled;
    }
  };
  ;
  /**
   * Utility helpers
   * -----------------------------------------------------------------------------
   * A collection of useful functions for dealing with arrays and objects
   *
   * @namespace utils
   */

  slate.utils = {
    /**
     * Return an object from an array of objects that matches the provided key and value
     *
     * @param {array} array - Array of objects
     * @param {string} key - Key to match the value against
     * @param {string} value - Value to get match of
     */
    findInstance: function findInstance(array, key, value) {
      for (var i = 0; i < array.length; i++) {
        if (array[i][key] === value) {
          return array[i];
        }
      }
    },

    /**
     * Remove an object from an array of objects by matching the provided key and value
     *
     * @param {array} array - Array of objects
     * @param {string} key - Key to match the value against
     * @param {string} value - Value to get match of
     */
    removeInstance: function removeInstance(array, key, value) {
      var i = array.length;

      while (i--) {
        if (array[i][key] === value) {
          array.splice(i, 1);
          break;
        }
      }

      return array;
    },

    /**
     * _.compact from lodash
     * Remove empty/false items from array
     * Source: https://github.com/lodash/lodash/blob/master/compact.js
     *
     * @param {array} array
     */
    compact: function compact(array) {
      var index = -1;
      var length = array == null ? 0 : array.length;
      var resIndex = 0;
      var result = [];

      while (++index < length) {
        var value = array[index];

        if (value) {
          result[resIndex++] = value;
        }
      }

      return result;
    },

    /**
     * _.defaultTo from lodash
     * Checks `value` to determine whether a default value should be returned in
     * its place. The `defaultValue` is returned if `value` is `NaN`, `null`,
     * or `undefined`.
     * Source: https://github.com/lodash/lodash/blob/master/defaultTo.js
     *
     * @param {*} value - Value to check
     * @param {*} defaultValue - Default value
     * @returns {*} - Returns the resolved value
     */
    defaultTo: function defaultTo(value, defaultValue) {
      return value == null || value !== value ? defaultValue : value;
    }
  };
  ;
  /**
   * Rich Text Editor
   * -----------------------------------------------------------------------------
   * Wrap iframes and tables in div tags to force responsive/scrollable layout.
   *
   * @namespace rte
   */

  slate.rte = {
    /**
     * Wrap tables in a container div to make them scrollable when needed
     *
     * @param {object} options - Options to be used
     * @param {jquery} options.$tables - jquery object(s) of the table(s) to wrap
     * @param {string} options.tableWrapperClass - table wrapper class name
     */
    wrapTable: function wrapTable(options) {
      var tableWrapperClass = typeof options.tableWrapperClass === "undefined" ? '' : options.tableWrapperClass;
      options.$tables.wrap('<div class="' + tableWrapperClass + '"></div>');
    },

    /**
     * Wrap iframes in a container div to make them responsive
     *
     * @param {object} options - Options to be used
     * @param {jquery} options.$iframes - jquery object(s) of the iframe(s) to wrap
     * @param {string} options.iframeWrapperClass - class name used on the wrapping div
     */
    wrapIframe: function wrapIframe(options) {
      var iframeWrapperClass = typeof options.iframeWrapperClass === "undefined" ? '' : options.iframeWrapperClass;
      options.$iframes.each(function () {
        // Add wrapper to make video responsive
        $(this).wrap('<div class="' + iframeWrapperClass + '"></div>'); // Re-set the src attribute on each iframe after page load
        // for Chrome's "incorrect iFrame content on 'back'" bug.
        // https://code.google.com/p/chromium/issues/detail?id=395791
        // Need to specifically target video and admin bar

        this.src = this.src;
      });
    }
  };
  ;
  /**
   * Image Helper Functions
   * -----------------------------------------------------------------------------
   * A collection of functions that help with basic image operations.
   *
   */

  slate.Image = function () {
    /**
     * Preloads an image in memory and uses the browsers cache to store it until needed.
     *
     * @param {Array} images - A list of image urls
     * @param {String} size - A shopify image size attribute
     */
    function preload(images, size) {
      if (typeof images === 'string') {
        images = [images];
      }

      for (var i = 0; i < images.length; i++) {
        var image = images[i];
        this.loadImage(this.getSizedImageUrl(image, size));
      }
    }
    /**
     * Loads and caches an image in the browsers cache.
     * @param {string} path - An image url
     */


    function loadImage(path) {
      new Image().src = path;
    }
    /**
     * Find the Shopify image attribute size
     *
     * @param {string} src
     * @returns {null}
     */


    function imageSize(src) {
      var match = src.match(/.+_((?:pico|icon|thumb|small|compact|medium|large|grande)|\d{1,4}x\d{0,4}|x\d{1,4})[_\.@]/);

      if (match) {
        return match[1];
      } else {
        return null;
      }
    }
    /**
     * Adds a Shopify size attribute to a URL
     *
     * @param src
     * @param size
     * @returns {*}
     */


    function getSizedImageUrl(src, size) {
      if (size === null) {
        return src;
      }

      if (size === 'master') {
        return this.removeProtocol(src);
      }

      var match = src.match(/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i);

      if (match) {
        var prefix = src.split(match[0]);
        var suffix = match[0];
        return this.removeProtocol(prefix[0] + '_' + size + suffix);
      } else {
        return null;
      }
    }

    function removeProtocol(path) {
      return path.replace(/http(s)?:/, '');
    }

    return {
      preload: preload,
      loadImage: loadImage,
      imageSize: imageSize,
      getSizedImageUrl: getSizedImageUrl,
      removeProtocol: removeProtocol
    };
  }();

  ;
  /**
   * Variant Selection scripts
   * ------------------------------------------------------------------------------
   *
   * Handles change events from the variant inputs in any `cart/add` forms that may
   * exist. Also updates the master select and triggers updates when the variants
   * price or image changes.
   *
   * @namespace variants
   */

  slate.Variants = function () {
    /**
     * Variant constructor
     *
     * @param {object} options - Settings from `product.js`
     */
    function Variants(options) {
      this.$container = options.$container;
      this.product = options.product;
      this.singleOptionSelector = options.singleOptionSelector;
      this.originalSelectorId = options.originalSelectorId;
      this.secondaryIdSelectors = options.secondaryIdSelectors;
      this.enableHistoryState = options.enableHistoryState;
      this.currentVariant = this._getVariantFromOptions();
      $(this.singleOptionSelector, this.$container).on('change', this._onSelectChange.bind(this));
    }

    Variants.prototype = $.extend({}, Variants.prototype, {
      /**
       * Get the currently selected options from add-to-cart form. Works with all
       * form input elements.
       *
       * @return {array} options - Values of currently selected variants
       */
      _getCurrentOptions: function _getCurrentOptions() {
        var currentOptions = $.map($(this.singleOptionSelector, this.$container), function (element) {
          var $element = $(element);
          var type = $element.attr('type');
          var currentOption = {};

          if (type === 'radio' || type === 'checkbox') {
            if ($element[0].checked) {
              currentOption.value = $element.val();
              currentOption.index = $element.data('index');
              return currentOption;
            } else {
              return false;
            }
          } else {
            currentOption.value = $element.val();
            currentOption.index = $element.data('index');
            return currentOption;
          }
        }); // remove any unchecked input values if using radio buttons or checkboxes

        currentOptions = slate.utils.compact(currentOptions);
        return currentOptions;
      },

      /**
       * Find variant based on selected values.
       *
       * @param  {array} selectedValues - Values of variant inputs
       * @return {object || undefined} found - Variant object from product.variants
       */
      _getVariantFromOptions: function _getVariantFromOptions() {
        var selectedValues = this._getCurrentOptions();

        var variants = this.product.variants;
        var found = false;
        variants.forEach(function (variant) {
          var satisfied = true;
          selectedValues.forEach(function (option) {
            if (satisfied) {
              satisfied = option.value === variant[option.index];
            }
          });

          if (satisfied) {
            found = variant;
          }
        });
        return found || null;
      },

      /**
       * Event handler for when a variant input changes.
       */
      _onSelectChange: function _onSelectChange() {
        var variant = this._getVariantFromOptions();

        this.$container.trigger({
          type: 'variantChange',
          variant: variant
        });

        if (!variant) {
          this._updateSecondarySelects(variant);

          return;
        }

        $(window).trigger('cc-variant-updated', {
          variant: variant,
          product: this.product
        });

        this._updateMasterSelect(variant);

        this._updateSecondarySelects(variant);

        this._updateImages(variant);

        this._updatePrice(variant);

        this.currentVariant = variant;

        if (this.enableHistoryState) {
          this._updateHistoryState(variant);
        }
      },

      /**
       * Trigger event when variant image changes
       *
       * @param  {object} variant - Currently selected variant
       * @return {event}  variantImageChange
       */
      _updateImages: function _updateImages(variant) {
        var variantMedia = variant.featured_media || {};
        var currentVariantMedia = this.currentVariant.featured_media || {};

        if (!variant.featured_media || variantMedia.id === currentVariantMedia.id) {
          return;
        }

        this.$container.trigger({
          type: 'variantImageChange',
          variant: variant
        });
      },

      /**
       * Trigger event when variant price changes.
       *
       * @param  {object} variant - Currently selected variant
       * @return {event} variantPriceChange
       */
      _updatePrice: function _updatePrice(variant) {
        var hasChanged = false;

        if (variant.price !== this.currentVariant.price || variant.compare_at_price !== this.currentVariant.compare_at_price || variant.unit_price_measurement !== this.currentVariant.unit_price_measurement || variant.unit_price_measurement && (variant.unit_price !== this.currentVariant.unit_price || variant.unit_price_measurement.reference_value !== this.currentVariant.unit_price_measurement.reference_value || variant.unit_price_measurement.reference_unit !== this.currentVariant.unit_price_measurement.reference_unit)) {
          hasChanged = true;
        }

        if (!hasChanged) {
          return;
        }

        this.$container.trigger({
          type: 'variantPriceChange',
          variant: variant
        });
      },

      /**
       * Update history state for product deeplinking
       *
       * @param {object} variant - Currently selected variant
       */
      _updateHistoryState: function _updateHistoryState(variant) {
        if (!history.replaceState || !variant) {
          return;
        }

        var newurl = window.location.protocol + '//' + window.location.host + window.location.pathname + '?variant=' + variant.id;
        window.history.replaceState({
          path: newurl
        }, '', newurl);
      },

      /**
       * Update hidden master select of variant change
       *
       * @param {object} variant - Currently selected variant
       */
      _updateMasterSelect: function _updateMasterSelect(variant) {
        var select = $(this.originalSelectorId, this.$container)[0];
        if (!select) return;
        select.value = variant.id;
        select.dispatchEvent(new Event('change', {
          bubbles: true,
          cancelable: false
        }));
      },

      /**
       * Update hidden secondary selects, e.g. Installments form
       *
       * @param {object} variant - Currently selected variant
       */
      _updateSecondarySelects: function _updateSecondarySelects(variant) {
        $(this.secondaryIdSelectors, this.$container).each(function () {
          this.value = variant ? variant.id : null;
          this.dispatchEvent(new Event('change', {
            bubbles: true,
            cancelable: false
          }));
        });
      }
    });
    return Variants;
  }();

  ;
  /*=============== Components ===============*/

  theme.storageAvailable = function (type) {
    try {
      var storage = window[type],
          x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    } catch (e) {
      return e instanceof DOMException && ( // everything except Firefox
      e.code === 22 || // Firefox
      e.code === 1014 || // test name field too, because code might not be present
      // everything except Firefox
      e.name === 'QuotaExceededError' || // Firefox
      e.name === 'NS_ERROR_DOM_QUOTA_REACHED') && // acknowledge QuotaExceededError only if there's something already stored
      storage.length !== 0;
    }
  };

  ;
  theme.variants = {
    selectors: {
      originalSelectorId: '[data-product-select]',
      secondaryIdSelectors: '[data-product-secondary-select]',
      priceWrapper: '[data-price-wrapper]',
      productPrice: '[data-product-price]',
      addToCart: '[data-add-to-cart]',
      addToCartText: '[data-add-to-cart-text]',
      comparePrice: '[data-compare-price]',
      comparePriceText: '[data-compare-text]',
      unitPrice: '.unit-price'
    },

    /**
     * Get the display unit for unit pricing
     */
    getBaseUnit: function getBaseUnit(variant) {
      return variant.unit_price_measurement.reference_value === 1 ? variant.unit_price_measurement.reference_unit : variant.unit_price_measurement.reference_value + variant.unit_price_measurement.reference_unit;
    },

    /**
     * Updates the DOM state of the add to cart button
     */
    updateAddToCartState: function updateAddToCartState(evt) {
      var variant = evt.variant;

      if (variant) {
        $(theme.variants.selectors.priceWrapper, this.$container).removeClass('hide');
      } else {
        $(theme.variants.selectors.addToCart, this.$container).prop('disabled', true);
        $(theme.variants.selectors.addToCartText, this.$container).html(theme.strings.unavailable);
        $(theme.variants.selectors.priceWrapper, this.$container).addClass('hide');
        return;
      }

      if (variant.available) {
        $(theme.variants.selectors.addToCart, this.$container).prop('disabled', false);
        $(theme.variants.selectors.addToCartText, this.$container).html(theme.strings.addToCart);
        $('form', this.$container).removeClass('variant--unavailable');
      } else {
        $(theme.variants.selectors.addToCart, this.$container).prop('disabled', true);
        $(theme.variants.selectors.addToCartText, this.$container).html(theme.strings.soldOut);
        $('form', this.$container).addClass('variant--unavailable');
      } // backorder


      var $backorderContainer = $('.backorder', this.$container);

      if ($backorderContainer.length) {
        if (variant && variant.available) {
          var $option = $(theme.variants.selectors.originalSelectorId + ' option[value="' + variant.id + '"]', this.$container);

          if (variant.inventory_management && $option.data('stock') == 'out') {
            $backorderContainer.find('.backorder__variant').html(this.productSingleObject.title + (variant.title.indexOf('Default') >= 0 ? '' : ' - ' + variant.title));
            $backorderContainer.show();
          } else {
            $backorderContainer.hide();
          }
        } else {
          $backorderContainer.hide();
        }
      }
    },

    /**
     * Updates the DOM with specified prices
     */
    updateProductPrices: function updateProductPrices(evt) {
      var variant = evt.variant;
      var $comparePrice = $(theme.variants.selectors.comparePrice, this.$container);
      var $compareEls = $comparePrice.add(theme.variants.selectors.comparePriceText, this.$container);
      var $price = $(theme.variants.selectors.productPrice, this.$container);
      var $unitPrice = $(theme.variants.selectors.unitPrice, this.$container);
      $price.html('<span class="theme-money large-title">' + theme.Shopify.formatMoney(variant.price, theme.moneyFormat) + '</span>');

      if (variant.compare_at_price > variant.price) {
        $price.addClass('product-price__reduced');
        $comparePrice.html('<span class="product-price__compare theme-money">' + theme.Shopify.formatMoney(variant.compare_at_price, theme.moneyFormat) + '</span>');
        $compareEls.removeClass('hide');
      } else {
        $price.removeClass('product-price__reduced');
        $comparePrice.html('');
        $compareEls.addClass('hide');
      }

      if (variant.unit_price_measurement) {
        var $newUnitPriceArea = $('<div class="unit-price small-text">');
        $('<span class="unit-price__price theme-money">').html(theme.Shopify.formatMoney(variant.unit_price, theme.moneyFormat)).appendTo($newUnitPriceArea);
        $('<span class="unit-price__separator">').html(theme.strings.unitPriceSeparator).appendTo($newUnitPriceArea);
        $('<span class="unit-price__unit">').html(theme.variants.getBaseUnit(variant)).appendTo($newUnitPriceArea);

        if ($unitPrice.length) {
          $unitPrice.replaceWith($newUnitPriceArea);
        } else {
          $(theme.variants.selectors.priceWrapper, this.$container).append($newUnitPriceArea);
        }
      } else {
        $unitPrice.remove();
      }
    }
  };
  ;

  theme.initAjaxAddToCartForm = function ($form_param) {
    $form_param.on('submit', function (evt) {
      evt.preventDefault();
      var $form = $(this); //Disable add button

      $form.addClass('add-in-progress').find(':submit').attr('disabled', 'disabled').each(function () {
        var contentFunc = $(this).is('button') ? 'html' : 'val';
        $(this).data('previous-value', $(this)[contentFunc]())[contentFunc](theme.strings.addingToCart);
      }); //Add to cart

      $.post(theme.routes.cart_add_url + '.js', $form.serialize(), function (itemData) {
        //Enable add button
        var $btn = $form.find(':submit').each(function () {
          var $btn = $(this);
          var contentFunc = $(this).is('button') ? 'html' : 'val'; //Set to 'DONE', alter button style, wait a few secs, revert to normal

          $btn[contentFunc](theme.strings.addedToCart);
          setTimeout(function () {
            $btn.removeAttr('disabled')[contentFunc]($btn.data('previous-value'));
            $form.removeClass('add-in-progress');
          }, 1000);
        }).first(); // reload header

        $.get(theme.routes.search_url, function (data) {
          var selectors = ['.page-header .header-cart', '.docked-navigation-container .header-cart'];
          var $parsed = $($.parseHTML('<div>' + data + '</div>'));

          for (var i = 0; i < selectors.length; i++) {
            var cartSummarySelector = selectors[i];
            var $newCartObj = $parsed.find(cartSummarySelector).clone();
            var $currCart = $(cartSummarySelector);
            $currCart.replaceWith($newCartObj);
          }
        }); // close quick-buy, if present

        $.colorbox.close(); // display added notice
        // get full product data

        theme.productData = theme.productData || {};

        if (!theme.productData[itemData.product_id]) {
          theme.productData[itemData.product_id] = JSON.parse(document.querySelector('.ProductJson-' + itemData.product_id).innerHTML);
        }

        var productVariant = null;

        for (var i = 0; i < theme.productData[itemData.product_id].variants.length; i++) {
          var variant = theme.productData[itemData.product_id].variants[i];

          if (variant.id == itemData.variant_id) {
            productVariant = variant;
          }
        }

        var productPrice = '';

        if (itemData.original_line_price > itemData.final_line_price) {
          productPrice += '<span class="cart-summary__price-reduced product-price__reduced theme-money">' + theme.Shopify.formatMoney(itemData.final_line_price, theme.moneyFormat) + '</span>';
          productPrice += '<span class="cart-summary__price-compare product-price__compare theme-money">' + theme.Shopify.formatMoney(itemData.original_line_price, theme.moneyFormat) + '</span>';
        } else {
          productPrice += '<span class="theme-money">' + theme.Shopify.formatMoney(itemData.final_line_price, theme.moneyFormat) + '</span>';
        }

        if (itemData.unit_price) {
          productPrice += '<span class="cart-summary__unit-price unit-price theme-money">' + theme.Shopify.formatMoney(itemData.unit_price, theme.moneyFormat) + theme.strings.unitPriceSeparator + itemData.unit_price_measurement.reference_unit + '</span>';
        } // append quantity


        var productQty = '';

        if (itemData.quantity > 1) {
          productQty = ' <span class="cart-summary__quantity">' + itemData.quantity + '</span>';
        }

        if (itemData.line_level_discount_allocations && itemData.line_level_discount_allocations.length > 0) {
          productPrice += '<ul class="cart-discount-list small-text">';

          for (var i = 0; i < itemData.line_level_discount_allocations.length; i++) {
            var discount_allocation = itemData.line_level_discount_allocations[i];
            productPrice += ['<li class="cart-discount">', '<div class="cart-discount__label">', discount_allocation.discount_application.title, '</div>', '<div class="cart-discount__amount theme-money">', theme.Shopify.formatMoney(discount_allocation.amount, theme.moneyFormat), '</div>', '</li>'].join('');
          }

          productPrice += '</ul>';
        }

        var sellingPlanHTML = '';

        if (itemData.selling_plan_allocation && itemData.selling_plan_allocation.selling_plan.name) {
          sellingPlanHTML = ['<div class="cart-summary__selling-plan ">', itemData.selling_plan_allocation.selling_plan.name, '</div>'].join('');
        }

        var productVariantsHTML = '';

        if (productVariant) {
          // get option names from full product data
          var optionNames = theme.productData[itemData.product_id].options;
          productVariantsHTML = '<div class="cart-summary__product__variants">';

          for (var i = 0; i < productVariant.options.length; i++) {
            if (productVariant.options[i].indexOf('Default Title') < 0) {
              productVariantsHTML += '<div class="cart-summary__variant">';
              productVariantsHTML += '<span class="cart-summary__variant-label">' + optionNames[i] + ':</span> ';
              productVariantsHTML += '<span class="cart-summary__variant-value">' + productVariant.options[i] + '</span>';
              productVariantsHTML += '</div>';
            }
          }

          productVariantsHTML += '</div>';
        }

        var productImage;

        if (productVariant.featured_media) {
          productImage = slate.Image.getSizedImageUrl(productVariant.featured_media.preview_image.src, '200x');
        } else if (theme.productData[itemData.product_id].media && theme.productData[itemData.product_id].media.length > 0) {
          productImage = slate.Image.getSizedImageUrl(theme.productData[itemData.product_id].media[0].preview_image.src, '200x');
        } // additional fetch - for full cart data


        $.getJSON(theme.routes.cart_url + '.js', function (cartData) {
          var $template = $(['<div class="added-notice global-border-radius added-notice--pre-reveal">', '<div class="added-notice__header">', '<span class="added-notice__title">', theme.strings.addedToCartPopupTitle, '</span>', '<a class="added-notice__close feather-icon" href="#" aria-label="', theme.strings.close, '">', theme.icons.close, '</a>', '</div>', '<div class="cart-summary global-border-radius">', '<div class="cart-summary__product">', '<div class="cart-summary__product-image"><img class="global-border-radius" src="', productImage, '" role="presentation" alt=""></div>', '<div class="cart-summary__product__description">', '<div class="cart-summary__product-title">', theme.productData[itemData.product_id].title, productQty, '</div>', productVariantsHTML, sellingPlanHTML, '<div class="cart-summary__price">', productPrice, '</div>', '</div>', '</div>', '</div>', '<div class="cart-summary__footer">', '<div class="cart-summary__total-quantity-row">', '<span>', theme.strings.addedToCartPopupItems, '</span>', '<span>', cartData.item_count, '</span>', '</div>', '<div class="cart-summary__total-price-row large-text">', '<span>', theme.strings.addedToCartPopupSubtotal, '</span>', '<span class="theme-money">', theme.Shopify.formatMoney(cartData.total_price, theme.moneyFormat), '</span>', '</div>', '<a href="', theme.routes.cart_url, '" class="btn btn--primary btn--small btn--fullwidth cart-summary__button">', theme.strings.addedToCartPopupGoToCart, '</a>', '</div>', '</div>'].join(''));
          $template.appendTo('body'); // transition in

          setTimeout(function () {
            $template.removeClass('added-notice--pre-reveal');
          }, 10); // transition out

          theme.addedToCartNoticeHideTimeoutId = setTimeout(function () {
            $template.find('.added-notice__close').trigger('click');
          }, 5000);
        });
      }, 'json').fail(function (data) {
        // Enable form
        $form.removeClass('add-in-progress');
        var $firstBtn = $form.find(':submit').removeAttr('disabled').each(function () {
          var $btn = $(this);
          var contentFunc = $btn.is('button') ? 'html' : 'val';
          $btn[contentFunc]($btn.data('previous-value'));
        }).first(); //Not added, show message

        if (typeof data != 'undefined' && data.responseJSON && data.responseJSON.description) {
          theme.showQuickPopup(data.responseJSON.description, $firstBtn);
        } else {
          //Some unknown error? Disable ajax and submit the old-fashioned way.
          $form.off('submit').submit();
        }
      });
    }); // global events - assign once

    $(document).off('.ajaxAddToCart');
    $(document).on('click.ajaxAddToCart', '.added-notice__close', function () {
      var $template = $(this).closest('.added-notice').addClass('added-notice--pre-destroy');
      setTimeout(function () {
        $template.remove();
      }, 500);
      return false;
    });
    $(document).on('mouseenter.ajaxAddToCart', '.header-cart', function () {
      clearTimeout(theme.addedToCartNoticeHideTimeoutId);
      $('.added-notice__close').trigger('click');
    });
  };

  theme.unloadAjaxAddToCartForm = function ($form) {
    $form.off('submit');
  }; // overlap avoidance


  $(function () {
    var overlapGutter = 10;
    var overlapGutterFuzzed = overlapGutter + 1;
    var GRAVITY_LEFT = 0,
        GRAVITY_CENTRE = 1,
        GRAVITY_RIGHT = 2;

    function oaElementToOriginalRectangle($el) {
      var t = {
        left: $el.offset().left - parseFloat($el.css('margin-left')),
        top: $el.offset().top - parseFloat($el.css('margin-top')),
        width: $el.outerWidth(),
        height: $el.outerHeight()
      };
      t.right = t.left + t.width;
      t.bottom = t.top + t.height;

      if ($el.hasClass('avoid-overlaps__item--gravity-left')) {
        t.gravity = GRAVITY_LEFT;
      } else if ($el.hasClass('avoid-overlaps__item--gravity-right')) {
        t.gravity = GRAVITY_RIGHT;
      } else {
        t.gravity = GRAVITY_CENTRE;
      }

      return t;
    }

    function oaSetOffsetFromCentre(item) {
      if (item.newRect.gravity == GRAVITY_LEFT) {// top left position already set by default
      } else if (item.newRect.gravity == GRAVITY_RIGHT) {
        item.newRect.right = item.newRect.left;
        item.newRect.left = item.newRect.right - item.newRect.width;
      } else {
        item.newRect.left = item.newRect.left - item.newRect.width / 2;
        item.newRect.right = item.newRect.left + item.newRect.width;
      }

      item.newRect.top = item.newRect.top - item.newRect.height / 2;
      item.newRect.bottom = item.newRect.top + item.newRect.height;
    }

    function oaRectIsInsideBoundary(rect, container) {
      return rect.left >= container.left + overlapGutter && rect.top >= container.top + overlapGutter && rect.right <= container.right - overlapGutter && rect.bottom <= container.bottom - overlapGutter;
    }

    function oaEnforceBoundaryConstraint(item, containerRect) {
      // left
      if (item.newRect.left < containerRect.left + overlapGutter) {
        item.newRect.left = containerRect.left + overlapGutterFuzzed;
        item.newRect.right = item.newRect.left + item.newRect.width;
      } // top


      if (item.newRect.top < containerRect.top + overlapGutter) {
        item.newRect.top = containerRect.top + overlapGutterFuzzed;
        item.newRect.bottom = item.newRect.top + item.newRect.height;
      } // right


      if (item.newRect.right > containerRect.right - overlapGutter) {
        item.newRect.right = containerRect.right - overlapGutterFuzzed;
        item.newRect.left = item.newRect.right - item.newRect.width;
      } // bottom


      if (item.newRect.bottom > containerRect.bottom - overlapGutter) {
        item.newRect.bottom = containerRect.bottom - overlapGutterFuzzed;
        item.newRect.top = item.newRect.bottom - item.newRect.height;
      }
    }

    function oaRectanglesOverlap(rect1, rect2) {
      return !(rect1.right < rect2.left || rect1.left > rect2.right || rect1.bottom < rect2.top || rect1.top > rect2.bottom);
    }

    function oaRectanglesOverlapWithGutter(rect1, rect2) {
      // increase rect1 size to fake gutter check
      return !(rect1.right + overlapGutter < rect2.left || rect1.left - overlapGutter > rect2.right || rect1.bottom + overlapGutter < rect2.top || rect1.top - overlapGutter > rect2.bottom);
    }

    function oaGetSortedVectorsToAttempt(rect1, rect2) {
      // 0 - top, 1 - right, 2 - bottom, 3 - left
      // compare mid-points
      var deltaX = rect2.left + (rect2.right - rect2.left) / 2 - (rect1.left + (rect1.right - rect1.left) / 2);
      var deltaY = rect2.top + (rect2.bottom - rect2.top) / 2 - (rect1.top + (rect1.bottom - rect1.top) / 2);

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
          return [1, 0, 2, 3];
        } else {
          return [3, 0, 2, 1];
        }
      } else {
        if (deltaY > 0) {
          return [2, 1, 3, 0];
        } else {
          return [0, 1, 3, 2];
        }
      }
    }

    function oaAttemptReposition(toMove, vector, movingAwayFrom, containerRect, allItems) {
      var newRect = $.extend({}, toMove.newRect);

      switch (vector) {
        case 0:
          // up
          newRect.bottom = movingAwayFrom.newRect.top - overlapGutterFuzzed;
          newRect.top = newRect.bottom - newRect.height;
          break;

        case 1:
          // right
          newRect.left = movingAwayFrom.newRect.right + overlapGutterFuzzed;
          newRect.right = newRect.left + newRect.width;
          break;

        case 2:
          // down
          newRect.top = movingAwayFrom.newRect.bottom + overlapGutterFuzzed;
          newRect.bottom = newRect.top + newRect.height;
          break;

        case 3:
          // left
          newRect.right = movingAwayFrom.newRect.left - overlapGutterFuzzed;
          newRect.left = newRect.right - newRect.width;
          break;
      } // check if new position is inside container


      var isInsideBoundary = oaRectIsInsideBoundary(newRect, containerRect); // check if new position overlaps any other elements

      var doesOverlap = false;

      for (var i = 0; i < allItems.length; i++) {
        var item = allItems[i];

        if (item.el[0] != toMove.el[0]) {
          // skip self
          if (oaRectanglesOverlap(newRect, item.newRect)) {
            doesOverlap = true;
          }
        }
      } // assign new position if deemed valid


      if (isInsideBoundary && !doesOverlap) {
        toMove.newRect = newRect;
        return true;
      }

      return false;
    }

    theme.checkOverlaps = function () {
      // every overlap-avoidance zone
      $('.avoid-overlaps').each(function () {
        var $container = $(this),
            $mobileContainer = $('.avoid-overlaps__mobile-container', this),
            containerRect = null;

        if ($mobileContainer.length && $mobileContainer.css('position') == 'relative') {
          containerRect = oaElementToOriginalRectangle($mobileContainer);
        } else {
          containerRect = oaElementToOriginalRectangle($container);
        } // all items that could overlap, in this zone


        var $candidates = $(this).find('.avoid-overlaps__item'); // create cached dimensions to work on

        var itemsToProcess = []; // all elements that can collide

        var itemsThatCanBeMoved = []; // e.g. labels, positioned overlay title

        var itemsThatCanBeMoveALot = []; // e.g. labels

        $candidates.each(function () {
          var item = {
            el: $(this),
            newRect: oaElementToOriginalRectangle($(this)),
            oldRect: oaElementToOriginalRectangle($(this)),
            overlaps: false
          }; // all items

          itemsToProcess.push(item); // items that can be moved freely

          if (!$(this).hasClass('overlay')) {
            itemsThatCanBeMoveALot.push(item);
          } // any items that can be moved


          if ($(this).css('position') == 'absolute' && !$(this).hasClass('overlay--bottom-wide') && !$(this).hasClass('overlay--low-wide')) {
            itemsThatCanBeMoved.push(item);
          }
        }); // for each moveable element

        for (var i = 0; i < itemsThatCanBeMoved.length; i++) {
          var candidate = itemsThatCanBeMoved[i]; // ensure it is positioned relative to centre

          oaSetOffsetFromCentre(candidate); // move inside container boundary

          oaEnforceBoundaryConstraint(candidate, containerRect);
        } // for every element, check if any freely moveable elements overlap it - and move if so


        for (var i = 0; i < itemsToProcess.length; i++) {
          var candidate = itemsToProcess[i];

          for (var j = 0; j < itemsThatCanBeMoveALot.length; j++) {
            var checking = itemsThatCanBeMoveALot[j];

            if (checking.el[0] != candidate.el[0]) {
              // skip self
              var vectorPreference = oaGetSortedVectorsToAttempt(candidate.newRect, checking.newRect);

              while (vectorPreference.length > 0 && oaRectanglesOverlapWithGutter(candidate.newRect, checking.newRect)) {
                var moved = oaAttemptReposition(checking, vectorPreference.shift(), candidate, containerRect, itemsToProcess);
                checking.overlaps = !moved;
              }
            }
          }
        } // set the new positions


        for (var j = 0; j < itemsToProcess.length; j++) {
          var item = itemsToProcess[j];
          var deltaX = item.newRect.left - item.oldRect.left;
          var deltaY = item.newRect.top - item.oldRect.top;
          item.el.css({
            marginLeft: deltaX != 0 ? deltaX : '',
            marginTop: deltaY != 0 ? deltaY : ''
          });
          item.el.toggleClass('is-overlapping', item.overlaps);
        }
      }).addClass('avoid-overlaps--processed');
    };

    theme.checkOverlaps();
    $(document).on('shopify:section:load', theme.checkOverlaps);
    $(window).on('debouncedresize', theme.checkOverlaps);
  });
  ;

  theme.assessLoadedRTEImage = function (el) {
    // container width
    var rteWidth = $(el).closest('.rte').width(); // check original width

    if ($(el)[0].naturalWidth > rteWidth) {
      // wider
      var para = $(el).parentsUntil('.rte').filter('p');

      if (para.length > 0) {
        para.addClass('expanded-width'); // inside a para already
      } else {
        $(el).wrap('<p class="expanded-width"></p>'); // put it inside a para
      }
    } else {
      // not wider
      $(el).closest('.expanded-width').removeClass('expanded-width');
    }
  }; // on image load


  theme.assessRTEImagesOnLoad = function (container) {
    $('.rte--expanded-images img:not(.exp-loaded)', container).each(function () {
      var originalImage = this;
      var img = new Image();
      $(img).on('load.rteExpandedImage', function () {
        $(originalImage).addClass('exp-loaded');
        theme.assessLoadedRTEImage(originalImage);
      });
      img.src = this.src;

      if (img.complete || img.readyState === 4) {
        // image is cached
        $(img).off('load.rteExpandedImage');
        $(originalImage).addClass('exp-loaded');
        theme.assessLoadedRTEImage(originalImage);
      }
    });
  }; // initialise all images


  theme.assessRTEImagesOnLoad(); // check any loaded images again on viewport resize

  $(window).on('debouncedresize', function () {
    $('.rte--expanded-images img.exp-loaded').each(function () {
      theme.assessLoadedRTEImage(this);
    });
  });
  ;
  theme.recentProductCacheExpiry = 1000 * 60 * 10; // 10 mins

  theme.recentProductHistoryCap = 12;
  theme.recentProductsStorageKey = 'theme.recent_products_v3'; // recentArr must be the full array of all recent products, as it is used to update the cache

  theme.addRecentProduct = function (recentArr, index, $container, showHover, showVendor) {
    var item = recentArr[index],
        _recentArr = recentArr,
        _showHover = showHover,
        _showVendor = showVendor,
        _$container = $container,
        $itemContainer = $('<div class="product-block product-block--recent-unloaded grid__item one-sixth medium--one-quarter small-down--one-whole">'); // check timestamp age

    var currentTimestamp = new Date().getTime();

    if (item.timestamp && item.timestamp > currentTimestamp - theme.recentProductCacheExpiry) {
      // display now
      $itemContainer.append(theme.buildRecentProduct(item, _showHover, _showVendor)).removeClass('product-block--recent-unloaded');
    } else {
      // get fresh data
      $.getJSON(item.url + '.js', function (data) {
        // update array with new data
        item.title = data.title;
        item.image = data.media && data.media.length ? data.media[0].preview_image.src : '';
        item.timestamp = currentTimestamp; // save updated recent products list

        window.localStorage.setItem(theme.recentProductsStorageKey, JSON.stringify(_recentArr)); // in slideshow?

        _$container.filter('.slick-initialized').slick('slickUnfilter'); // display


        $itemContainer.append(theme.buildRecentProduct(item, _showHover, _showVendor)).removeClass('product-block--recent-unloaded'); // in slideshow?

        _$container.filter('.slick-initialized').slick('slickFilter', ':not(.product-block--recent-unloaded)'); // ensure content product title line up


        theme.initUniformHeightMonitor(_$container, '.product-block__image-container', '.product-block__image-container .image-one');
      });
    }

    $container.append($itemContainer);
    theme.assessRecentProductGrid($container);
  };

  theme.assessRecentProductGrid = function ($container) {
    // add classes to hide all but 4 on tablet
    var $items = $container.children();
    var toHideOnTablet = Math.max($items.length - 4, 0);

    if (toHideOnTablet > 0) {
      $items.slice(0, 3).removeClass('medium--hide');

      for (var i = 0; i < toHideOnTablet; i++) {
        $($items[i]).addClass('medium--hide');
      }
    }
  };

  theme.onRecentProductImageLoad = function () {
    // realign product titles after grid update
    if (theme.settings.uniformProductGridImagesEnabled) {
      var $uhmContainer = $(this).closest('.uhm-active');

      if ($uhmContainer.length) {
        $uhmContainer.data('uhm-callback')();
      }
    }
  };

  theme.buildRecentProduct = function (item, showHover, showVendor) {
    var $item = $('<a class="recently-viewed-product plain-link">').attr({
      href: item.url,
      title: item.title
    });
    var $priceCont = $('<div class="product-price small-text">');

    if (item.priceVaries) {
      $('<span class="product-price__from tiny-text">').html(theme.strings.priceFrom).appendTo($priceCont);
      $priceCont.append(' ');
    }

    if (item.compareAtPrice > item.price) {
      $('<span class="product-price__reduced theme-money">').html(theme.Shopify.formatMoney(item.price, theme.moneyFormat)).appendTo($priceCont);
      $priceCont.append(' ');
      $('<span class="product-price__compare theme-money">').html(theme.Shopify.formatMoney(item.compareAtPrice, theme.moneyFormat)).appendTo($priceCont);
    } else {
      $('<span class="theme-money">').html(theme.Shopify.formatMoney(item.price, theme.moneyFormat)).appendTo($priceCont);
    }

    if (item.unitPrice) {
      var $newUnitPriceArea = $('<div class="unit-price tiny-text">');
      $('<span class="unit-price__price theme-money">').html(theme.Shopify.formatMoney(item.unitPrice, theme.moneyFormat)).appendTo($newUnitPriceArea);
      $('<span class="unit-price__separator">').html(theme.strings.unitPriceSeparator).appendTo($newUnitPriceArea);
      $('<span class="unit-price__unit">').html(item.unitPriceUnit).appendTo($newUnitPriceArea);
      $newUnitPriceArea.appendTo($priceCont);
    }

    var $imageContWrapper = $('<div class="product-block__image-container">').appendTo($item);
    var $imageCont = $('<div class="hover-images global-border-radius relative">').appendTo($imageContWrapper);

    if (item.image) {
      $('<div class="image-one">').append($('<img role="presentation">').on('load', theme.onRecentProductImageLoad).attr({
        src: item.image,
        alt: item.title
      })).appendTo($imageCont);
    }

    if (showHover && item.image2) {
      $imageCont.addClass('hover-images--two');
      $('<div class="image-two">').css('background-image', 'url(' + item.image2 + ')').appendTo($imageCont);
    }

    if (item.available === false) {
      if (theme.settings.soldLabelEnabled) {
        $('<span class="product-label product-label--sold-out global-border-radius"></span>').html(theme.strings.soldOut).appendTo($imageCont);
      }
    } else {
      if (theme.settings.saleLabelEnabled && item.compareAtPrice > item.price) {
        $('<span class="product-label product-label--on-sale global-border-radius"></span>').html(theme.strings.onSale).appendTo($imageCont);
      }
    }

    $('<div class="product-block__title small-text">').html(item.title).appendTo($item);

    if (showVendor) {
      $('<div class="product-block__vendor tiny-text">').html(item.vendor).appendTo($item);
    }

    $item.append($priceCont);
    return $item;
  };

  theme.getRecentProducts = function () {
    var existingValue = window.localStorage.getItem(theme.recentProductsStorageKey);

    if (existingValue) {
      try {
        return JSON.parse(existingValue);
      } catch (error) {}
    }

    return [];
  };

  theme.addToAndReturnRecentProducts = function (data) {
    var existingArr = theme.getRecentProducts(); // remove existing occurences

    var run = true;

    while (run) {
      run = false;

      for (var i = 0; i < existingArr.length; i++) {
        if (existingArr[i].handle == data.handle) {
          existingArr.splice(i, 1);
          run = true;
          break;
        }
      }
    } // add this onto the end


    data.timestamp = new Date().getTime();
    existingArr.push(data); // cap history

    while (existingArr.length > theme.recentProductHistoryCap) {
      existingArr.shift();
    } // save updated recent products list


    window.localStorage.setItem(theme.recentProductsStorageKey, JSON.stringify(existingArr));
    return existingArr;
  }; // init slideshow


  theme.loadRecentlyViewed = function ($container) {
    theme.peekCarousel.init($container, $('.grid', $container), '.recentlyViewed', function () {
      return $(window).width() < 768;
    }); // and filter out any lazy-loaded

    $('.grid', $container).filter('.slick-initialized').slick('slickFilter', ':not(.product-block--recent-unloaded)'); // ensure content product title line up

    theme.initUniformHeightMonitor($container, '.product-block__image-container', '.product-block__image-container .image-one');
  }; // unload slideshow


  theme.unloadRecentlyViewed = function ($container) {
    theme.destroyUniformHeightMonitor($container);
    theme.peekCarousel.destroy($container, $('.slick-initialized', $container), '.recentlyViewed');
  };

  ;
  /* Product Media
   *
   * Load and destroy:
   * theme.ProductMedia.init(galleryContainer, {
   *   onModelViewerPlay: function(e){
   *     $(e.target).closest('.slick-slider').slick('slickSetOption', 'swipe', false);
   *   },
   *   onModelViewerPause: function(e){
   *     $(e.target).closest('.slick-slider').slick('slickSetOption', 'swipe', true);
   *   },
   *   onPlyrPlay: function(e){
   *     $(e.target).closest('.slick-slider').slick('slickSetOption', 'swipe', false);
   *   },
   *   onPlyrPause: function(e){
   *     $(e.target).closest('.slick-slider').slick('slickSetOption', 'swipe', true);
   *   },
   * });
   *
   * theme.ProductMedia.destroy(galleryContainer);
   *
   * Trigger mediaVisible and mediaHidden events based on UI
   * $slickSlideshow.on('afterChange', function(evt, slick, current){
   *   $('.product-media--activated').removeClass('product-media--activated').trigger('mediaHidden');
   *   $('.product-media', slick.$slides[current]).addClass('product-media--activated').trigger('mediaVisible');
   * });
   */

  theme.ProductMedia = new function () {
    var _ = this;

    _._setupShopifyXr = function () {
      if (!window.ShopifyXR) {
        document.addEventListener('shopify_xr_initialized', _._setupShopifyXr.bind(this));
        return;
      }

      window.ShopifyXR.addModels(JSON.parse($(this).html()));
      window.ShopifyXR.setupXRElements();
    };

    this.init = function (container, callbacks) {
      var callbacks = callbacks || {},
          _container = container; // when any media appears

      $(container).on('mediaVisible', '.product-media--video-loaded, .product-media--model-loaded', function () {
        // autoplay all media on larger screens
        if ($(window).width() >= 768) {
          $(this).data('player').play();
        } // update view-in-space


        if ($(this).hasClass('product-media--model')) {
          $('.view-in-space', _container).attr('data-shopify-model3d-id', $(this).data('model-id'));
        }
      }); // when any media is hidden

      $(container).on('mediaHidden', '.product-media--video-loaded, .product-media--model-loaded', function () {
        // pause all media
        $(this).data('player').pause();
      }); // necessary callbacks

      if (callbacks.onVideoVisible) {
        $(container).on('mediaVisible', '.product-media--video-loaded', callbacks.onVideoVisible);
      }

      if (callbacks.onVideoHidden) {
        $(container).on('mediaHidden', '.product-media--video-loaded', callbacks.onVideoHidden);
      }

      $('model-viewer', container).each(function () {
        if (callbacks.onModelViewerPlay) {
          $(this).on('shopify_model_viewer_ui_toggle_play', callbacks.onModelViewerPlay);
        }

        if (callbacks.onModelViewerPause) {
          $(this).on('shopify_model_viewer_ui_toggle_pause', callbacks.onModelViewerPause);
        }
      }); // set up video media elements with a controller

      $(container).find('.product-media--video').each(function (index) {
        var enableLooping = $(this).data('enable-video-looping'),
            element = $(this).find('iframe, video')[0],
            $currentMedia = $(this);

        if (element.tagName === 'VIDEO') {
          // set up a controller for Plyr video
          window.Shopify.loadFeatures([{
            name: 'video-ui',
            version: '1.0',
            onLoad: function () {
              var playerObj = {
                playerType: 'html5',
                element: element
              };

              playerObj.play = function () {
                this.plyr.play();
              }.bind(playerObj);

              playerObj.pause = function () {
                this.plyr.pause();
              }.bind(playerObj);

              playerObj.destroy = function () {
                this.plyr.destroy();
              }.bind(playerObj);

              playerObj.plyr = new Shopify.Plyr(element, {
                controls: ['play', 'progress', 'mute', 'volume', 'play-large', 'fullscreen'],
                loop: {
                  active: enableLooping
                },
                hideControlsOnPause: true,
                iconUrl: '//cdn.shopify.com/shopifycloud/shopify-plyr/v1.0/shopify-plyr.svg',
                tooltips: {
                  controls: false,
                  seek: true
                }
              });
              $(this).data('player', playerObj).addClass('product-media--video-loaded'); // callbacks for Plyr playback

              $(element).on('playing', function () {
                // pause other media
                $('.product-media').not($currentMedia).trigger('mediaHidden'); // when playing, intercept events going through controls:
                // - prevent bubbling of mouse/touch start, for carousel gestures
                // - prevent bubbling of keydown, for carousel navigation

                $currentMedia.find('.plyr__controls').off('.themeMediaEventFix').on('keydown.themeMediaEventFix touchstart.themeMediaEventFix mousedown.themeMediaEventFix keydown.themeMediaEventFix', function (e) {
                  e.stopPropagation();
                });

                if (callbacks.onPlyrPlay) {
                  callbacks.onPlyrPlay(playerObj);
                }
              });
              $(element).on('pause ended', function () {
                // remove event bubbling interceptor
                $currentMedia.find('.plyr__controls').off('.themeMediaEventFix');

                if (callbacks.onPlyrPause) {
                  callbacks.onPlyrPause(playerObj);
                }
              });

              if (callbacks.onPlyrInit) {
                callbacks.onPlyrInit(playerObj);
              }
            }.bind(this)
          }]);
          theme.loadStyleOnce('https://cdn.shopify.com/shopifycloud/shopify-plyr/v1.0/shopify-plyr.css');
        } else if (element.tagName === 'IFRAME') {
          if (/^(https?:\/\/)?(www\.)?(youtube\.com|youtube-nocookie\.com|youtu\.?be)\/.+$/.test(element.src)) {
            // set up a controller for YouTube video
            var existingYTCB = window.onYouTubeIframeAPIReady;

            var loadYoutubeVideo = function () {
              var playerObj = {
                playerType: 'youtube',
                element: element
              };
              var videoId = $(this).data('video-id');
              playerObj.player = new YT.Player(element, {
                videoId: videoId,
                events: {
                  onStateChange: function onStateChange(event) {
                    if (event.data === YT.PlayerState.ENDED && enableLooping) {
                      event.target.seekTo(0);
                    }

                    if (event.data === YT.PlayerState.PLAYING) {
                      $('.product-media').not($currentMedia).trigger('mediaHidden');

                      if (callbacks.onYouTubePlay) {
                        callbacks.onYouTubePlay(playerObj);
                      }
                    }

                    if (event.data === YT.PlayerState.PAUSED && event.data === YT.PlayerState.ENDED) {
                      if (callbacks.onYouTubePause) {
                        callbacks.onYouTubePause(playerObj);
                      }
                    }
                  }
                }
              });

              playerObj.play = function () {
                this.player.playVideo();
              }.bind(playerObj);

              playerObj.pause = function () {
                this.player.pauseVideo();
              }.bind(playerObj);

              playerObj.destroy = function () {
                this.player.destroy();
              }.bind(playerObj);

              $(this).data('player', playerObj).addClass('product-media--video-loaded');

              if (callbacks.onYouTubeInit) {
                callbacks.onYouTubeInit(playerObj);
              }
            }.bind(this);

            if (window.YT && window.YT.Player) {
              loadYoutubeVideo();
            } else {
              window.onYouTubeIframeAPIReady = function () {
                if (existingYTCB) {
                  existingYTCB();
                }

                loadYoutubeVideo();
              };

              theme.loadScriptOnce('https://www.youtube.com/iframe_api');
            }
          }
        }
      }); // set up a 3d model when it first appears

      $(container).on('mediaVisible mediaVisibleInitial', '.product-media--model:not(.product-media--model-loaded):not(.product-media--model-loading)', function (e) {
        var element = $(this).find('model-viewer')[0],
            $currentMedia = $(this),
            autoplay = e.type != 'mediaVisibleInitial'; // do not run this twice

        $(this).addClass('product-media--model-loading'); // load viewer

        theme.loadStyleOnce('https://cdn.shopify.com/shopifycloud/model-viewer-ui/assets/v1.0/model-viewer-ui.css');
        window.Shopify.loadFeatures([{
          name: 'model-viewer-ui',
          version: '1.0',
          onLoad: function () {
            $(this).data('player', new Shopify.ModelViewerUI(element)); // insert mouseup event proxy, to allow mouseup to bubble up outside model viewer ui when player is paused, for carousel swipe gestures

            $('<div class="theme-event-proxy">').on('mouseup', function (e) {
              e.stopPropagation();
              e.preventDefault();
              var newEventTarget = $(e.currentTarget).closest('.product-media')[0];
              newEventTarget.dispatchEvent(new MouseEvent('mouseup', {
                bubbles: true
              }));
            }).appendTo($(this).find('.shopify-model-viewer-ui__controls-overlay')); // when playing or loading, intercept events that bubble up outside the viewer:
            // - prevent bubbling of mouse/touch start, for carousel gestures
            // - prevent bubbling of keydown, for carousel navigation

            $(this).find('model-viewer').on('shopify_model_viewer_ui_toggle_play', function () {
              $(this).closest('.product-media').on('touchstart.themeModelViewerFix mousedown.themeModelViewerFix keydown.themeModelViewerFix', function (e) {
                e.stopPropagation();
              });
            }).on('shopify_model_viewer_ui_toggle_pause', function () {
              $(this).closest('.shopify-model-viewer-ui').off('.themeMediaEventFix');
            }); // ensure play exclusivity

            $(this).find('model-viewer').on('shopify_model_viewer_ui_toggle_play', function () {
              $('.product-media').not($currentMedia).trigger('mediaHidden');
            }); // set class and re-trigger visible event now loaded

            $(this).addClass('product-media--model-loaded').removeClass('product-media--model-loading');

            if (callbacks.onModelViewerInit) {
              callbacks.onModelViewerInit(element);
            }

            if (autoplay) {
              $(this).trigger('mediaVisible');
            }
          }.bind(this)
        }]);
      }); // load AR viewer

      if ($('.model-json', container).length) {
        window.Shopify.loadFeatures([{
          name: 'shopify-xr',
          version: '1.0',
          onLoad: _._setupShopifyXr.bind($('.model-json', container))
        }]); // pause video when a 3d model is launched in AR

        $(document).on('shopify_xr_launch', function () {
          $('.product-media--video-loaded').each(function () {
            $(this).data('player').pause();
          });
        });
      } // 3d model in first place - start in paused mode


      setTimeout(function () {
        $('.product-media:first', this).filter('.product-media--model').trigger('mediaVisibleInitial');
      }.bind(container), 50);
    };

    this.destroy = function (container) {
      $(document).off('shopify_xr_launch');
      $(container).off('mediaVisible mediaVisibleInitial mediaHidden');
      $('.product-media--video-loaded, .product-media--model-loaded', container).each(function () {
        $(this).data('player').destroy();
      });
      $('.product-media--video video', container).off('playing pause ended');
      $('model-viewer', container).off('shopify_model_viewer_ui_toggle_play shopify_model_viewer_ui_toggle_pause');
    };
  }();

  var PriceRangeInstance = /*#__PURE__*/function () {
    "use strict";

    function PriceRangeInstance(container) {
      var _this13 = this;

      _classCallCheck(this, PriceRangeInstance);

      this.container = container;
      this.selectors = {
        inputMin: '.cc-price-range__input--min',
        inputMax: '.cc-price-range__input--max',
        control: '.cc-price-range__control',
        controlMin: '.cc-price-range__control--min',
        controlMax: '.cc-price-range__control--max',
        bar: '.cc-price-range__bar',
        activeBar: '.cc-price-range__bar-active'
      };
      this.controls = {
        min: {
          barControl: container.querySelector(this.selectors.controlMin),
          input: container.querySelector(this.selectors.inputMin)
        },
        max: {
          barControl: container.querySelector(this.selectors.controlMax),
          input: container.querySelector(this.selectors.inputMax)
        }
      };
      this.controls.min.value = parseInt(this.controls.min.input.value === '' ? this.controls.min.input.placeholder : this.controls.min.input.value);
      this.controls.max.value = parseInt(this.controls.max.input.value === '' ? this.controls.max.input.placeholder : this.controls.max.input.value);
      this.valueMin = this.controls.min.input.min;
      this.valueMax = this.controls.min.input.max;
      this.valueRange = this.valueMax - this.valueMin;
      [this.controls.min, this.controls.max].forEach(function (item) {
        item.barControl.setAttribute('aria-valuemin', _this13.valueMin);
        item.barControl.setAttribute('aria-valuemax', _this13.valueMax);
      });
      this.controls.min.barControl.setAttribute('aria-valuenow', this.controls.min.value);
      this.controls.max.barControl.setAttribute('aria-valuenow', this.controls.max.value);
      this.bar = container.querySelector(this.selectors.bar);
      this.activeBar = container.querySelector(this.selectors.activeBar);
      this.inDrag = false;
      this.bindEvents();
      this.render();
    }

    _createClass(PriceRangeInstance, [{
      key: "getPxToValueRatio",
      value: function getPxToValueRatio() {
        return this.bar.clientWidth / (this.valueMax - this.valueMin);
      }
    }, {
      key: "getPcToValueRatio",
      value: function getPcToValueRatio() {
        return 100.0 / (this.valueMax - this.valueMin);
      }
    }, {
      key: "setActiveControlValue",
      value: function setActiveControlValue(value, reset) {
        // Clamp & default
        if (this.activeControl === this.controls.min) {
          if (value === '') {
            value = this.valueMin;
          }

          value = Math.max(this.valueMin, value);
          value = Math.min(value, this.controls.max.value);
        } else {
          if (value === '') {
            value = this.valueMax;
          }

          value = Math.min(this.valueMax, value);
          value = Math.max(value, this.controls.min.value);
        } // Round


        this.activeControl.value = Math.round(value); // Update input

        if (this.activeControl.input.value != this.activeControl.value) {
          if (this.activeControl.value == this.activeControl.input.placeholder) {
            this.activeControl.input.value = '';
          } else {
            this.activeControl.input.value = this.activeControl.value;
          }

          if (!reset) {
            this.activeControl.input.dispatchEvent(new CustomEvent('change', {
              bubbles: true,
              detail: {
                sender: 'theme:component:price_range'
              }
            }));
          }
        } // A11y


        this.activeControl.barControl.setAttribute('aria-valuenow', this.activeControl.value);
      }
    }, {
      key: "render",
      value: function render() {
        this.drawControl(this.controls.min);
        this.drawControl(this.controls.max);
        this.drawActiveBar();
      }
    }, {
      key: "drawControl",
      value: function drawControl(control) {
        control.barControl.style.left = "".concat((control.value - this.valueMin) * this.getPcToValueRatio(), "%");
      }
    }, {
      key: "drawActiveBar",
      value: function drawActiveBar() {
        this.activeBar.style.left = "".concat((this.controls.min.value - this.valueMin) * this.getPcToValueRatio(), "%");
        this.activeBar.style.right = "".concat((this.valueMax - this.controls.max.value) * this.getPcToValueRatio(), "%");
      }
    }, {
      key: "handleControlTouchStart",
      value: function handleControlTouchStart(e) {
        e.preventDefault();
        this.startDrag(e.target, e.touches[0].clientX);
        this.boundControlTouchMoveEvent = this.handleControlTouchMove.bind(this);
        this.boundControlTouchEndEvent = this.handleControlTouchEnd.bind(this);
        window.addEventListener('touchmove', this.boundControlTouchMoveEvent);
        window.addEventListener('touchend', this.boundControlTouchEndEvent);
      }
    }, {
      key: "handleControlTouchMove",
      value: function handleControlTouchMove(e) {
        this.moveDrag(e.touches[0].clientX);
      }
    }, {
      key: "handleControlTouchEnd",
      value: function handleControlTouchEnd(e) {
        e.preventDefault();
        window.removeEventListener('touchmove', this.boundControlTouchMoveEvent);
        window.removeEventListener('touchend', this.boundControlTouchEndEvent);
        this.stopDrag();
      }
    }, {
      key: "handleControlMouseDown",
      value: function handleControlMouseDown(e) {
        e.preventDefault();
        this.startDrag(e.target, e.clientX);
        this.boundControlMouseMoveEvent = this.handleControlMouseMove.bind(this);
        this.boundControlMouseUpEvent = this.handleControlMouseUp.bind(this);
        window.addEventListener('mousemove', this.boundControlMouseMoveEvent);
        window.addEventListener('mouseup', this.boundControlMouseUpEvent);
      }
    }, {
      key: "handleControlMouseMove",
      value: function handleControlMouseMove(e) {
        this.moveDrag(e.clientX);
      }
    }, {
      key: "handleControlMouseUp",
      value: function handleControlMouseUp(e) {
        e.preventDefault();
        window.removeEventListener('mousemove', this.boundControlMouseMoveEvent);
        window.removeEventListener('mouseup', this.boundControlMouseUpEvent);
        this.stopDrag();
      }
    }, {
      key: "startDrag",
      value: function startDrag(target, startX) {
        this.activeControl = this.controls.min.barControl === target ? this.controls.min : this.controls.max;
        this.dragStartX = startX;
        this.dragStartValue = this.activeControl.value;
        this.inDrag = true;
      }
    }, {
      key: "moveDrag",
      value: function moveDrag(moveX) {
        if (this.inDrag) {
          var value = this.dragStartValue + (moveX - this.dragStartX) / this.getPxToValueRatio();
          this.setActiveControlValue(value);
          this.render();
        }
      }
    }, {
      key: "stopDrag",
      value: function stopDrag() {
        this.inDrag = false;
      }
    }, {
      key: "handleInputChange",
      value: function handleInputChange(e) {
        if (e.target.tagName !== 'INPUT') return;

        if (!e.detail || e.detail.sender !== 'theme:component:price_range') {
          var reset = e.detail && e.detail.sender === 'reset';
          this.activeControl = this.controls.min.input === e.target ? this.controls.min : this.controls.max;
          this.setActiveControlValue(e.target.value, reset);
          this.render();
        }
      }
    }, {
      key: "bindEvents",
      value: function bindEvents() {
        var _this14 = this;

        [this.controls.min, this.controls.max].forEach(function (item) {
          item.barControl.addEventListener('touchstart', _this14.handleControlTouchStart.bind(_this14));
          item.barControl.addEventListener('mousedown', _this14.handleControlMouseDown.bind(_this14));
        });
        this.container.addEventListener('change', this.handleInputChange.bind(this));
      }
    }, {
      key: "destroy",
      value: function destroy() {}
    }]);

    return PriceRangeInstance;
  }();

  var PriceRange = /*#__PURE__*/function (_ccComponent2) {
    "use strict";

    _inherits(PriceRange, _ccComponent2);

    var _super2 = _createSuper(PriceRange);

    function PriceRange() {
      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'price-range';
      var cssSelector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ".cc-".concat(name);

      _classCallCheck(this, PriceRange);

      return _super2.call(this, name, cssSelector);
    }

    _createClass(PriceRange, [{
      key: "init",
      value: function init(container) {
        _get(_getPrototypeOf(PriceRange.prototype), "init", this).call(this, container);

        this.registerInstance(container, new PriceRangeInstance(container));
      }
    }, {
      key: "destroy",
      value: function destroy(container) {
        this.destroyInstance(container);

        _get(_getPrototypeOf(PriceRange.prototype), "destroy", this).call(this, container);
      }
    }]);

    return PriceRange;
  }(ccComponent);

  new PriceRange();
  ;
  /*================ Sections ================*/

  /**
   * Header Section Script
   * ------------------------------------------------------------------------------
   *
   * @namespace header
   */

  theme.Header = new function () {
    /**
     * Header section constructor. Runs on page load as well as Theme Editor
     * `section:load` events.
     * @param {string} container - selector for the section container DOM element
     */
    this.onSectionLoad = function (container) {
      this.$container = $(container);
      this.namespace = theme.namespaceFromSection(container);
      this.$nav = $('.site-nav', container);
      this.$navLinks = this.$nav.children('.site-nav__item:not(.site-nav__more-links)');
      this.$navMoreLinksLink = $('.site-nav__more-links', this.$nav);
      this.$navMoreLinksContainer = $('.small-dropdown__container', this.$navMoreLinksLink);
      this.$navMoreLinksSubmenuContainer = $('.site-nav__more-links .more-links__dropdown-container', this.$nav);
      this.search = {
        ongoingRequest: null,
        ongoingTimeoutId: -1,
        throttleMs: 500,
        searchUrlKey: 'searchUrl',
        resultsSelector: '.search-bar__results',
        resultsLoadingClass: 'search-bar--loading-results',
        resultsLoadedClass: 'search-bar--has-results',
        loadingMessage: theme.strings.searchLoading,
        moreResultsMessage: theme.strings.searchMoreResults,
        emptyMessage: theme.strings.searchNoResults
      };
      var breakpoint = 767;
      $(this.$container).on('click' + this.namespace, '.js-search-form-open', this.functions.searchFormOpen.bind(this));
      $(this.$container).on('click' + this.namespace, '.js-search-form-focus', this.functions.searchFormFocus.bind(this));
      $(this.$container).on('click' + this.namespace, '.js-search-form-close', this.functions.searchFormClose.bind(this));
      $(this.$container).on('click' + this.namespace, '.js-mobile-menu-icon', this.functions.mobileMenuOpen.bind(this));
      $(this.$container).on('click' + this.namespace, '.js-close-mobile-menu', this.functions.mobileMenuClose.bind(this));
      $(this.$container).on('focusin' + this.namespace, '.search-bar', this.functions.searchFocusIn.bind(this));
      $(this.$container).on('focusout' + this.namespace, '.search-bar', this.functions.searchFocusOut.bind(this));

      if ($('.search-bar.live-search', this.$container).length) {
        $(this.$container).on('keyup' + this.namespace + ' change' + this.namespace, '.search-bar.live-search input[name="q"]', this.functions.updateSearchResults.bind(this));
      } // make hidden search fields un-tabbable


      this.functions.setSearchTabbing.bind(this)();
      $('.focus-tint').on('click' + this.namespace, this.functions.onFocusTintClick.bind(this));
      $('body').toggleClass('header-has-messages', this.$container.find('.store-messages-bar').length > 0);
      /**
       * Header messages bar carousel
       */

      $('.js-messages-slider', this.$container).slick({
        infinite: true,
        autoplay: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        prevArrow: false,
        nextArrow: false
      });
      /**
      * Breakpoint to unslick above 767px
      */

      $('.js-mobile-messages-slider', this.$container).slick({
        infinite: true,
        autoplay: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        mobileFirst: true,
        prevArrow: false,
        nextArrow: false,
        responsive: [{
          breakpoint: breakpoint,
          settings: 'unslick'
        }]
      });
      /**
      * Reset the messages slider to use slick when screen size decreased to =< 767px
      */

      $(window).on('debouncedresize' + this.namespace, function (e) {
        $('.js-mobile-messages-slider', this.$container).slick('resize');
      });
      /**
       * Open/close mobile nested menus
       */

      $(this.$container).on('click' + this.namespace, '.mobile-site-nav__icon, .mobile-site-nav__link[href="#"]', function (e) {
        e.preventDefault();
        $(this).siblings('.mobile-site-nav__menu').slideToggle(250);
        $(this).toggleClass('submenu-open');
      });
      /**
      * Open login in lightbox
      */

      $(this.$container).on('click' + this.namespace, '.customer-account .customer-login', this.functions.loginOpen.bind(this));
      $(this.$container).on('click' + this.namespace, '.customer-account .customer-register', this.functions.registerOpen.bind(this)); // Docked nav

      if (this.$container.hasClass('docking-header')) {
        this.desktopHeaderWasDocked = false;
        this.$dockedDesktopContentsContainer = $('.docked-navigation-container__inner', container);
        this.$dockedDesktopBaseContainer = $('.docked-navigation-container', container);
        this.mobileHeaderWasDocked = false;
        this.$dockedMobileContentsContainer = $('.docked-mobile-navigation-container__inner', container);
        this.$dockedMobileBaseContainer = $('.docked-mobile-navigation-container', container); // check now

        $(this.functions.dockedNavCheck.call(this));
        $(window).on('scroll' + this.namespace, this.functions.dockedNavCheck.bind(this));
        $(window).on('debouncedresize' + this.namespace, this.functions.dockedNavCheck.bind(this)); // add style for docked nav

        $('<style id="themeDockedNavStyle">').appendTo('head');
        $(this.functions.updateDockedNavHeightStyle.call(this));
        $(window).on('debouncedresize' + this.namespace, this.functions.updateDockedNavHeightStyle.bind(this));
      } // Keep menu in one row


      $(this.functions.menuLinkVisibilityCheck.call(this));
      $(window).on('debouncedresize' + this.namespace, this.functions.menuLinkVisibilityCheck.bind(this)); // Display of overflow menu

      $(this.$container).on('mouseenter' + this.namespace, '.more-links--with-dropdown .site-nav__item', this.functions.onMoreLinksSubMenuActive.bind(this)); // nav enhancements

      this.navHoverDelay = 250;
      this.$navLastOpenDropdown = $();
      $(this.$container).on('mouseenter' + this.namespace + ' mouseleave' + this.namespace, '.site-nav__item--has-dropdown', function (evt) {
        var $dropdownContainer = $(evt.currentTarget); // delay on hover-out

        if (evt.type == 'mouseenter') {
          clearTimeout(this.navOpenTimeoutId);
          clearTimeout($dropdownContainer.data('navCloseTimeoutId'));
          var $openSiblings = $dropdownContainer.siblings('.open'); // close all menus but last opened

          $openSiblings.not(this.$navLastOpenDropdown).removeClass('open');
          this.$navLastOpenDropdown = $dropdownContainer; // show after a delay, based on first-open or not

          var timeoutDelay = $openSiblings.length == 0 ? 0 : this.navHoverDelay; // open it

          var navOpenTimeoutId = setTimeout(function () {
            $dropdownContainer.addClass('open').siblings('.open').removeClass('open');
            var $dropdown = $dropdownContainer.children('.small-dropdown:not(.more-links-dropdown)');

            if ($dropdown.length && $dropdownContainer.parent().hasClass('site-nav')) {
              var right = $dropdownContainer.offset().left + $dropdown.outerWidth();
              var transform = '',
                  cw = this.$container.outerWidth() - 10;

              if (right > cw) {
                transform = 'translateX(' + (cw - right) + 'px)';
              }

              $dropdown.css('transform', transform);
            }
          }.bind(this), timeoutDelay);
          this.navOpenTimeoutId = navOpenTimeoutId;
          $dropdownContainer.data('navOpenTimeoutId', navOpenTimeoutId);
        } else {
          // cancel opening, and close after delay
          clearTimeout($dropdownContainer.data('navOpenTimeoutId'));
          $dropdownContainer.data('navCloseTimeoutId', setTimeout(function () {
            $dropdownContainer.removeClass('open').children('.small-dropdown:not(.more-links-dropdown)').css('transform', '');
          }, this.navHoverDelay));
        } // a11y


        $dropdownContainer.children('[aria-expanded]').attr('aria-expanded', evt.type == 'mouseenter');
      }.bind(this)); // keyboard nav

      $(this.$container).on('keydown' + this.namespace, '.site-nav__item--has-dropdown > .site-nav__link', this.functions.dropdownLinkKeyPress.bind(this)); // touch events

      $(this.$container).on('touchstart' + this.namespace + ' touchend' + this.namespace + ' click' + this.namespace, '.site-nav__item--has-dropdown > .site-nav__link', function (evt) {
        if (evt.type == 'touchstart') {
          $(this).data('touchstartedAt', evt.timeStamp);
        } else if (evt.type == 'touchend') {
          // down & up in under a second - presume tap
          if (evt.timeStamp - $(this).data('touchstartedAt') < 1000) {
            $(this).data('touchOpenTriggeredAt', evt.timeStamp);

            if ($(this).parent().hasClass('open')) {
              // trigger close
              $(this).parent().trigger('mouseleave');
            } else {
              // trigger close on any open items
              $('.site-nav__item.open').trigger('mouseleave'); // trigger open

              $(this).parent().trigger('mouseenter');
            } // prevent fake click


            return false;
          }
        } else if (evt.type == 'click') {
          // if touch open was triggered very recently, prevent click event
          if ($(this).data('touchOpenTriggeredAt') && evt.timeStamp - $(this).data('touchOpenTriggeredAt') < 1000) {
            return false;
          }
        }
      }); // account link dropdown

      $(this.$container).on('touchstart' + this.namespace, '.customer-account__parent-link', function () {
        // indicate we are using touch - to disable hover and prevent iOS issues
        $(this).closest('.customer-account').addClass('customer-account--using-touch');
      });
      $(this.$container).on('click' + this.namespace, '.customer-account__parent-link', this.functions.onAccountIconClick.bind(this)); // localization

      $('.disclosure', this.$container).each(function () {
        $(this).data('disclosure', new theme.Disclosure($(this)));
      });
    };

    this.functions = {
      /**
       * Click account icon - do nothing special on mobile, toggle dropdown otherwise
       */
      onAccountIconClick: function onAccountIconClick(evt) {
        if ($(window).width() >= 768) {
          evt.preventDefault();
          var isOpen = $(evt.target).closest('.customer-account').toggleClass('customer-account--reveal-menu').hasClass('customer-account--reveal-menu');
          $(evt.target).closest('.customer-account__parent-link').attr('aria-expanded', isOpen);
        }
      },

      /**
       * Press return on dropdown parent to reveal children
       */
      dropdownLinkKeyPress: function dropdownLinkKeyPress(evt) {
        if (evt.which == 13) {
          if ($(evt.target).closest('.site-nav__dropdown').length && $(evt.target).closest('.more-links').length) {
            // in more-links
            $(evt.target).trigger('mouseenter');
          } else {
            // normal dropdown
            var isOpen = $(evt.target).closest('.site-nav__item--has-dropdown').toggleClass('open').hasClass('open'); // a11y

            $(evt.target).attr('aria-expanded', isOpen);
          }

          return false;
        }
      },

      /**
       * Ensure hidden search forms cannot be tabbed to
       */
      setSearchTabbing: function setSearchTabbing(evt) {
        $('.search-bar', this.$container).each(function () {
          if ($(this).css('pointer-events') == 'none') {
            $(this).find('a, input, button').attr('tabindex', '-1');
          } else {
            $(this).find('a, input, button').removeAttr('tabindex');
          }
        });
      },

      /**
       * Event on focus of a more-links top-level link
       */
      onMoreLinksSubMenuActive: function onMoreLinksSubMenuActive(evt) {
        this.$navMoreLinksSubmenuContainer.empty();
        var $childMenu = $(evt.currentTarget).children('.site-nav__dropdown');

        if ($childMenu.length) {
          var $clone = $childMenu.clone(); // alter layout of mega nav columns

          $clone.find('.mega-dropdown__container .one-third').removeClass('one-third').addClass('one-half');
          $clone.find('.mega-dropdown__container .one-quarter').removeClass('one-quarter').addClass('one-third');
          $clone.find('.site-nav__promo-container > .three-quarters').removeClass('three-quarters').addClass('two-thirds');
          $clone.find('.site-nav__promo-container > .one-quarter').removeClass('one-quarter').addClass('one-third'); // add to visible container

          $clone.appendTo(this.$navMoreLinksSubmenuContainer);
        }

        var submenuHeight = this.$navMoreLinksSubmenuContainer.outerHeight() + 30; // extra for nav padding

        this.$navMoreLinksSubmenuContainer.parent().css('min-height', submenuHeight);
        $(evt.currentTarget).removeClass('more-links__parent--inactive').addClass('more-links__parent--active').siblings().removeClass('more-links__parent--active').addClass('more-links__parent--inactive'); // a11y

        $(evt.target).attr('aria-expanded', true);
        $(evt.target).parent().siblings().find('a').attr('aria-expanded', false);
      },

      /**
       * Event for checking visible links in menu
       */
      menuLinkVisibilityCheck: function menuLinkVisibilityCheck(evt) {
        var navWidth = this.$nav.width();
        var moreLinksWidth = this.$navMoreLinksLink.width(); // check if we have too many links to show

        var spacingOffset = 4; // inline elements

        var total = 0;
        this.$navLinks.each(function () {
          total += $(this).width() + spacingOffset;
        });

        if (total > navWidth) {
          // calculate which links to move
          total = moreLinksWidth;
          var $_ref = this.$navMoreLinksContainer.empty();
          this.$navLinks.each(function () {
            total += $(this).width() + spacingOffset;

            if (total > navWidth) {
              $_ref.append($(this).clone().removeClass('site-nav__invisible'));
              $(this).addClass('site-nav__invisible').find('a').attr('tabindex', '-1');
            } else {
              $(this).removeClass('site-nav__invisible').find('a').removeAttr('tabindex');
            }
          });
          this.$navMoreLinksLink.attr('role', 'menu');
          this.$navMoreLinksContainer.find('a').removeAttr('tabindex');
          this.$navMoreLinksLink.removeClass('site-nav__invisible');
          this.$navMoreLinksLink.toggleClass('more-links--with-dropdown', this.$navMoreLinksLink.find('.small-dropdown:first, .mega-dropdown:first').length > 0);
          this.$navMoreLinksLink.toggleClass('more-links--with-mega-dropdown', this.$navMoreLinksLink.find('.mega-dropdown:first').length > 0);
          this.$navMoreLinksContainer.find('.small-dropdown').css('transform', '');
        } else {
          // hide more-links
          this.$navLinks.removeClass('site-nav__invisible');
          this.$navMoreLinksLink.addClass('site-nav__invisible');
          this.$navMoreLinksLink.removeAttr('role');
          this.$navMoreLinksContainer.empty();
        }
      },

      /**
       * Event for showing the login in a modal
       */
      loginOpen: function loginOpen(evt) {
        evt.preventDefault();
        theme.openPageContentInLightbox(theme.routes.account_login_url);
      },

      /**
       * Event for showing the registration form in a modal
       */
      registerOpen: function registerOpen(evt) {
        evt.preventDefault();
        theme.openPageContentInLightbox(theme.routes.account_register_url);
      },

      /**
       * Event for showing the search bar
       */
      searchFormOpen: function searchFormOpen(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        $('body').addClass('search-bar-open');
        $('.search-bar:not(.mobile-menu-search):visible input[name="q"]', this.$container).focus();
        this.functions.setSearchTabbing.bind(this)();
      },

      /**
       * Event for transferring focus to the search bar input
       */
      searchFormFocus: function searchFormFocus(evt) {
        $('.search-bar:visible input[name="q"]', this.$container).focus();
      },

      /**
       * Event for closing the search bar
       */
      searchFormClose: function searchFormClose(evt) {
        $('body').removeClass('search-bar-open search-bar-in-focus');
        this.functions.setSearchTabbing.bind(this)(); // focus on the open button

        if (evt && evt.target) {
          $(evt.target).closest('.search-bar').prev('a').focus().blur();
        }
      },

      /**
       * Event for when focus enters the search bar
       */
      searchFocusIn: function searchFocusIn(evt) {
        // ensure focus class is added by clearing any associated class removal
        clearTimeout(this.searchFocusOutTimeout);
        $('body').addClass('search-bar-in-focus');
      },

      /**
       * Event for when focus leaves the search bar
       */
      searchFocusOut: function searchFocusOut(evt) {
        // defer in case focus on another element requires cancelling this
        this.searchFocusOutTimeout = setTimeout(function () {
          $('body').removeClass('search-bar-in-focus');
          $('.search-bar').removeClass('search-bar--has-results');
        }, 100);
      },

      /**
       * Event for clicks on the page focus tint
       */
      onFocusTintClick: function onFocusTintClick(evt) {
        this.functions.searchFormClose.bind(this)();
        return false;
      },

      /**
       * Event for showing the mobile navigation
       */
      mobileMenuOpen: function mobileMenuOpen(evt) {
        $('.header-navigation', this.$container).addClass('header-navigation--open');
        $(document.body, this.$container).addClass('mobile-menu-open');
      },

      /**
       * Event for closing the mobile navigation
       */
      mobileMenuClose: function mobileMenuClose(evt) {
        $('.header-navigation', this.$container).removeClass('header-navigation--open');
        $(document.body, this.$container).removeClass('mobile-menu-open');
      },

      /**
       * Event for fetching new search results
       */
      updateSearchResults: function updateSearchResults(evt) {
        var $form = $(evt.target).closest('form');
        var $bar = $form.closest('.search-bar'); // build search url

        var searchUrl = $form.attr('action') + ($form.attr('action').indexOf('?') >= 0 ? '&' : '?') + $form.serialize(); // has results url changed?

        if (searchUrl != $form.data(this.search.searchUrlKey)) {
          $form.data(this.search.searchUrlKey, searchUrl); // cancel any ongoing request

          this.functions._abortSearch.bind(this)(); // hide results if under 3 characters entered


          var term = $form.find('input[name="q"]').val();

          if (term.length < 3) {
            this.functions._searchResultsHide.bind(this)($bar);
          } else {
            // fetch results
            $bar.addClass(this.search.resultsLoadingClass);
            $bar.find(this.search.resultsSelector).html('<div class="search-result search-result--loading">' + this.search.loadingMessage + '</div>');
            this.search.ongoingTimeoutId = setTimeout(this.functions._fetchResults.bind(this, $form, searchUrl, $bar), this.search.throttleMs);
          }
        }
      },

      /**
       * Cancel current search
       */
      _abortSearch: function _abortSearch() {
        if (this.search.ongoingRequest) {
          this.search.ongoingRequest.abort();
        }

        clearTimeout(this.search.ongoingTimeoutId);
      },

      /**
       * Immediately fetch search results
       */
      _fetchResults: function _fetchResults($searchForm, searchUrl, $bar) {
        var ajaxUrl, ajaxData;

        if (theme.shopifyFeatures.predictiveSearch) {
          // use the API
          ajaxUrl = theme.routes.search_url + '/suggest.json';
          ajaxData = {
            "q": $searchForm.find('input[name="q"]').val(),
            "resources": {
              "type": $searchForm.find('input[name="type"]').val(),
              "limit": 6,
              "options": {
                "unavailable_products": 'last'
              }
            }
          };
        } else {
          // use the theme template fallback
          ajaxUrl = $searchForm.attr('action') + '?' + $searchForm.serialize() + '&view=json';
          ajaxData = null;
        }

        this.search.ongoingRequest = $.ajax({
          url: ajaxUrl,
          data: ajaxData,
          dataType: "json",
          success: this.functions._searchResultsSuccess.bind(this, $bar, searchUrl)
        }).fail(function ($bar, request) {
          console.log('Error fetching results');
          console.log(request);

          this.functions._searchResultsHide.bind(this, $bar);
        }.bind(this, $bar)).always(function () {
          this.search.ongoingRequest = null;
        }.bind(this));
      },

      /**
       * Success fetching results - build and show
       */
      _searchResultsSuccess: function _searchResultsSuccess($bar, searchUrl, response) {
        $bar.addClass(this.search.resultsLoadedClass).removeClass(this.search.resultsLoadingClass);
        var $results = $('<div>'),
            showPrice = $bar.hasClass('live-search--show-price'),
            showVendor = $bar.hasClass('live-search--show-vendor');

        if (response.resources.results.products && response.resources.results.products.length > 0 || response.resources.results.pages && response.resources.results.pages.length > 0 || response.resources.results.articles && response.resources.results.articles.length > 0) {
          if (response.resources.results.products) {
            for (var i = 0; i < response.resources.results.products.length; i++) {
              var result = response.resources.results.products[i];
              var $result = $('<a class="search-result">').attr('href', result.url);
              var $titleAndPrice = $('<div class="search-result__title">').appendTo($result);
              $('<div class="search-result__title search-result__title--product">').text(result.title).appendTo($titleAndPrice);

              if (showVendor) {
                $('<div class="search-result__vendor">').text(result.vendor).appendTo($titleAndPrice);
              }

              if (showPrice) {
                var $price = $('<div class="search-result__price product-price">').appendTo($titleAndPrice);

                if (parseFloat(result.price_min) != parseFloat(result.price_max)) {
                  $price.append($('<span class="product-price__from">').html(theme.strings.priceFrom)).append(' ');
                }

                $('<span class="theme-money">').toggleClass('product-price__reduced', parseFloat(result.compare_at_price_min) > parseFloat(result.price_min)).html(theme.Shopify.formatMoney(result.price_min, theme.moneyFormat)).appendTo($price);

                if (parseFloat(result.compare_at_price_min) > parseFloat(result.price_min)) {
                  $price.append(' ').append($('<span class="product-price__compare theme-money">').html(theme.Shopify.formatMoney(result.compare_at_price_min, theme.moneyFormat)));
                }
              }

              var $thumb;

              if (result.image) {
                $thumb = $('<span class="search-result__image">').append($('<img role="presentation" alt="">').attr('src', slate.Image.getSizedImageUrl(result.image, '100x100_crop_center')));
              } else {
                $thumb = $('<span class="search-result__image">').append($('<span class="search-result__char">').html(result.title[0]));
              }

              $result.prepend($thumb).appendTo($results);
            }
          }

          if (response.resources.results.articles) {
            for (var i = 0; i < response.resources.results.articles.length; i++) {
              var result = response.resources.results.articles[i];
              var $result = $('<a class="search-result">').attr('href', result.url).append($('<span class="search-result__title">').text(result.title));
              var $thumb;

              if (result.image) {
                $thumb = $('<span class="search-result__image">').append($('<img role="presentation" alt="">').attr('src', slate.Image.getSizedImageUrl(result.image, '100x100_crop_center')));
              } else {
                $thumb = $('<span class="search-result__image">').append($('<span class="search-result__char">').html(result.title[0]));
              }

              $result.prepend($thumb).appendTo($results);
            }
          }

          if (response.resources.results.pages) {
            for (var i = 0; i < response.resources.results.pages.length; i++) {
              var result = response.resources.results.pages[i];
              var $result = $('<a class="search-result">').attr('href', result.url).append($('<span class="search-result__title">').text(result.title));
              var $thumb = $('<span class="search-result__image">').append($('<span class="search-result__char">').html(result.title[0]));
              $result.prepend($thumb).appendTo($results);
            }
          }

          $('<a class="search-result search-result--more">').attr('href', searchUrl).html(this.search.moreResultsMessage).appendTo($results);
        } else {
          $results.append('<div class="search-result search-result--empty">' + this.search.emptyMessage + '</div>');
        }

        $bar.find(this.search.resultsSelector).html($results);
      },

      /**
       * Empty and hide search results
       */
      _searchResultsHide: function _searchResultsHide($bar) {
        $bar.removeClass(this.search.resultsLoadedClass).removeClass(this.search.resultsLoadingClass).find(this.search.resultsSelector).empty();
      },

      /**
       * Check if we should dock both desktop/mobile header
       */
      dockedNavCheck: function dockedNavCheck(evt) {
        var scrollTop = $(window).scrollTop();
        var desktopShouldDock = $(window).width() >= theme.dockedNavDesktopMinWidth && this.$dockedDesktopBaseContainer.offset().top < scrollTop;
        var mobileShouldDock = $(window).width() < theme.dockedNavDesktopMinWidth && this.$dockedMobileBaseContainer.offset().top < scrollTop;

        if (desktopShouldDock) {
          // set dock placeholder height
          this.$dockedDesktopBaseContainer.css('height', this.$dockedDesktopContentsContainer.outerHeight());
        } else {
          // remove placeholder height if undocking
          if (this.desktopHeaderWasDocked) {
            this.$dockedDesktopBaseContainer.css('height', '');
          }
        }

        if (mobileShouldDock) {
          // set dock placeholder height
          this.$dockedMobileBaseContainer.css('height', this.$dockedMobileContentsContainer.outerHeight());
        } else {
          // remove placeholder height if undocking
          if (this.mobileHeaderWasDocked) {
            this.$dockedMobileBaseContainer.css('height', '');
          }
        }

        this.$container.toggleClass('docked-header--dock', desktopShouldDock || mobileShouldDock); // check menu links if width of nav has changed

        if (desktopShouldDock != this.desktopHeaderWasDocked) {
          this.functions.menuLinkVisibilityCheck.bind(this)();
        }

        this.desktopHeaderWasDocked = desktopShouldDock;
        this.mobileHeaderWasDocked = mobileShouldDock;
      },

      /**
       * Update the sticky element height based on the docked nav height
       */
      updateDockedNavHeightStyle: function updateDockedNavHeightStyle() {
        var productStickyTop = theme.dockedNavHeight() + 30;
        $('#themeDockedNavStyle').html('@media (min-width:768px){.sticky-element{top:' + theme.dockedNavHeight() + 'px;} .product-detail__detail.sticky-element{top:' + productStickyTop + 'px;}}');
      }
    };
    /**
     * Event callback for Theme Editor `section:unload` event
     */

    this.onSectionUnload = function () {
      this.$container.off(this.namespace);
      $('.focus-tint').off(this.namespace);
      $(window).off(this.namespace);
      $('.js-messages-slider', this.$container).slick('unslick');
      $('.js-mobile-messages-slider', this.$container).slick('unslick');
      $('#themeDockedNavStyle').remove();
      $('.disclosure', this.$container).each(function () {
        $(this).data('disclosure').unload();
      });
    };
  }();
  ;
  /**
   * Footer Script
   * ------------------------------------------------------------------------------
   * A file that contains scripts highly couple code to the List Collections template.
   *
     * @namespace Footer
   */

  theme.Footer = new function () {
    /**
     * Footer section constructor. Runs on page load as well as Theme Editor
     * `section:load` events.
     * @param {string} container - selector for the section container DOM element
     */
    this.onSectionLoad = function (container) {
      this.$container = $(container);
      this.namespace = theme.namespaceFromSection(container); // sticky footer

      this.$stickyFooter = $('.sticky-footer', container); // clear classes set outside of this container

      $('body').removeClass('sticky-footer-not-visible sticky-footer-partly-visible sticky-footer-fully-visible sticky-footer-taller-than-page sticky-footer-scrolled-into'); // if sticky, assign events

      if (this.$stickyFooter.length) {
        this.functions.stickyResize.bind(this)();
        this.functions.stickyScroll.bind(this)();
        $(window).on('debouncedresize' + this.namespace, this.functions.stickyResize.bind(this));
        $(window).on('scroll' + this.namespace, this.functions.stickyScroll.bind(this));
      } else {
        // if footer is not sticky, check if it needs pushing down on short pages
        this.$footerInner = this.$container.find('.page-footer__inner ');
        this.functions.pushDown.call(this);
        $(window).on('debouncedresize' + this.namespace, this.functions.pushDown.bind(this));
      } // localization


      $('.disclosure', this.$container).each(function () {
        $(this).data('disclosure', new theme.Disclosure($(this)));
      });
    };

    this.functions = {
      /**
       * Push footer down on short pages, so it meets the edge of the viewport
       */
      pushDown: function pushDown() {
        var gap = $(window).height() - (this.$container.offset().top + this.$footerInner.outerHeight());

        if (gap > 0) {
          this.$container.css('padding-top', gap);
        } else {
          this.$container.css('padding-top', '');
        }
      },

      /**
       * Set a class to indicate if we've scrolled into the footer
       */
      stickyScroll: function stickyScroll() {
        $('body').toggleClass('sticky-footer-scrolled-into', $(window).scrollTop() > this.$container.offset().top);
      },

      /**
       * Set footer container height and various utility classes
       */
      stickyResize: function stickyResize() {
        var footerHeight = this.$stickyFooter.outerHeight();
        var footerOffsetTop = this.$container.offset().top;
        var partlyVisible = footerOffsetTop < $(window).height(),
            fullyVisible = footerOffsetTop + footerHeight < $(window).height(),
            tallerThanPage = footerHeight > $(window).height(); // classes to define footer state when at the top of scroll

        $('body').toggleClass('sticky-footer-not-visible', !partlyVisible); // fully off-screen

        $('body').toggleClass('sticky-footer-partly-visible', partlyVisible && !fullyVisible); // partially off-screen

        $('body').toggleClass('sticky-footer-fully-visible', fullyVisible); // entirely on-screen

        $('body').toggleClass('sticky-footer-taller-than-page', tallerThanPage); // footer is taller than the viewport
        // match in-page footer container to sticky footer height

        this.$container.css('min-height', footerHeight);
      }
    };
    /**
     * Event callback for Theme Editor `section:unload` event
     */

    this.onSectionUnload = function () {
      $(window).off(this.namespace);
      $('.disclosure', this.$container).each(function () {
        $(this).data('disclosure').unload();
      });
    };
  }();
  /**
   * Product Template Script
   * ------------------------------------------------------------------------------
   * A file that contains scripts highly couple code to the Product template.
   *
     * @namespace product
   */

  theme.Product = new function () {
    var selectors = $.extend({}, theme.variants.selectors, {
      productJson: '[data-product-json]',
      productMediaContainer: '.product-detail__images',
      productMedia: '[data-product-media]',
      productImages: '[data-product-image]',
      productMediaThumbnails: '[data-product-media-thumbnail]',
      singleOptionSelector: '[data-single-option-selector]',
      skuWrapper: '.sku-wrapper',
      sku: '.sku-wrapper__sku',
      styledSelect: '.selector-wrapper select',
      quantitySelect: '.quantity-proxy',
      storeAvailability: '[data-store-availability-container]'
    });
    /**
     * Product section constructor. Runs on page load as well as Theme Editor
     * `section:load` events.
     * @param {string} container - selector for the section container DOM element
     */

    this.onSectionLoad = function (container) {
      this.$container = $(container);
      this.namespace = theme.namespaceFromSection(container); /// Init store availability if applicable

      if ($(selectors.storeAvailability, container).length) {
        this.storeAvailability = new theme.StoreAvailability($(selectors.storeAvailability, container)[0]);
      } // Stop parsing if we don't have the product json script tag when loading
      // section in the Theme Editor


      if (!$(selectors.productJson, this.$container).html()) {
        return;
      }

      var sectionId = this.$container.attr('data-section-id');
      this.productSingleObject = JSON.parse($(selectors.productJson, this.$container).html());
      var options = {
        $container: this.$container,
        enableHistoryState: this.$container.data('enable-history-state') || false,
        singleOptionSelector: selectors.singleOptionSelector,
        originalSelectorId: selectors.originalSelectorId,
        secondaryIdSelectors: selectors.secondaryIdSelectors,
        product: this.productSingleObject
      };
      this.settings = {};
      this.settings.imageSize = 'master';
      this.variants = new slate.Variants(options);
      this.$productMediaContainer = $(selectors.productMediaContainer, this.$container);
      this.$productMedia = $(selectors.productMedia, this.$container);
      this.$productImages = $(selectors.productImages, this.$container);
      this.$productMediaThumbnails = $(selectors.productMediaThumbnails, this.$container);
      this.$container.on('variantChange' + this.namespace, theme.variants.updateAddToCartState.bind(this));
      this.$container.on('variantPriceChange' + this.namespace, theme.variants.updateProductPrices.bind(this));

      if (this.$container.find(selectors.skuWrapper)) {
        this.$container.on('variantChange' + this.namespace, this.functions.updateSKU.bind(this));
      } // set up desktop media behaviour


      if (this.$productMediaThumbnails.length) {
        // thumbnails control a slideshow
        if (this.$productMedia.length > 1) {
          this.$container.on('click' + this.namespace, selectors.productMediaThumbnails, this.functions.updatePrimaryProductMediaFromThumbnailClick.bind(this));
          this.$container.on('variantImageChange' + this.namespace, this.functions.updateProductMediaSlideshowFromVariantChange.bind(this));
        } // launch image zoom


        this.$container.on('click' + this.namespace, selectors.productImages, this.functions.openGallery.bind(this));
      } else {
        // media is in a column
        if (this.$productMedia.length > 1) {
          this.$container.on('variantImageChange' + this.namespace, this.functions.updateProductMediaColumn.bind(this));
          $(document).on('click' + this.namespace + ' keydown' + this.namespace, function () {
            this.$productMedia.not('.variant-dim--fixed').removeClass('variant-dim');
          }.bind(this));
          $(window).on('scroll' + this.namespace + ' ontouchstart' + this.namespace, function () {
            this.$productMedia.not('.variant-dim--fixed').removeClass('variant-dim');
          }.bind(this)); // notify when media is on/off screen

          $(window).on('scroll' + this.namespace, this.functions.notifyMediaOfVisibilityInColumn.bind(this));
          this.functions.notifyMediaOfVisibilityInColumn.bind(this)();
        } // image zoom


        this.$container.on('click' + this.namespace, selectors.productImages, this.functions.openGallery.bind(this));
      } // mobile image slideshow


      this.mediaSlideshowActive = false;
      $(window).on('debouncedresize' + this.namespace, this.functions.assessMediaSlideshow.bind(this));
      this.functions.assessMediaSlideshow.bind(this)(); // media

      theme.ProductMedia.init(this.$container, {
        onPlyrInit: function onPlyrInit(playerObj) {
          var $slideshow = $(playerObj.element).closest('.slick-initialized');

          if ($slideshow.length) {
            theme.productGallerySlideshowTabFix($slideshow.slick('getSlick').$slides, $slideshow.slick('getSlick').currentSlide);
          }
        },
        onYoutubeInit: function onYoutubeInit(playerObj) {
          var $slideshow = $(playerObj.element).closest('.slick-initialized');

          if ($slideshow.length) {
            theme.productGallerySlideshowTabFix($slideshow.slick('getSlick').$slides, $slideshow.slick('getSlick').currentSlide);
          }
        },
        onModelViewerInit: function onModelViewerInit(playerObj) {
          var $slideshow = $(playerObj.element).closest('.slick-initialized');

          if ($slideshow.length) {
            theme.productGallerySlideshowTabFix($slideshow.slick('getSlick').$slides, $slideshow.slick('getSlick').currentSlide);
          }
        }
      });
      this.$container.find('.product-media').trigger('mediaVisibleInitial'); // style variant options

      theme.styleVariantSelectors($(selectors.styledSelect, container), options.product);

      if (this.variants.product.variants.length > 1) {
        // emit an event to broadcast the variant update
        $(window).trigger('cc-variant-updated', {
          variant: this.variants.currentVariant,
          product: this.productSingleObject
        });
      } // style quantity dropdown


      theme.select2.init($(selectors.quantitySelect, container)); // size chart

      this.$container.on('click', '.js-size-chart-open', function (e) {
        e.preventDefault();
        $('body').addClass('size-chart-is-open');
      });
      this.$container.on('click', '.js-size-chart-close', function () {
        $('body').removeClass('size-chart-is-open');
      }); // ajax product form

      theme.initAjaxAddToCartForm($('form.ajax-product-form', this.$container)); // section may contain RTE images

      theme.assessRTEImagesOnLoad(this.$container);
    };

    this.functions = {
      /**
       * Updates the SKU
       */
      updateSKU: function updateSKU(evt) {
        var variant = evt.variant;

        if (variant && variant.sku) {
          $(selectors.skuWrapper, this.$container).removeClass('sku-wrapper--empty');
          $(selectors.sku, this.$container).html(variant.sku);
        } else {
          $(selectors.skuWrapper, this.$container).addClass('sku-wrapper--empty');
          $(selectors.sku, this.$container).empty();
        }
      },

      /**
       * Notify media when it goes off screen
       */
      notifyMediaOfVisibilityInColumn: function notifyMediaOfVisibilityInColumn() {
        var viewportTop = $(window).scrollTop(),
            viewportBottom = viewportTop + $(window).height();
        $('.product-media', this.$container).each(function () {
          var mediaTop = $(this).offset().top,
              mediaBottom = mediaTop + $(this).outerHeight();

          if (mediaTop > viewportTop && mediaTop < viewportBottom || mediaBottom > viewportTop && mediaBottom < viewportBottom) {
            if (!$(this).hasClass('product-media--on-screen')) {
              $(this).addClass('product-media--on-screen'); // load model viewer ui when on screen, or all of them in a carousel

              if ($(this).is('.product-media--model:not(.product-media--model-loaded)')) {
                $(this).trigger('mediaVisibleInitial');
              }
            }
          } else {
            if ($(this).hasClass('product-media--on-screen')) {
              $(this).removeClass('product-media--on-screen').trigger('mediaHidden');
            }
          }
        });
      },

      /**
       * Go to select image in main image slideshow
       */
      _updatePrimaryProductMediaFromThumbnail: function _updatePrimaryProductMediaFromThumbnail($mediaWithId) {
        var index = this.$productMedia.filter('[data-media-id="' + $mediaWithId.data('media-id') + '"]').closest('.slick-slide').data('slick-index');
        this.$productMediaContainer.slick('slickGoTo', index);
      },

      /**
       * Change main image when thumbnail is clicked
       */
      updatePrimaryProductMediaFromThumbnailClick: function updatePrimaryProductMediaFromThumbnailClick(evt) {
        evt.preventDefault();

        this.functions._updatePrimaryProductMediaFromThumbnail.bind(this)($(evt.currentTarget));
      },

      /**
       * Change slideshow to variant media
       */
      updateProductMediaSlideshowFromVariantChange: function updateProductMediaSlideshowFromVariantChange(evt) {
        var variant = evt.variant;
        var $found = this.$productMedia.filter(function () {
          return $(this).data('media-id') == variant.featured_media.id;
        });

        if ($found.length == 1) {
          this.functions._updatePrimaryProductMediaFromThumbnail.bind(this)($found);
        }
      },

      /**
       * Scroll the page to the specified image when in column, go to item in carousel
       */
      updateProductMediaColumn: function updateProductMediaColumn(evt) {
        var variant = evt.variant;
        var $found = this.$productMedia.filter(function () {
          return $(this).data('media-id') == variant.featured_media.id;
        });

        if ($found.length == 1) {
          if (this.$productMediaContainer.hasClass('slick-slider')) {
            this.functions._updatePrimaryProductMediaFromThumbnail.bind(this)($found);
          } else {
            // requires a delay (for some reason)
            clearTimeout(this.variantScrollTimeoutId);
            this.variantScrollTimeoutId = setTimeout(function () {
              var desiredScrollTop = $found.offset().top - theme.dockedNavHeight();
              var $cont = $found.closest('.product-detail');
              var maxScrollTop = $cont.offset().top + $cont.height() - $cont.find('.product-detail__detail').outerHeight() - 20;
              $('html,body').animate({
                scrollTop: Math.min(desiredScrollTop, maxScrollTop)
              }, 500, function () {
                $found.removeClass('variant-dim');
                this.$productImages.not($found).addClass('variant-dim variant-dim--fixed');
                setTimeout(function () {
                  $('.variant-dim--fixed').removeClass('variant-dim--fixed');
                }, 500);
              }.bind(this));
            }.bind(this), 25);
          }
        }
      },

      /**
       * Create/destroy slideshow depending on screen width
       */
      assessMediaSlideshow: function assessMediaSlideshow(evt) {
        var windowWidth = $(window).width();
        var count = false;

        if (this.$productMediaContainer.children().length > 1) {
          count = true;
        }

        var wantSlideshow = windowWidth < 768 || $('.product-detail__thumbnails').length;

        if (wantSlideshow) {
          if (!this.mediaSlideshowActive) {
            var initialSlide = 0;
            var fmid = this.$productMediaContainer.data('featured-media-id');
            this.$productMediaContainer.data('featured-media-id', null);
            initialSlide = this.$productMediaContainer.find('[data-media-id="' + fmid + '"]').parent().index();
            var $slideshow = this.$productMediaContainer.slick({
              infinite: false,
              fade: true,
              arrows: false,
              dots: false,
              adaptiveHeight: true,
              prevArrow: theme.icons.slideshowPrevArrow,
              nextArrow: theme.icons.slideshowNextArrow,
              appendArrows: $('.slick-external-controls .slick-arrows', this.$container),
              appendDots: $('.slick-external-controls .slick-dots', this.$container),
              initialSlide: initialSlide,
              responsive: [{
                breakpoint: 767,
                settings: {
                  fade: false,
                  arrows: true,
                  dots: count
                }
              }]
            });
            $slideshow.find('.product-media').trigger('mediaVisibleInitial');
            $slideshow.on('afterChange', function (evt, slick, current) {
              // notify media of visibility
              var $currentMedia = $('.product-media', slick.$slides[current]);
              $('.product-media').not($currentMedia).trigger('mediaHidden');
              $currentMedia.trigger('mediaVisible'); // active class

              var $currentSlideLink = $('[data-product-image]', slick.$slides[current]);
              $('.product-detail__thumbnail[data-media-id="' + $currentSlideLink.data('media-id') + '"]').addClass('thumb-active').siblings().removeClass('thumb-active'); // fix tabbing

              theme.productGallerySlideshowTabFix(slick.$slides, current); // resize quickbuy

              $(this).closest('.quickbuy-container').trigger('changedsize');
            });
            theme.productGallerySlideshowTabFix($slideshow.slick('getSlick').$slides, $slideshow.slick('getSlick').currentSlide);
            this.mediaSlideshowActive = true;
          }
        } else {
          if (this.mediaSlideshowActive) {
            this.$productMediaContainer.slick('unslick');
            this.mediaSlideshowActive = false;
          }
        }
      },

      /**
       * Show gallery of all product images
       */
      openGallery: function openGallery(evt) {
        evt.preventDefault();
        var pswpElement = document.querySelectorAll('.pswp')[0];
        var items = [];
        this.$productImages.each(function (index) {
          $(this).data('image-index', index);
          var item = {
            src: $(this).attr('href'),
            w: $(this).data('image-w'),
            h: $(this).data('image-h')
          };
          var img = $(this).find('img')[0];

          if (typeof img.currentSrc !== 'undefined') {
            item.msrc = img.currentSrc;
          }

          items.push(item);
        });
        var options = {
          history: false,
          captionEl: false,
          shareEl: false,
          fullscreenEl: false
        }; // use event target to determine which image to launch first

        options.index = $(evt.target).closest('a').data('image-index');

        options.getThumbBoundsFn = function (index) {
          var thumbnail = this.$productImages[index].getElementsByTagName('img')[0],
              pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
              rect = thumbnail.getBoundingClientRect();
          return {
            x: rect.left,
            y: rect.top + pageYScroll,
            w: rect.width
          };
        }.bind(this); // Initializes and opens PhotoSwipe


        this.imageGallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
        this.imageGallery.init();
        this.imageGallery.listen('destroy', function () {
          this.imageGallery = null;
        }.bind(this));

        var _this = this;

        this.imageGallery.listen('afterChange', function () {
          var currentSrc = this.currItem.src;

          var $currentThumb = _this.$productImages.filter(function () {
            return $(this).attr('href') == currentSrc;
          });

          _this.functions._updatePrimaryProductMediaFromThumbnail.bind(_this)($currentThumb);
        });
      }
    };
    /**
     * Event callback for Theme Editor `section:unload` event
     */

    this.onSectionUnload = function () {
      this.$container.off(this.namespace);
      $(document).off(this.namespace);
      $(window).off(this.namespace);

      if (this.imageGallery) {
        this.imageGallery.close();
      }

      if (this.storeAvailability) {
        this.storeAvailability.onSectionUnload();
      }

      theme.ProductMedia.destroy(this.$container);
      this.$container.find('.slick-initialized').slick('unslick').off('afterChange');
      this.$container.find('.clickybox-replaced').clickyBoxes('destroy');
      theme.unloadAjaxAddToCartForm($('form.ajax-product-form', this.$container));
    };
  }();
  ;
  /**
   * Blog Template Script
   * ------------------------------------------------------------------------------
   * For both the blog page and homepage section
   *
     * @namespace blog
   */

  theme.Blog = new function () {
    var selectors = {
      header: '.featured-blog__header, .blog-featured-image',
      headerImage: '.featured-blog__header-image, .blog-image',
      slideshow: '.js-content-products-slider .grid'
    };
    var breakpoint = 768;
    var resizeTimer;
    /**
     * Blog section constructor. Runs on page load as well as Theme Editor
     * `section:load` events.
     * @param {string} container - selector for the section container DOM element
     */

    this.onSectionLoad = function (container) {
      this.$container = $(container);
      this.namespace = theme.namespaceFromSection(container); // header spacing/image

      this.$header = $(selectors.header, this.$container);
      this.$headerImage = $(selectors.headerImage, this.$container); // peek carousel

      $('.js-content-products-slider .grid', this.$container).each(function (index, value) {
        theme.peekCarousel.init(this.$container, $(value), this.namespace, function () {
          return true;
        }, false, {
          infinite: false,
          slidesToShow: 3,
          slidesToScroll: 1,
          swipeToSlide: true,
          dots: false,
          prevArrow: $(value).closest('.content-products').find('.content-products-controls .prev'),
          nextArrow: $(value).closest('.content-products').find('.content-products-controls .next'),
          responsive: [{
            breakpoint: $('.single-column-layout', this.$container).length ? 768 : 960,
            settings: {
              slidesToShow: 1
            }
          }]
        }); // ensure content product title line up

        theme.initUniformHeightMonitor($(value), '.product-block__image-container', '.product-block__image-container .image-one');
      }.bind(this)); //Section

      this.functions.assessSection.bind(this)();
      $(window).on('debouncedresize' + this.namespace, this.functions.assessSection.bind(this));
    };

    this.functions = {
      /**
       * Set the height of the left-column, taking sticky nav into account
       */
      assessSection: function assessSection(evt) {
        var windowWidth = $(window).width();

        if (windowWidth < 768) {
          this.$headerImage.css('height', '');
        } else {
          var headerPadding = parseInt(this.$header.css('padding-top'));
          this.$headerImage.css('height', $(window).height() - headerPadding * 2 - theme.dockedNavHeight());
        }
      }
    };

    this.onSectionUnload = function (container) {
      this.$container.off(this.namespace);
      $(window).off(this.namespace);
      theme.destroyUniformHeightMonitor($('.js-content-products-slider .grid', this.$container));
      theme.peekCarousel.destroy(this.$container, $('.js-content-products-slider .grid', this.$container), this.namespace);
    };
  }();
  ;
  /**
   * Article Template Script
   * ------------------------------------------------------------------------------
   * For both the article page
   *
     * @namespace article
   */

  theme.Article = new function () {
    var selectors = {
      slideshow: '.js-content-products-slider .grid'
    };
    /**
     * Article section constructor. Runs on page load as well as Theme Editor
     * `section:load` events.
     * @param {string} container - selector for the section container DOM element
     */

    this.onSectionLoad = function (container) {
      this.$container = $(container);
      this.namespace = theme.namespaceFromSection(container);
      var rteWidth = $('.template-article .rte').width(); // product slideshow

      $(selectors.slideshow, this.$container).each(function (index, value) {
        theme.peekCarousel.init(this.$container, $(value), this.namespace, function () {
          return true;
        }, false, {
          infinite: false,
          slidesToShow: 3,
          slidesToScroll: 1,
          swipeToSlide: true,
          dots: false,
          prevArrow: $(value).closest('.content-products').find('.content-products-controls .prev'),
          nextArrow: $(value).closest('.content-products').find('.content-products-controls .next'),
          responsive: [{
            breakpoint: $('.single-column-layout', this.$container).length ? 768 : 960,
            settings: {
              slidesToShow: 1
            }
          }]
        }); // ensure content product title line up

        theme.initUniformHeightMonitor($(value), '.product-block__image-container', '.product-block__image-container .image-one');
      }.bind(this)); // section may contain RTE images

      theme.assessRTEImagesOnLoad(this.$container);
    };

    this.onSectionUnload = function () {
      this.$container.off(this.namespace);
      $(window).off(this.namespace);
      theme.destroyUniformHeightMonitor($(selectors.slideshow, this.$container));
      theme.peekCarousel.destroy(this.$container, $(selectors.slideshow, this.$container), this.namespace);
    };
  }();
  ;
  /**
   * Slideshow Section Script
   * ------------------------------------------------------------------------------
   *
   * @namespace Slideshow
   */

  theme.Slideshow = new function () {
    /**
     * Slideshow section constructor. Runs on page load as well as Theme Editor
     * `section:load` events.
     * @param {string} container - selector for the section container DOM element
     */
    this.onSectionLoad = function (container) {
      this.$container = $(container);
      this.namespace = theme.namespaceFromSection(container);
      this.$slideshow = $('.js-slideshow-section', this.$container);
      /**
       * Slick slideshow
       */

      var count = false;

      if (this.$slideshow.children().length > 1) {
        var count = true;
      }

      this.$slideshow.slick({
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: count,
        adaptiveHeight: false,
        autoplay: this.$slideshow.data('autoplay'),
        autoplaySpeed: this.$slideshow.data('autoplayspeed'),
        prevArrow: $('.full-width-slideshow-controls .prev', this.$container),
        nextArrow: $('.full-width-slideshow-controls .next', this.$container)
      });
      $(window).on('debouncedresize' + this.namespace, this.functions.onResize.bind(this)); // section hides overlappers until initialised

      if (theme.checkOverlaps) {
        theme.checkOverlaps();
      }
    };

    this.functions = {
      /**
       * Event callback for window resize
       */
      onResize: function onResize(evt) {
        // fix slick bug where height does not adapt to content height on resize
        this.$slideshow.slick('setPosition');
      }
    };
    /**
     * Event callback for Theme Editor `shopify:block:select` event
     */

    this.onBlockSelect = function (block) {
      this.$slideshow.slick('slickGoTo', $(block).data('slick-index'), true).slick('slickPause');
    };
    /**
     * Event callback for Theme Editor `shopify:block:deselect` event
     */


    this.onBlockDeselect = function (block) {
      this.$slideshow.slick('slickPlay');
    };
    /**
     * Event callback for Theme Editor `section:unload` event
     */


    this.onSectionUnload = function () {
      this.$container.off(this.namespace);
      $(window).off(this.namespace);
      this.$slideshow.slick('unslick');
    };
  }();
  ;
  /**
   * Banner Script
   * ------------------------------------------------------------------------------
   *
   * @namespace banner
   */

  theme.Banner = new function () {
    this.onSectionLoad = theme.Slideshow.onSectionLoad;
    this.onSectionUnload = theme.Slideshow.onSectionUnload;
    this.onBlockSelect = theme.Slideshow.onBlockSelect;
    this.onBlockDeselect = theme.Slideshow.onBlockDeselect;
    this.functions = theme.Slideshow.functions;
  }();
  ;
  /**
   * Standout collection Section Script
   * ------------------------------------------------------------------------------
   *
   * @namespace StandoutCollection
   */

  theme.StandoutCollection = new function () {
    /**
     * StandoutCollection section constructor. Runs on page load as well as Theme Editor
     * `section:load` events.
     * @param {string} container - selector for the section container DOM element
     */
    this.onSectionLoad = function (container) {
      this.$container = $(container);
      this.namespace = theme.namespaceFromSection(container);
      /**
       * Slick StandoutCollection
       */

      theme.peekCarousel.init(this.$container, $('.js-standout-collection-slider', this.$container), this.namespace, function () {
        return true;
      }, false, {
        infinite: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: false,
        prevArrow: $('.standout-collection-slider__controls .prev', this.$container),
        nextArrow: $('.standout-collection-slider__controls .next', this.$container)
      });
    };
    /**
     * Event callback for Theme Editor `section:unload` event
     */


    this.onSectionUnload = function () {
      this.$container.off(this.namespace);
      theme.peekCarousel.destroy(this.$container, $('.js-standout-collection-slider', this.$container), this.namespace);
    };
  }();
  ;
  /**
   * Get The Look Section Script
   * ------------------------------------------------------------------------------
   *
   * @namespace get-the-look
   */

  theme.GetTheLook = new function () {
    var selectors = {
      header: '.get-the-look__image-container',
      headerImage: '.get-the-look__image-container .placeholder-svg, .get-the-look__image-container .rimage-background',
      slideshow: '.js-get-the-look-slider',
      product: '.get-the-look__product:first'
    };
    var breakpoint = 768;
    var resizeTimer;

    this.onSectionLoad = function (container) {
      this.$container = $(container);
      this.namespace = theme.namespaceFromSection(container); // header spacing/image

      this.$header = $(selectors.header, this.$container);
      this.$headerImage = $(selectors.headerImage, this.$container); // slideshow

      this.$slideshow = $(selectors.slideshow, this.$container); // first product

      this.$firstProduct = $(selectors.product, this.$container); // peek carousel

      theme.peekCarousel.init(this.$container, this.$slideshow, this.namespace, function () {
        return this.$firstProduct.length && parseInt(this.$firstProduct.css('margin-right')) == 0;
      }.bind(this)); // section

      this.functions.assessSection.bind(this)();
      $(window).on('debouncedresize' + this.namespace, this.functions.assessSection.bind(this));
    };

    this.functions = {
      /**
       * Set the height of the left-column, taking sticky nav into account
       */
      assessSection: function assessSection(evt) {
        if (this.$firstProduct.length && parseInt(this.$firstProduct.css('margin-right')) == 0) {
          this.$headerImage.css('height', '');
        } else {
          var headerPadding = parseInt(this.$header.css('margin-top'));
          this.$headerImage.css('height', $(window).height() - headerPadding * 2 - theme.dockedNavHeight());
        }
      }
    };
    /**
     * Event callback for Theme Editor `section:unload` event
     */

    this.onSectionUnload = function () {
      this.$container.off(this.namespace);
      $(window).off(this.namespace);
      theme.peekCarousel.destroy(this.$container, this.$slideshow, this.namespace);
    };
  }();
  /**
   * Promotional Images Script
   * ------------------------------------------------------------------------------
   *
   * @namespace promotional-images
   */

  theme.PromotionalImages = new function () {
    this.onSectionLoad = function (container) {
      this.$container = $(container);
      this.namespace = theme.namespaceFromSection(container); // section

      $(this.functions.assessSection.call(this));
      $(window).on('debouncedresize' + this.namespace, this.functions.assessSection.bind(this));
    };

    this.functions = {
      assessSection: function assessSection(evt) {
        if ($(window).width() >= 768) {
          // check all the rows
          $('.promotional-row').each(function () {
            var tallest = 0;
            $(this).find('.text_over_image .promotional-row__content').each(function () {
              var thisHeight = $(this).outerHeight() + 60;

              if (thisHeight > tallest) {
                tallest = thisHeight;
              }
            });
            $(this).find('.text_over_image').css('min-height', tallest);
          });
        } else {
          $('.promotional-row .text_over_image').css('min-height', '');
        }
      }
    };

    this.onSectionUnload = function () {
      this.$container.off(this.namespace);
      $(window).off(this.namespace);
    };
  }();
  ;
  /**
   * Featured Collection Section Script
   * ------------------------------------------------------------------------------
   *
   * @namespace featured-collection */

  theme.FeaturedCollection = new function () {
    var selectors = {
      slideshow: '[data-carousel-enabled]'
    };
    var breakpoint = 768;
    var resizeTimer;
    /**
     * FeaturedCollection section constructor. Runs on page load as well as Theme Editor
     * `section:load` events.
     * @param {string} container - selector for the section container DOM element
     */

    this.onSectionLoad = function (container) {
      this.$container = $(container);
      this.namespace = theme.namespaceFromSection(container);
      this.$slideshow = $(selectors.slideshow, this.$container); //Slideshow

      this.$slideshow.each(function (index, value) {
        theme.peekCarousel.init(this.$container, $(value), this.namespace, function () {
          return true;
        }, false, {
          infinite: false,
          slidesToShow: this.$slideshow.data('slides-per-row'),
          slidesToScroll: 1,
          swipeToSlide: true,
          dots: false,
          prevArrow: $('.featured-collection-controls .prev', this.$container),
          nextArrow: $('.featured-collection-controls .next', this.$container),
          responsive: [{
            breakpoint: breakpoint,
            settings: {
              slidesToShow: 1,
              nextArrow: false,
              prevArrow: false
            }
          }]
        });
      }.bind(this)); // product title height alignment

      theme.initUniformHeightMonitor(this.$container, '.product-block__image-container', '.product-block__image-container .image-one');
    };
    /**
     * Event callback for Theme Editor `section:unload` event
     */


    this.onSectionUnload = function () {
      this.$container.off(this.namespace);
      theme.destroyUniformHeightMonitor(this.$container);
      theme.peekCarousel.destroy(this.$container, this.$slideshow, this.namespace);
    };
  }();
  ;
  /**
   * List Collections Template Script
   * ------------------------------------------------------------------------------
   * A file that contains scripts highly couple code to the List Collections template.
   *
     * @namespace ListCollections
   */

  theme.ListCollections = new function () {
    /**
     * ListCollections section constructor. Runs on page load as well as Theme Editor
     * `section:load` events.
     * @param {string} container - selector for the section container DOM element
     */
    this.onSectionLoad = function (container) {
      this.$container = $(container);
      this.namespace = theme.namespaceFromSection(container); // section may contain RTE images

      theme.assessRTEImagesOnLoad(this.$container);
      /**
       * Slick ListCollections
       */

      $('.js-list-collection-slider', this.$container).each(function (index, value) {
        theme.peekCarousel.init(this.$container, $(value), this.namespace, function () {
          return true;
        }, false, {
          infinite: true,
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: false,
          prevArrow: $(value).siblings('.standout-collection-slider__controls').children('.prev'),
          nextArrow: $(value).siblings('.standout-collection-slider__controls').children('.next'),
          responsive: [{
            breakpoint: 768,
            settings: {
              slidesToShow: 1
            }
          }]
        });
      }.bind(this));
    };
    /**
     * Event callback for Theme Editor `section:unload` event
     */


    this.onSectionUnload = function () {
      this.$container.off(this.namespace);
      theme.peekCarousel.destroy(this.$container, $('.js-list-collection-slider', this.$container), this.namespace);
    };
  }();
  ;
  /**
   * Collection Template Script
   * ------------------------------------------------------------------------------
   * For collection pages
   *
   * @namespace collection-template
   */

  theme.CollectionTemplate = new function () {
    /**
     * CollectionTemplate section constructor. Runs on page load as well as Theme Editor
     * `section:load` events.
     * @param {string} container - selector for the section container DOM element
     */
    this.onSectionLoad = function () {
      this.productList = document.querySelector('.cc-product-list'); // Product title height alignment

      theme.initUniformHeightMonitor(this.productList, '.product-block__image-container', '.product-block__image-container .image-one');
    };
    /**
     * Event callback for Theme Editor `section:unload` event
     */


    this.onSectionUnload = function () {
      theme.destroyUniformHeightMonitor(this.productList);
    };
  }();
  /**
   * Cart Template Script
   * ------------------------------------------------------------------------------
   *
     * @namespace cart
   */

  theme.Cart = new function () {
    /**
     * Cart section constructor. Runs on page load as well as Theme Editor
     * `section:load` events.
     * @param {string} container - selector for the section container DOM element
     */
    this.onSectionLoad = function (container) {
      this.$container = $(container);
      this.namespace = theme.namespaceFromSection(container); // toggle shipping estimates

      this.$container.on('click' + this.namespace, '.js-shipping-calculator-trigger', function () {
        var $this = $(this);
        var $parent = $this.parents('.shipping-calculator-container');
        $parent.toggleClass('calculator-open');

        if ($parent.hasClass('calculator-open')) {
          $this.html(theme.strings.cart_shipping_calculator_hide_calculator);
          $parent.children('.shipping-calculator').slideDown(250);
        } else {
          $this.html(theme.strings.cart_shipping_calculator_title);
          $parent.children('.shipping-calculator').slideUp(250);
        }
      }); // toggle notes

      this.$container.on('click' + this.namespace, '.js-cart-notes-trigger', function () {
        var $this = $(this);
        var $parent = $this.parent('.cart-notes-container');
        $parent.toggleClass('notes-open');

        if ($parent.hasClass('notes-open')) {
          $this.html(theme.strings.cart_general_hide_note);
          $parent.children('.cart-notes').slideDown(250);
        } else {
          $this.html(theme.strings.cart_general_show_note);
          $parent.children('.cart-notes').slideUp(250);
        }
      });
      theme.cartNoteMonitor.load($('.cart-notes [name="note"]', this.$container)); // quantity adjustment

      if (this.$container.data('ajax-update')) {
        var updateCartFunction = this.functions.updateCart.bind(this);
        this.$container.on('keyup' + this.namespace + ' change' + this.namespace, '.quantity__change input', function () {
          if ($(this).data('initial-value') && $(this).data('initial-value') == $(this).val()) {
            return;
          }

          if ($(this).val().length == 0 || $(this).val() == '0') {
            return;
          }

          var inputId = $(this).attr('id');
          updateCartFunction({
            line: $(this).data('line'),
            quantity: $(this).val()
          }, function () {
            // set focus inside input that changed
            $('#' + inputId).focus();
          });
          $(this).data('previousValue', $(this).val());
        });
        this.$container.on('click' + this.namespace, '.quantity__minus, .quantity__plus', function (e) {
          var $input = $(this).closest('.quantity__change').find('.quantity__number');

          if ($(this).hasClass('quantity__minus')) {
            $input.val(parseInt($input.val()) - 1).trigger('change');
          } else {
            $input.val(parseInt($input.val()) + 1).trigger('change');
          }

          return false;
        });
      } // select contents on focus


      this.$container.on('focusin' + this.namespace + ' click' + this.namespace, 'input.quantity__number', function () {
        $(this).select();
      }).on('mouseup' + this.namespace, 'input.quantity__number', function (e) {
        e.preventDefault(); //Prevent mouseup killing select()
      }); // terms and conditions checkbox

      if ($('#terms', container).length > 0) {
        $(document).on('click' + this.namespace, '[name="checkout"], a[href*="/checkout"]', function () {
          if ($('#terms:checked').length == 0) {
            alert(theme.strings.cartTermsNotChecked);
            return false;
          }
        });
      } // recently viewed


      this.$recentlyViewed = $('.recently-viewed', this.$container);

      if (this.$recentlyViewed.length) {
        this.functions.loadRecentlyViewed.bind(this)();
        theme.loadRecentlyViewed(this.$recentlyViewed);
      }
    };

    this.functions = {
      /**
      * Display recently viewed products, minus products in the cart
      */
      loadRecentlyViewed: function loadRecentlyViewed(evt) {
        if (theme.storageAvailable('localStorage')) {
          // grab current value and parse
          var recentDisplayCount = 6;
          var existingArr = theme.getRecentProducts();

          if (existingArr.length) {
            // remove in-cart items from row
            var handlesToExcludeValue = this.$recentlyViewed.data('exclude');
            var handlesToExclude = [];

            if (handlesToExcludeValue.length) {
              handlesToExclude = handlesToExcludeValue.split(',');
            } // show the products


            var $recentlyViewedBucket = this.$recentlyViewed.find('.grid'),
                count = 0,
                iterator = 0,
                showVendor = this.$recentlyViewed.data('show-vendor'),
                showHoverImage = this.$recentlyViewed.data('show-hover-image');

            while (count < recentDisplayCount && iterator < existingArr.length) {
              var showThis = true; // skip those in the excluded-list

              for (var i = 0; i < handlesToExclude.length; i++) {
                if (existingArr[iterator].handle == handlesToExclude[i]) {
                  showThis = false;
                  break;
                }
              }

              if (showThis) {
                count++;
                theme.addRecentProduct(existingArr, iterator, $recentlyViewedBucket, showHoverImage, showVendor);
              }

              iterator++;
            } // reveal container, if anything to show


            if (count > 0) {
              this.$recentlyViewed.removeClass('hidden');
            }
          }
        }
      },

      /**
      * Function for changing the cart and updating the page
      */
      updateCart: function updateCart(params, successCallback) {
        var _ = this;

        if (_.cartXhr) {
          _.cartXhr.abort();
        }

        if (_.cartRefreshXhr) {
          _.cartRefreshXhr.abort();
        }

        _.cartXhr = $.ajax({
          type: 'POST',
          url: theme.routes.cart_change_url + '.js',
          data: params,
          dataType: 'json',
          success: function success(data) {
            if (_.cartRefreshXhr) {
              _.cartRefreshXhr.abort();
            } // fetch new html for the page


            _.cartRefreshXhr = $.ajax({
              type: 'GET',
              url: theme.routes.cart_url + '?sections=main-cart',
              success: function success(data) {
                var toReplace = ['.cart-items', '.subtotal-row'];
                var $newDom = $(data['main-cart']);
                $newDom.find('.fade-in').removeClass('fade-in');

                for (var i = 0; i < toReplace.length; i++) {
                  $('[data-section-type="cart"] ' + toReplace[i]).html($newDom.find(toReplace[i]).html());
                }

                successCallback();
              },
              error: function error(data) {
                if (data.statusText != 'abort') {
                  console.log('Error refreshing page');
                  console.log(data);
                }
              },
              complete: function complete() {
                _.cartRefreshXhr = null;
              }
            });
          },
          error: function error(data) {
            console.log('Error processing update');
            console.log(data);
          }
        });
      }
    };
    /**
     * Event callback for Theme Editor `section:unload` event
     */

    this.onSectionUnload = function () {
      this.$container.off(this.namespace);
      $(document).off(this.namespace);

      if (this.$recentlyViewed.length) {
        theme.unloadRecentlyViewed(this.$recentlyViewed);
      }

      theme.cartNoteMonitor.unload($('.cart-notes [name="note"]', this.$container));
    };
  }();
  ;
  theme.ImageWithText = new function () {
    /**
     * ImageWithText section constructor. Runs on page load as well as Theme Editor
     * `section:load` events.
     * @param {string} container - selector for the section container DOM element
     */
    this.onSectionLoad = function (container) {
      this.namespace = theme.namespaceFromSection(container);
      this.$container = $(container);
      this.$imageContainer = $('.image-with-text__image', container);
      this.$image = $('.image-with-text__image .rimage__image', container);
      this.$text = $('.image-with-text__content', container);
      /**
       * Ensure image either fills height or is inset
       */

      function assessImage(evt) {
        var imageRatio = this.$image.height() / this.$image.width();
        var imageHeightWithoutInset = this.$imageContainer.outerWidth() * imageRatio;
        this.$imageContainer.toggleClass('image-with-text__image--inset', imageHeightWithoutInset < this.$text.outerHeight());
      }

      $(window).on('debouncedresize' + this.namespace, assessImage.bind(this));
      $(assessImage.call(this));
    };
    /**
     * Event callback for Theme Editor `section:unload` event
     */


    this.onSectionUnload = function () {
      $(window).off(this.namespace);
    };
  }();
  ;
  /**
   * FeaturedProduct Section Script
   * ------------------------------------------------------------------------------
   *
   * @namespace FeaturedProduct
   */

  theme.FeaturedProduct = new function () {
    /**
     * FeaturedProduct section constructor. Runs on page load as well as Theme Editor
     * `section:load` events.
     * @param {string} container - selector for the section container DOM element
     */
    this.onSectionLoad = function (container) {
      this.namespace = theme.namespaceFromSection(container);
      this.$container = $(container);
      this.$row = $('.featured-product-section', container);
      this.$imageOuterContainer = $('.featured-product-image', container);
      this.$mediaContainer = $('.featured-product-image-link, .product-media-wrapper', container);
      this.$media = $('.product-media', container);

      if (this.$media.length) {
        theme.ProductMedia.init(this.$container);
      }

      $(window).on('debouncedresize' + this.namespace, this.functions.assessInset.bind(this));
      $(this.functions.assessInset.call(this));
    };

    this.functions = {
      /**
       * Ensure image either fills height or is inset
       */
      assessInset: function assessInset(evt) {
        var imageRatio = this.$mediaContainer.height() / this.$mediaContainer.width();
        var imageHeightWithoutInset = Math.round(this.$imageOuterContainer.outerWidth() * imageRatio);
        this.$imageOuterContainer.toggleClass('featured-product-image--inset', imageHeightWithoutInset < this.$row.height());
      }
    };
    /**
     * Event callback for Theme Editor `section:unload` event
     */

    this.onSectionUnload = function () {
      if (this.$media.length) {
        theme.ProductMedia.destroy(this.$container);
      }

      $(window).off(this.namespace);
    };
  }();
  ;
  /**
   * RecentlyViewed Template Script
   * ------------------------------------------------------------------------------
   * A file that contains scripts highly couple code to the RecentlyViewed template.
   *
     * @namespace recently-viewed
   */

  theme.RecentlyViewed = new function () {
    var selectors = {
      recentlyViewed: '.recently-viewed'
    };
    /**
     * RecentlyViewed section constructor. Runs on page load as well as Theme Editor
     * `section:load` events.
     * @param {string} container - selector for the section container DOM element
     */

    this.onSectionLoad = function (container) {
      this.$container = $(container);
      this.namespace = theme.namespaceFromSection(container);
      this.$recentlyViewed = $(selectors.recentlyViewed, this.$container);

      if (this.$recentlyViewed.length) {
        this.functions.loadRecentlyViewed.bind(this)();
        theme.loadRecentlyViewed(this.$recentlyViewed);
      }
    };

    this.functions = {
      /**
       * Display recently viewed products, and add this page to it
       */
      loadRecentlyViewed: function loadRecentlyViewed(evt) {
        // feature usability detect
        if (theme.storageAvailable('localStorage')) {
          var recentDisplayCount = 6;
          var recentProductData = {
            handle: this.$recentlyViewed.data('handle'),
            url: this.$recentlyViewed.data('url').split('?')[0],
            title: this.$recentlyViewed.data('title'),
            vendor: this.$recentlyViewed.data('vendor'),
            available: this.$recentlyViewed.data('available'),
            image: this.$recentlyViewed.data('image'),
            image2: this.$recentlyViewed.data('image2'),
            price: this.$recentlyViewed.data('price'),
            priceVaries: this.$recentlyViewed.data('price-varies'),
            compareAtPrice: this.$recentlyViewed.data('price-compare')
          };

          if (this.$recentlyViewed.data('unit-price-price')) {
            recentProductData.unitPrice = this.$recentlyViewed.data('unit-price-price');
            recentProductData.unitPriceUnit = this.$recentlyViewed.data('unit-price-unit');
          }

          var existingArr = theme.addToAndReturnRecentProducts(recentProductData); // check each recent product, excluding one just added

          if (existingArr.length > 1) {
            var $recentlyViewedBucket = this.$recentlyViewed.removeClass('hidden').find('.grid');
            var showVendor = this.$recentlyViewed.data('show-vendor');
            var showHoverImage = this.$recentlyViewed.data('show-hover-image'),
                rangeStart = Math.max(0, existingArr.length - recentDisplayCount - 1),
                rangeEnd = existingArr.length - 1;

            for (var i = rangeStart; i < rangeEnd; i++) {
              theme.addRecentProduct(existingArr, i, $recentlyViewedBucket, showHoverImage, showVendor);
            }
          }
        }
      }
    };
    /**
     * Event callback for Theme Editor `section:unload` event
     */

    this.onSectionUnload = function () {
      if (this.$recentlyViewed.length) {
        theme.unloadRecentlyViewed(this.$recentlyViewed);
      }
    };
  }();
  ;
  /**
   * Search Template Script
   * ------------------------------------------------------------------------------
   * For search results page
   *
   * @namespace search-template
   */

  theme.SearchTemplate = new function () {
    var selectors = {
      productsContainer: '.search-results-list'
    };
    /**
     * Search section constructor. Runs on page load as well as Theme Editor
     * `section:load` events.
     * @param {string} container - selector for the section container DOM element
     */

    this.onSectionLoad = function (container) {
      this.$container = $(container);
      this.namespace = theme.namespaceFromSection(container); // product title height alignment

      this.$productsContainer = $(selectors.productsContainer, container);
      theme.initUniformHeightMonitor(this.$productsContainer, '.product-block__image-container', '.product-block__image-container .image-one');
    };
    /**
     * Event callback for Theme Editor `section:unload` event
     */


    this.onSectionUnload = function () {
      this.$container.off(this.namespace);
      $(window).off(this.namespace);
      theme.destroyUniformHeightMonitor(this.$productsContainer);
    };
  }();
  /**
   * Testimonials Section Script
   * ------------------------------------------------------------------------------
   *
   * @namespace Testimonials
   */

  theme.Testimonials = new function () {
    /**
     * Testimonials section constructor. Runs on page load as well as Theme Editor
     * `section:load` events.
     * @param {string} container - selector for the section container DOM element
     */
    this.onSectionLoad = function (container) {
      this.$container = $(container);
      this.namespace = theme.namespaceFromSection(container);
      this.$slideshow = $('.js-testimonials-section', this.$container);
      /**
       * Testimonials slick slideshow
       */

      var breakpoint = 768;
      var count = false;

      if (this.$slideshow.children().length > 2) {
        var count = true;
      }

      if (this.$slideshow.children().length > 1) {
        var mobileCount = true;
      }

      this.$slideshow.slick({
        infinite: true,
        slidesToShow: 2,
        slidesToScroll: 1,
        dots: count,
        adaptiveHeight: false,
        autoplay: this.$slideshow.data('autoplay'),
        autoplaySpeed: this.$slideshow.data('autoplayspeed'),
        arrows: false,
        responsive: [{
          breakpoint: breakpoint,
          settings: {
            slidesToShow: 1,
            dots: mobileCount
          }
        }]
      });
      $(window).on('debouncedresize' + this.namespace, this.functions.onResize.bind(this));
    };

    this.functions = {
      /**
       * Event callback for window resize
       */
      onResize: function onResize(evt) {
        // fix slick bug where height does not adapt to content height on resize
        this.$slideshow.slick('setPosition');
      }
    };
    /**
     * Event callback for Theme Editor `shopify:block:select` event
     */

    this.onBlockSelect = function (block) {
      this.$slideshow.slick('slickGoTo', $(block).data('slick-index'), true).slick('slickPause');
    };
    /**
     * Event callback for Theme Editor `shopify:block:deselect` event
     */


    this.onBlockDeselect = function (block) {
      this.$slideshow.slick('slickPlay');
    };
    /**
     * Event callback for Theme Editor `section:unload` event
     */


    this.onSectionUnload = function () {
      this.$container.off(this.namespace);
      $(window).off(this.namespace);
      this.$slideshow.slick('unslick');
    };
  }();
  ;
  /**
   * Gallery Section Script
   * ------------------------------------------------------------------------------
   *
   * @namespace gallery */

  theme.Gallery = new function () {
    var selectors = {
      slideshow: '.gallery--mobile-carousel'
    };
    var breakpoint = 768;
    var resizeTimer;
    /**
     * Gallery section constructor. Runs on page load as well as Theme Editor
     * `section:load` events.
     * @param {string} container - selector for the section container DOM element
     */

    this.onSectionLoad = function (container) {
      this.$container = $(container);
      this.namespace = theme.namespaceFromSection(container); //Slideshow

      $slideshow = $(selectors.slideshow, this.$container);

      if ($slideshow.length) {
        var assessCarouselFunction = function assessCarouselFunction() {
          var isCarousel = $slideshow.hasClass('slick-slider'),
              shouldShowCarousel = $(window).width() < breakpoint;

          if (!shouldShowCarousel) {
            $('.lazyload--manual', $slideshow).removeClass('lazyload--manual').addClass('lazyload');
          }

          if (isCarousel && !shouldShowCarousel) {
            // Destroy carousel
            // - unload slick
            $slideshow.slick('unslick').off('init');
            $slideshow.find('a, .gallery__item').removeAttr('tabindex').removeAttr('role'); // - re-row items

            var rowLimit = $slideshow.data('grid');
            var $currentRow = null;
            $slideshow.find('.gallery__item').each(function (index) {
              if (index % rowLimit === 0) {
                $currentRow = $('<div class="gallery__row">').appendTo($slideshow);
              }

              $(this).appendTo($currentRow);
            });
          } else if (!isCarousel && shouldShowCarousel) {
            // Create carousel
            // - de-row items
            $slideshow.find('.gallery__item').appendTo($slideshow);
            $slideshow.find('.gallery__row').remove(); // - init carousel

            $slideshow.on('init', function () {
              $('.lazyload--manual', this).removeClass('lazyload--manual').addClass('lazyload');
            }).slick({
              autoplay: false,
              fade: false,
              infinite: true,
              useTransform: true,
              dots: true,
              prevArrow: $('.gallery-slideshow-controls .prev', this.$container),
              nextArrow: $('.gallery-slideshow-controls .next', this.$container)
            });
          }
        };

        assessCarouselFunction();
        $(window).on('debouncedresize.themeSection' + this.$container, assessCarouselFunction);
      }
    };
    /**
    * Event callback for Theme Editor `section:unload` event
    */


    this.onSectionUnload = function () {
      this.$container.off(this.namespace);
      $(window).off(this.namespace);
      $('.slick-slider', this.$container).each(function () {
        $(this).slick('unslick').off('init');
      });
    };

    this.onBlockSelect = function (block) {
      $(block).closest('.slick-slider').each(function () {
        $(this).slick('slickGoTo', $(this).data('slick-index')).slick('slickPause');
      });
    };

    this.onBlockDeselect = function (block) {
      $(block).closest('.slick-slider').each(function () {
        $(this).slick('slickPlay');
      });
    };
  }();
  ;
  /*================ Templates ================*/

  /**
   * Customer Addresses Script
   * ------------------------------------------------------------------------------
   * A file that contains scripts highly couple code to the Customer Addresses
   * template.
   *
   * @namespace customerAddresses
   */

  theme._initCustomerAddressCountryDropdown = function () {
    // Initialize each edit form's country/province selector
    new Shopify.CountryProvinceSelector('AddressCountryNew', 'AddressProvinceNew', {
      hideElement: 'AddressProvinceContainerNew'
    });

    if ($('#AddressCountryNew-modal').length) {
      new Shopify.CountryProvinceSelector('AddressCountryNew-modal', 'AddressProvinceNew-modal', {
        hideElement: 'AddressProvinceContainerNew-modal'
      });
    }

    $('.address-country-option').each(function () {
      var formId = $(this).data('form-id');
      var countrySelector = 'AddressCountry_' + formId;
      var provinceSelector = 'AddressProvince_' + formId;
      var containerSelector = 'AddressProvinceContainer_' + formId;
      new Shopify.CountryProvinceSelector(countrySelector, provinceSelector, {
        hideElement: containerSelector
      });
    });
  };

  theme._setupCustomAddressModal = function () {
    var suffix = '-modal';
    $('.lightbox-content form, .lightbox-content input[id], .lightbox-content select[id], .lightbox-content div[id]').each(function () {
      $(this).attr('id', $(this).attr('id') + suffix);
    });
    $('.lightbox-content label[for]').each(function () {
      $(this).attr('for', $(this).attr('for') + suffix);
    });
    $('.lightbox-content .address-country-option').each(function () {
      var formId = $(this).data('form-id') + suffix;
      $(this).attr('data-form-id', formId).data('form-id', formId);
    });

    theme._initCustomerAddressCountryDropdown();
  };

  theme.customerAddresses = function () {
    var $newAddressForm = $('#AddressNewForm');

    if (!$newAddressForm.length) {
      return;
    } // Initialize observers on address selectors, defined in shopify_common.js


    if (Shopify) {
      theme._initCustomerAddressCountryDropdown();
    } // Toggle new/edit address forms


    $('.address-new-toggle').on('click', function () {
      $.colorbox({
        transition: 'fade',
        html: '<div class="lightbox-content">' + $newAddressForm.html() + '</div>',
        onComplete: theme._setupCustomAddressModal
      });
      return false;
    });
    $('.address-edit-toggle').on('click', function () {
      var formId = $(this).data('form-id');
      $.colorbox({
        transition: 'fade',
        html: '<div class="lightbox-content">' + $('#EditAddress_' + formId).html() + '</div>',
        onComplete: theme._setupCustomAddressModal
      });
      return false;
    });
    $('.address-delete').on('click', function () {
      var $el = $(this);
      var formId = $el.data('form-id');
      var confirmMessage = $el.data('confirm-message');

      if (confirm(confirmMessage || 'Are you sure you wish to delete this address?')) {
        Shopify.postLink(theme.routes.account_addresses_url + '/' + formId, {
          parameters: {
            _method: 'delete'
          }
        });
      }
    }); // show lightbox if error inside

    if ($('#AddressNewForm .errors').length) {
      $('.address-new-toggle').click();
    }

    if ($('.grid .address-card .errors').length) {
      $('.grid .address-card .errors').first().closest('.address-card').find('.address-edit-toggle').click();
    }
  }();

  ;
  /**
   * Password Template Script
   * ------------------------------------------------------------------------------
   * A file that contains scripts highly couple code to the Password template.
   *
   * @namespace password
   */

  theme.customerLogin = function () {
    var selectors = {
      recoverPasswordForm: '#RecoverPassword',
      hideRecoverPasswordLink: '#HideRecoverPasswordLink'
    };
    $(document).on('click', selectors.recoverPasswordForm, onShowHidePasswordForm);
    $(document).on('click', selectors.hideRecoverPasswordLink, onShowHidePasswordForm);

    function onShowHidePasswordForm(evt) {
      evt.preventDefault();
      toggleRecoverPasswordForm($(this).closest('.container'));
    }
    /**
     *  Show/Hide recover password form
     */


    function toggleRecoverPasswordForm(container) {
      $('[id=RecoverPasswordForm]', container).toggleClass('hide');
      $('[id=CustomerLoginForm]', container).toggleClass('hide');
    } // if on login page, check for past form submission


    if ($(selectors.recoverPasswordForm).length) {
      var checkUrlHash = function checkUrlHash() {
        var hash = window.location.hash; // Allow deep linking to recover password form

        if (hash === '#recover') {
          toggleRecoverPasswordForm(null);
        }
      };
      /**
       *  Show reset password success message
       */


      var resetPasswordSuccess = function resetPasswordSuccess() {
        var $formState = $('.reset-password-success'); // check if reset password form was successfully submited.

        if (!$formState.length) {
          return;
        } // show success message


        $('#ResetSuccess').removeClass('hide');
      };

      checkUrlHash();
      resetPasswordSuccess();
    }
  }();

  ;

  theme.initUniformHeightMonitor = function (container, paramWrapperSelector, paramInnerSelector) {
    if (theme.settings.uniformProductGridImagesEnabled) {
      $(container).addClass('uhm-active').data('uhm-callback', function (wrapperSelector, innerSelector) {
        var tallest = 0,
            $items = $(wrapperSelector, this),
            $inners = $(innerSelector, this);
        $inners.each(function () {
          var height = $(this).height();

          if (height > tallest) {
            tallest = height;
          }
        });
        $items.css('height', Math.ceil(tallest) + 'px');
      }.bind(container, paramWrapperSelector, paramInnerSelector));
      $(container).data('uhm-callback')();
      $(window).on('debouncedresize', $(container).data('uhm-callback'));
    }
  };

  theme.destroyUniformHeightMonitor = function (container) {
    if (theme.settings.uniformProductGridImagesEnabled) {
      $(container).each(function () {
        $(window).off('debouncedresize', $(this).data('uhm-callback'));
      }).removeClass('uhm-active');
    }
  };

  theme.icons = {
    close: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
    slideshowPrevArrow: '<button class="slick-prev" aria-label="' + theme.strings.previous + '"><svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg></button>',
    slideshowNextArrow: '<button class="slick-next" aria-label="' + theme.strings.next + '"><svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg></button>'
  };

  theme.openPageContentInLightbox = function (url) {
    $.get(url, function (data) {
      var $content = $('#MainContent', $.parseHTML('<div>' + data + '</div>'));
      $.colorbox({
        transition: 'fade',
        html: '<div class="lightbox-content">' + $content.html() + '</div>',
        onComplete: function onComplete() {
          // check any new inputs
          $('#cboxContent .input-wrapper input').trigger('inputstateEmpty');
          $('#cboxContent input[data-desktop-autofocus]').focus();
        }
      });
    });
  };

  theme.styleVariantSelectors = function ($els, data, inLightbox) {
    var $clickies = $els.filter(function () {
      return typeof $(this).data('listed') != 'undefined';
    });
    $clickies.each(function () {
      // list options out, bound to the original dropdown
      $(this).clickyBoxes(); // change swatch label on hover

      var $label = $(this).closest('.selector-wrapper').find('.variant-option-title');

      if ($label.length) {
        $label.data('default-content', $label.html());
        $(this).siblings('.clickyboxes').on('change', function () {
          $label.data('default-content', $(this).find('a.active').data('value'));
        }).on('mouseenter', 'a', function () {
          $label.html($(this).data('value'));
        }).on('mouseleave', 'a', function () {
          $label.html($label.data('default-content'));
        });
      }
    }); // If we have clicky-boxes, add the disabled-state to options that have no valid variants

    if ($clickies.length > 0) {
      // each option
      for (var optionIndex = 0; optionIndex < data.options.length; optionIndex++) {
        // list each value for this option
        var optionValues = {};

        for (var variantIndex = 0; variantIndex < data.variants.length; variantIndex++) {
          var variant = data.variants[variantIndex];

          if (typeof optionValues[variant.options[optionIndex]] === 'undefined') {
            optionValues[variant.options[optionIndex]] = false;
          } // mark true if an option is available


          if (variant.available) {
            optionValues[variant.options[optionIndex]] = true;
          }
        } // mark any completely unavailable options


        for (var key in optionValues) {
          if (!optionValues[key]) {
            $($els[optionIndex]).siblings('.clickyboxes').find('li a').filter(function () {
              return $(this).attr('data-value') == key;
            }).addClass('unavailable');
          }
        }
      }
    } // dropdowns


    $els.not($clickies).each(function () {
      // apply select2 to dropdown
      var config = {};

      if (inLightbox) {
        config.dropdownParent = $('#cboxWrapper');
      }

      theme.select2.init($(this), config);
    });

    if (inLightbox) {
      $.colorbox.resize();
    }
  };

  theme.select2 = {
    init: function init($els, config) {
      var standardSelectOptions = {
        minimumResultsForSearch: Infinity
      };
      var swatchSelectOptions = {
        minimumResultsForSearch: Infinity,
        templateResult: theme.select2.swatchSelect2OptionTemplate,
        templateSelection: theme.select2.swatchSelect2OptionTemplate
      };

      if (typeof config !== 'undefined') {
        standardSelectOptions = $.extend(standardSelectOptions, config);
        swatchSelectOptions = $.extend(swatchSelectOptions, config);
      }

      $els.each(function () {
        $(this).select2($(this).data('colour-swatch') ? swatchSelectOptions : standardSelectOptions);
      });
    },
    swatchSelect2OptionTemplate: function swatchSelect2OptionTemplate(state) {
      if (state.id) {
        var colourKey = removeDiacritics(state.id).toLowerCase().replace(/'/g, '').replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/-*$/, '');
        return $(['<div class="swatch-option">', '<span class="swatch-option__nugget bg-', colourKey, '"></span>', '<span class="swatch-option__label">', state.text, '</span>', '</div>'].join(''));
      } else {
        return $(['<div class="swatch-option swatch-option--all">', '<span class="swatch-option__label">', state.text, '</span>', '</div>'].join(''));
      }
    }
  };

  theme.namespaceFromSection = function (container) {
    return ['.', $(container).data('section-type'), $(container).data('section-id')].join('');
  }; // global helpers for the docked nav


  theme.dockedNavDesktopMinWidth = 768;

  theme.dockedNavHeight = function () {
    if ($(window).width() >= theme.dockedNavDesktopMinWidth) {
      if ($('.docked-navigation-container').length) {
        return $('.docked-navigation-container__inner').height();
      }
    } else {
      if ($('.docked-mobile-navigation-container').length) {
        return $('.docked-mobile-navigation-container__inner').height();
      }
    }

    return 0;
  }; // Calculate accent colour height


  theme.resizeAccent = function () {
    var accentHeight = 0;
    var $firstSection = $('.accent-background').next();

    if ($firstSection.length) {
      var $marginTop = parseInt($firstSection.css('margin-top'));

      if ($firstSection[0].id === 'shopify-section-banner') {
        // If banner element is empty
        if (!$firstSection.children().length && !$firstSection.text().trim().length) {
          $firstSection = $firstSection.next();
        }
      }

      if ($firstSection.find('.sticky-element').length) {
        accentHeight = Math.round($firstSection.find('.sticky-element').outerHeight() / 2 + $marginTop);
      } else {
        accentHeight = Math.round($firstSection.outerHeight() / 2 + $marginTop);
      }

      $('.accent-background').css('height', accentHeight);
    } else {
      accentHeight = '';
    }

    $('.accent-background').css('height', accentHeight);
  }; // peeking carousels UI


  theme.peekCarousel = {
    init: function init($container, $slideshows, globalNamespace, useCarouselCheckFn, removeClasses, slickConfig) {
      theme.peekCarousel._checkAdvice($container);

      var data = {
        $slideshows: $slideshows,
        useCarouselCheckFn: useCarouselCheckFn,
        removeClasses: removeClasses,
        slickConfig: _typeof(slickConfig) == 'object' ? slickConfig : {
          infinite: false,
          slidesToShow: 1,
          slidesToScroll: 1,
          swipeToSlide: true,
          dots: false,
          arrows: false
        }
      };

      theme.peekCarousel._assess.bind(data)();

      $(window).on('debouncedresize' + globalNamespace, theme.peekCarousel._assess.bind(data));
      $('.product-carousel-peek__advice', $container).on('click', function () {
        $(this).closest('.product-carousel-peek').find('.slick-initialized').slick('slickNext').trigger('dismissAdvice');
      });
    },
    destroy: function destroy($container, $slideshows, globalNamespace) {
      if ($slideshows.hasClass('slick-initialized')) {
        $slideshows.slick('unslick').off('swipe dismissAdvice afterChange init');
      }

      $(window).off('debouncedresize' + globalNamespace, theme.peekCarousel._assess);
      $('.product-carousel-peek__advice', $container).off('click');
    },
    _assess: function _assess() {
      for (var i = 0; i < this.$slideshows.length; i++) {
        var $slideshow = $(this.$slideshows[i]);

        if (this.useCarouselCheckFn()) {
          if (!$slideshow.hasClass('slick-initialized')) {
            // stow away the original classes
            if (this.removeClasses) {
              $slideshow.children().each(function () {
                $(this).data('peekOriginalClassName', this.className);
                this.className = '';
              });
            } // note when singular or empty


            if ($slideshow.children().length == 0) {
              $slideshow.closest('.product-carousel-peek').addClass('product-carousel-peek--empty');
            }

            if ($slideshow.children().length == 1) {
              $slideshow.closest('.product-carousel-peek').addClass('product-carousel-peek--single');
            } // fetch lazy-loaded products


            $slideshow.on('afterChange init', theme.peekCarousel._lazyLoadProduct); // turn into slideshow

            $slideshow.slick(this.slickConfig).on('swipe dismissAdvice', theme.peekCarousel._dismissAdviceOnSlickSwipe);
          }
        } else {
          if ($slideshow.hasClass('slick-initialized')) {
            // destroy slideshow
            $slideshow.slick('unslick').off('swipe dismissAdvice afterChange'); // restore original class names

            if (this.removeClasses) {
              $slideshow.children().each(function () {
                this.className = $(this).data('peekOriginalClassName');
              });
            }
          }

          ;
        }
      }
    },
    _checkAdvice: function _checkAdvice(container) {
      if ($.cookie('theme.boost.dismissPeekAdvice') != '1') {
        $('.product-carousel-peek', container).addClass('product-carousel-peek--show-advice');
      }
    },
    _dismissAdvice: function _dismissAdvice() {
      $.cookie('theme.boost.dismissPeekAdvice', '1', {
        expires: 7,
        path: '/',
        domain: window.location.hostname
      });
      $('.product-carousel-peek').addClass('product-carousel-peek--dismiss-advice');
    },
    _dismissAdviceOnSlickSwipe: function _dismissAdviceOnSlickSwipe(evt, slick) {
      theme.peekCarousel._dismissAdvice();

      $(this).off('swipe');
    },
    _lazyLoadProduct: function _lazyLoadProduct(evt, slick) {
      var data = this;
      slick.$slides.filter('[data-lazy-product-url]').filter(function () {
        return $(this).hasClass('slick-active') || $(this).prev().hasClass('slick-active');
      }).each(function () {
        var $this = $(this);
        $.get($(this).data('lazy-product-url') + '?sections=product-block', function (response) {
          $this.html($(response['product-block']).children().html()); // realign product titles after grid update

          if (theme.settings.uniformProductGridImagesEnabled) {
            var $uhmContainer = $this.closest('.uhm-active');

            if ($uhmContainer.length) {
              $uhmContainer.data('uhm-callback')();
            }
          }
        });
        $this.removeAttr('data-lazy-product-url');
      });
    }
  }; // makes a lot of assumptions about tabindex use
  // 1. we want to prevent the actual slide being a tab target, so there are other controls to use
  // 2. anything could be in a slide
  // 3. plyr does not use tabindex for anything
  // 4. model-viewer has 'tabindex="-1"' in its default paused state, applied by the model viewer ui

  theme.productGallerySlideshowTabFix = function (slides, current) {
    $(slides[current]).attr('tabindex', '-1').find('[tabindex]').each(function () {
      $(this).attr('tabindex', '0');
      $(this).filter('model-viewer').attr('tabindex', '-1'); // assume model is not playing now
    });
    $(slides).not(slides[current]).attr('tabindex', '-1').find('a, input, select, textarea, button, iframe, video, model-viewer, [tabindex]').each(function () {
      $(this).attr('tabindex', '-1');
    });
  };

  $(function () {
    // Common a11y fixes
    slate.a11y.pageLinkFocus($(window.location.hash));
    $('.in-page-link').on('click', function (evt) {
      slate.a11y.pageLinkFocus($(evt.currentTarget.hash));
    }); // Enable focus style when using tab

    $(document).on('keyup.themeTabCheck', function (evt) {
      if (evt.keyCode === 9) {
        $('body').addClass('tab-used');
        $(document).off('keyup.themeTabCheck');
      }
    }); // Target tables to make them scrollable

    var tableSelectors = '.rte table';
    slate.rte.wrapTable({
      $tables: $(tableSelectors),
      tableWrapperClass: 'rte__table-wrapper'
    }); // Target iframes to make them responsive

    var iframeSelectors = '.rte iframe[src*="youtube.com/embed"],' + '.rte iframe[src*="player.vimeo"]';
    slate.rte.wrapIframe({
      $iframes: $(iframeSelectors),
      iframeWrapperClass: 'rte__video-wrapper'
    }); // Apply a specific class to the html element for browser support of cookies.

    if (slate.cart.cookiesEnabled()) {
      document.documentElement.className = document.documentElement.className.replace('supports-no-cookies', 'supports-cookies');
    } // Input state: empty


    $(document).on('change focusout inputstateEmpty', '.input-wrapper input, .input-wrapper textarea', function () {
      $(this).closest('.input-wrapper').toggleClass('is-empty', $(this).val().length == 0);
    }); // Input state: focus

    $(document).on('focusin focusout', '.input-wrapper input, .input-wrapper textarea', function (evt) {
      $(this).closest('.input-wrapper').toggleClass('in-focus', evt.type == 'focusin');
    }); // Input state: check on section load

    $(document).on('shopify:section:load', function () {
      $('.input-wrapper input, .input-wrapper textarea').trigger('inputstateEmpty');
    }); // Input state: html5 autofocus - focussed before dom ready

    $('.input-wrapper input:focus, .input-wrapper textarea:focus').closest('.input-wrapper').addClass('in-focus'); // Input state: check empty now

    $('.input-wrapper input, .input-wrapper textarea').trigger('inputstateEmpty');
    $('.input-wrapper input, .input-wrapper textarea').on('animationstart', function (e) {
      if (e.originalEvent.animationName == 'onAutoFillStart') {
        $(this).closest('.input-wrapper').removeClass('is-empty');
      } else if (e.originalEvent.animationName == 'onAutoFillCancel') {
        $(this).trigger('inputstateEmpty');
      }
    }); // focus on some inputs on page load, on desktop

    if ($(window).width() > 1024) {
      $('input[data-desktop-autofocus]').focus();
    } // Tabs


    $(document).on('click assess', '.tabs a', function (evt) {
      // active class
      $(this).addClass('tab--active').closest('ul').find('.tab--active').not(this).removeClass('tab--active'); // hide inactive content

      $(this).closest('li').siblings().find('a').each(function () {
        $($(this).attr('href')).removeClass('tab-content--active');
      }); // show active content

      $($(this).attr('href')).addClass('tab-content--active');
      evt.preventDefault();
    });

    function tabFunc() {
      $('.tabs:not(:has(.tab--active)) a:first').trigger('assess');
    }

    ;
    tabFunc();
    $(document).on('shopify:section:load', tabFunc); /// Quickbuy with colorbox and slick

    var activeQuickBuyRequest = null;
    var breakpoint = 768;
    $(document).on('click', '.js-contains-quickbuy .js-quickbuy-button', function (e) {
      if ($(window).width() > breakpoint) {
        if (activeQuickBuyRequest) {
          return false;
        }

        var $qbButton = $(this);
        var $prod = $(this).closest('.js-contains-quickbuy');
        var placeholder = $prod.find('.quickbuy-placeholder-template').html();
        var $template = $('<div class="quickbuy">' + placeholder + '</div>'); // observer for dynamic payment buttons

        var buttonObserved = false;
        var buttonObserver = new MutationObserver(function (mutations) {
          $.colorbox.resize();
        });
        $.colorbox({
          closeButton: false,
          preloading: false,
          open: true,
          speed: 200,
          slideshow: true,
          //transition: "none",
          html: [$template.wrap('<div>').parent().html()].join(''),
          onComplete: function onComplete() {
            var $slideshow = $('.quickbuy__product-media').slick({
              infinite: false,
              slidesToScroll: 1,
              speed: 300,
              slidesToShow: 1,
              swipeToSlide: true,
              variableWidth: true,
              prevArrow: $('.quickbuy__slider-controls .prev'),
              nextArrow: $('.quickbuy__slider-controls .next')
            });
            theme.ProductMedia.init($('.quickbuy__media-container'), {
              onPlyrInit: function onPlyrInit(playerObj) {
                theme.productGallerySlideshowTabFix($slideshow.slick('getSlick').$slides, $slideshow.slick('getSlick').currentSlide);
              },
              onYoutubeInit: function onYoutubeInit(playerObj) {
                theme.productGallerySlideshowTabFix($slideshow.slick('getSlick').$slides, $slideshow.slick('getSlick').currentSlide);
              },
              onModelViewerInit: function onModelViewerInit(playerObj) {
                theme.productGallerySlideshowTabFix($slideshow.slick('getSlick').$slides, $slideshow.slick('getSlick').currentSlide);
              },
              onVideoVisible: function onVideoVisible(e) {
                $(e.target).closest('.slick-slider').slick('slickSetOption', 'swipe', false);
              },
              onVideoHidden: function onVideoHidden(e) {
                $(e.target).closest('.slick-slider').slick('slickSetOption', 'swipe', true);
              },
              onPlyrPlay: function onPlyrPlay(e) {
                $(e.target).closest('.slick-slider').slick('slickSetOption', 'swipe', false);
              },
              onPlyrPause: function onPlyrPause(e) {
                $(e.target).closest('.slick-slider').slick('slickSetOption', 'swipe', true);
              },
              onModelViewerPlay: function onModelViewerPlay(e) {
                // prevent swiping and left/right key control
                $(e.target).closest('.slick-slider').slick('slickSetOption', 'swipe', false).slick('slickSetOption', 'accessibility', false).closest('.quickbuy__media-container').addClass('media-playing');
              },
              onModelViewerPause: function onModelViewerPause(e) {
                $(e.target).closest('.slick-slider').slick('slickSetOption', 'swipe', true).slick('slickSetOption', 'accessibility', true).closest('.quickbuy__media-container').removeClass('media-playing');
              }
            });
            $slideshow.find('.product-media').trigger('mediaVisibleInitial');
            $slideshow.on('afterChange', function (evt, slick, current) {
              // notify media of visibility
              $('.product-media--activated').removeClass('product-media--activated').trigger('mediaHidden');
              var $currentMedia = $('.product-media', slick.$slides[current]).addClass('product-media--activated').trigger('mediaVisible'); // fix tabbing

              theme.productGallerySlideshowTabFix(slick.$slides, current); // indicate media type on carousel

              $slideshow.closest('.quickbuy__media-container').toggleClass('quickbuy__media-container--current-image', $currentMedia.hasClass('product-media--image')); // resize quickbuy

              $(this).closest('.quickbuy-container').trigger('changedsize');
            });
            theme.productGallerySlideshowTabFix($slideshow.slick('getSlick').$slides, $slideshow.slick('getSlick').currentSlide);
            $.colorbox.resize(); // initialise variants

            var $container = $('.quickbuy-form');
            var productData = JSON.parse($('[data-product-json]', $prod).html());
            var options = {
              $container: $container,
              enableHistoryState: false,
              singleOptionSelector: '[data-single-option-selector]',
              originalSelectorId: '[data-product-select]',
              secondaryIdSelectors: '[data-product-secondary-select]',
              product: productData,
              // for slate
              productSingleObject: productData // for our callbacks

            };
            var variants = new slate.Variants(options);
            $container.on('variantChange', theme.variants.updateAddToCartState.bind(options));
            $container.on('variantPriceChange', theme.variants.updateProductPrices.bind(options));

            if ($('.quickbuy__product-media .slick-slide', $container).length > 1) {
              $container.on('variantImageChange', function (evt) {
                var variant = evt.variant;
                var $found = $('.quickbuy__product-media .slick-slide:not(.slick-cloned)[data-media-id="' + variant.featured_media.id + '"]', $container);

                if ($found.length) {
                  $found.closest('.slick-slider').slick('slickGoTo', $found.data('slick-index'));
                }
              });
            } // resize lightbox after callbacks may have altered the page


            $container.on('variantChange', $.colorbox.resize); // style dropdowns

            theme.styleVariantSelectors($('.quickbuy .selector-wrapper select'), options.product, true); // style quantity

            theme.select2.init($('.quickbuy .quantity-proxy'), {
              dropdownParent: $('#cboxWrapper')
            }); // load extra payment buttons

            if (Shopify.PaymentButton) {
              $(document).on('shopify:payment_button:loaded.themeQuickBuy', function () {
                $(document).off('shopify:payment_button:loaded.themeQuickBuy');
                $.colorbox.resize(); // attach a MutationObserver

                buttonObserved = $('.quickbuy-form .shopify-payment-button')[0];

                if (buttonObserved) {
                  buttonObserver.observe(buttonObserved, {
                    attributes: true,
                    childList: true,
                    subtree: true
                  });
                }
              });
              Shopify.PaymentButton.init();
            } // ajax product form


            theme.initAjaxAddToCartForm($('form.ajax-product-form', $container)); // add to recent products

            var recentProductData = {
              handle: productData.handle,
              url: $qbButton.attr('href').split('?')[0],
              title: productData.title,
              vendor: productData.vendor,
              available: productData.available,
              image: productData.media && productData.media.length > 0 ? productData.media[0].preview_image.src : null,
              image2: productData.media && productData.media.length > 1 ? productData.media[1].preview_image.src : null,
              price: productData.price,
              priceVaries: productData.price_varies,
              compareAtPrice: productData.compare_at_price
            };
            var lowestPriceVariant = productData.variants[0];

            for (var i = 1; i < productData.variants.length; i++) {
              if (productData.variants[i].price < lowestPriceVariant.price) {
                lowestPriceVariant = productData.variants[i];
              }
            }

            if (lowestPriceVariant.unit_price_measurement) {
              recentProductData.unitPrice = lowestPriceVariant.unit_price;
              recentProductData.unitPriceUnit = theme.variants.getBaseUnit(lowestPriceVariant);
            }

            theme.addToAndReturnRecentProducts(recentProductData);
          },
          onCleanup: function onCleanup() {
            buttonObserver.disconnect();
            theme.ProductMedia.destroy($('.quickbuy__media-container'));
            $('.quickbuy .slick-initialized').slick('unslick').off('afterChange');
            $('.quickbuy-form').off('variantChange variantPriceChange variantImageChange');
            $('.quickbuy-form .clickybox-replaced').clickyBoxes('destroy');
            theme.initAjaxAddToCartForm($('.quickbuy form.ajax-product-form'));
          }
        }); // e.stopImmediatePropagation();

        return false;
      }
    });
    $(document).on('click', '#colorbox .quickbuy__close .js-close-quickbuy', function () {
      $.colorbox.close();
      return false;
    }); // general purpose 'close a lightbox' link

    $(document).on('click', '.js-close-lightbox', function () {
      $.colorbox.close();
      return false;
    }); // quantity wrapper

    $(document).on('change', '.quantity-proxy', function () {
      var value = $(this).val();
      var $input = $(this).siblings('[name="quantity"]');

      if (value == '10+') {
        $input.val('10').closest('.quantity-wrapper').addClass('hide-proxy');
        setTimeout(function () {
          $input.select().focus();
        }, 10);
      } else {
        $input.val(value);
      }
    }); // newsletter success message shows in lightbox

    var $newsletterSuccess = $('.subscribe-form__response--success');

    if ($newsletterSuccess.length) {
      $.colorbox({
        transition: 'fade',
        html: '<div class="subscribe-form-lightbox-response">' + $newsletterSuccess.html() + '</div>',
        onOpen: function onOpen() {
          $('#colorbox').css('opacity', 0);
        },
        onComplete: function onComplete() {
          $('#colorbox').animate({
            'opacity': 1
          }, 350);
        }
      });
    } // resize height of accent colour on homepage


    if ($('.accent-background').length) {
      // run now, and after fonts are loaded, then on resize
      $(function () {
        theme.resizeAccent();
      });
      $(window).on('debouncedresize', theme.resizeAccent); // run when the section at the top loads

      $(document).on('shopify:section:load', function (evt) {
        if ($(evt.target).prev().hasClass('accent-background')) {
          theme.resizeAccent();
        }
      }); // a section may have moved to/away from the top

      $(document).on('shopify:section:reorder', theme.resizeAccent);
    }
  }); // end of main $(function()

  theme.Sections.init();
  theme.Sections.register('header', theme.Header, {
    deferredLoad: false
  });
  theme.Sections.register('footer', theme.Footer);
  theme.Sections.register('product', theme.Product, {
    deferredLoad: false
  });
  theme.Sections.register('blog', theme.Blog);
  theme.Sections.register('article', theme.Article);
  theme.Sections.register('slideshow', theme.Slideshow);
  theme.Sections.register('banner', theme.Banner);
  theme.Sections.register('standout-collection', theme.StandoutCollection);
  theme.Sections.register('get-the-look', theme.GetTheLook);
  theme.Sections.register('promotional-images', theme.PromotionalImages);
  theme.Sections.register('featured-collection', theme.FeaturedCollection);
  theme.Sections.register('list-collections', theme.ListCollections, {
    deferredLoad: false
  });
  theme.Sections.register('collection-template', theme.CollectionTemplate, {
    deferredLoad: false
  });
  theme.Sections.register('cart', theme.Cart, {
    deferredLoad: false
  });
  theme.Sections.register('image-with-text', theme.ImageWithText);
  theme.Sections.register('featured-product', theme.FeaturedProduct);
  theme.Sections.register('recently-viewed', theme.RecentlyViewed);
  theme.Sections.register('testimonials', theme.Testimonials);
  theme.Sections.register('gallery', theme.Gallery);
  theme.Sections.register('video', theme.VideoManager);
  theme.Sections.register('background-video', theme.VideoManager);
  theme.Sections.register('search-template', theme.SearchTemplate, {
    deferredLoad: false
  }); //Register dynamically pulled in sections

  $(function ($) {
    if (cc.sections.length) {
      cc.sections.forEach(function (section) {
        try {
          theme.Sections.register(section.name, section.section);
        } catch (err) {
          console.error("Unable to register section ".concat(section.name, "."), err);
        }
      });
    } else {
      console.warn('Barry: No common sections have been registered.');
    }
  });
})(theme.jQuery);  
/* Built with Barry v1.0.7 */