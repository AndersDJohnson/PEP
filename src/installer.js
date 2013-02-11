/*
 * Copyright 2012 The Toolkitchen Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

/**
 * This module uses Mutation Observers to dynamically adjust which nodes will
 * generate Pointer Events.
 *
 * All nodes that wish to generate Pointer Events must have the attribute
 * `touch-action` set to `none`.
 */
(function(scope) {
  var dispatcher = scope.dispatcher;
  var forEach = Array.prototype.forEach.call.bind(Array.prototype.forEach);
  var installer = {
    ATTRIB: 'touch-action',
    SELECTOR: '[touch-action]',
    EMITTER: 'none',
    XSCROLLER: 'pan-x',
    YSCROLLER: 'pan-y',
    SCROLLER: /^(?:pan-x pan-y)|(?:pan-y pan-x)|scroll$/,
    OBSERVER_INIT: {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['touch-action']
    },
    watchSubtree: function(inScope) {
      observer.observe(inScope, this.OBSERVER_INIT);
    },
    enableOnSubtree: function(inScope) {
      var scope = inScope || document;
      this.watchSubtree(inScope);
      if (scope === document && document.readyState !== 'complete') {
        this.installOnLoad();
      } else {
        this.findElements(scope);
      }
    },
    findElements: function(inScope, inRemove) {
      var scope = inScope || document;
      var fn = inRemove ? this.elementRemoved : this.elementAdded;
      if (scope.querySelectorAll) {
        var nl = scope.querySelectorAll(this.SELECTOR);
        forEach(nl, fn, this);
      }
    },
    elementRemoved: function(inEl) {
      dispatcher.unregisterTarget(inEl);
      this.findElements(inEl, true);
    },
    elementAdded: function(inEl) {
      var a = inEl.getAttribute && inEl.getAttribute(this.ATTRIB);
      if (a === this.EMITTER) {
        dispatcher.registerTarget(inEl);
      } else if (a === this.XSCROLLER) {
        dispatcher.registerTarget(inEl, 'X');
      } else if (a === this.YSCROLLER) {
        dispatcher.registerTarget(inEl, 'Y');
      } else if (this.SCROLLER.exec(a)) {
        dispatcher.registerTarget(inEl, 'XY');
      }
      this.findElements(inEl);
    },
    elementChanged: function(inEl) {
      this.elementRemoved(inEl);
      this.elementAdded(inEl);
    },
    // register all touch-action = none nodes on document load
    installOnLoad: function() {
      document.addEventListener('DOMContentLoaded', this.findElements.bind(this, document, false));
    },
    summaryWatcher: function(inSummaries) {
      inSummaries.forEach(this.summaryHandler, this);
    },
    summaryHandler: function(inSummary) {
      if (inSummary.type === 'childList') {
        forEach(inSummary.addedNodes, this.elementAdded, this);
        forEach(inSummary.removedNodes, this.elementRemoved, this);
      } else if (inSummary.type === 'attributes') {
        this.elementChanged(inSummary.target);
      }
    },
  };
  var boundWatcher = installer.summaryWatcher.bind(installer);
  scope.installer = installer;
  scope.enablePointerEvents = installer.enableOnSubtree.bind(installer);
  var MO = window.WebKitMutationObserver || window.MutationObserver;
  if (!MO) {
    installer.watchSubtree = function(){
      console.warn('MutationObservers not found, touch-action will not be dynamically detected');
    };
  } else {
    var observer = new MO(boundWatcher);
  }
})(window.__PointerEventShim__);
