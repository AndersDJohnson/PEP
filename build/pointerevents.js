/*
 * Copyright 2012 The Toolkitchen Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */(function(e){var t=function(e,t){return Array.prototype.slice.call(e,t||0)};Function.prototype.bind||(Function.prototype.bind=function(e){var n=this,r=t(arguments,1);return function(){var i=t(arguments,0);return n.apply(e,r.concat(i))}}),e=e||{},e.clone=function(e,n){var r=t(arguments,1);for(var i=0,s;s=r[i];i++)if(s)for(var o in s)e[o]=s[o];return e},window.__PointerEventShim__=e})(window.__PointerEventShim__),function(e){var t={pointers:[],addPointer:function(e,t){var n={id:e,event:t};return this.pointers.push(n),n},removePointer:function(e){var t=this.getPointerIndex(e);if(t>-1)return this.pointers.splice(t,1)},getPointerById:function(e){return this.pointers[this.getPointerIndex(e)]},getPointerIndex:function(e){for(var t=0,n=this.pointers.length,r;t<n&&(r=this.pointers[t]);t++)if(r.id===e)return t;return-1},getPointerList:function(){return this.pointers}};e.pointermap=t}(window.__PointerEventShim__),function(e){var t=e.clone,n=e.pointermap,r=n.getPointerList.bind(n),i={events:[],eventMap:{},eventSources:{},registerSource:function(e,t){this.events=t.events,this.events.forEach(function(e){t[e]&&(this.eventMap[e]=t[e].bind(t))},this),this.eventSources[e]=t},registerTarget:function(e){this.listen(this.events,e)},unregisterTarget:function(e){this.unlisten(this.events,e)},down:function(e){this.fireEvent(e,"pointerdown")},move:function(e){this.fireEvent(e,"pointermove")},up:function(e){this.fireEvent(e,"pointerup")},tap:function(e){this.disableTap||this.fireEvent(e,"pointertap")},enter:function(e){this.fireEvent(e,"pointerenter")},leave:function(e){this.fireEvent(e,"pointerleave")},eventHandler:function(e){if(e.__pointerHandled__)return;var t=e.type,n=this.eventMap&&this.eventMap[t];n&&n(e),e.__pointerHandled__=!0},listen:function(e,t){e.forEach(function(e){this.addEvent(e,this.boundHandler,!1,t)},this)},unlisten:function(e){e.forEach(function(e){this.removeEvent(e,this.boundHandler,!1,inTarget)},this)},addEvent:function(e,t,n,r){var i=r||document;i.addEventListener(e,t,n)},removeEvent:function(e,t,n,r){var i=r||document;i.removeEventListener(e,t,n)},makeEvent:function(e,t){var n;typeof e.buttons!="undefined"?n=e.buttons?e.button:-1:n=e.which?e.button:-1;var i=document.createEvent("MouseEvent");return i.initMouseEvent(t,e.bubbles,e.cancelable,e.view,e.detail,e.screenX,e.screenY,e.clientX,e.clientY,e.ctrlKey,e.altKey,e.shiftKey,e.metaKey,n,e.relatedTarget),i.__srcTarget__=e.__srcTarget__||e.target,i.pointerId=e.pointerId||-1,i.getPointerList=r,i},fireEvent:function(e,t){var n=this.makeEvent(e,t);return this.dispatchEvent(n)},cloneEvent:function(e){return t({},e)},dispatchEvent:function(e){return e.__srcTarget__.dispatchEvent(e)}};i.boundHandler=i.eventHandler.bind(i),e.dispatcher=i,e.register=function(e){i.registerTarget(e)},e.unregister=function(e){i.unregisterTarget(e)}}(window.__PointerEventShim__),function(e){var t=e.dispatcher,n=e.pointermap,r=function(e,t){var n=e;while(n){if(n===t)return!0;n=n.parentNode}},i={events:["click","touchstart","touchmove","touchend"],splitEvents:function(e){var n=Array.prototype.map.call(e.changedTouches,function(e){var n=t.cloneEvent(e);return n.pointerId=e.identifier,n.target=this.findTarget(n),n.bubbles=!0,n.cancelable=!0,n.which=1,n.button=0,n},this);return n},findTarget:function(e){return document.elementFromPoint(e.clientX,e.clientY)},click:function(e){t.tap(e)},touchstart:function(e){var t=this.splitEvents(e);t.forEach(this.downEnter,this)},downEnter:function(e){var r=n.addPointer(e.pointerId,e,null);t.down(e),r.over=e,t.enter(e)},touchmove:function(e){e.preventDefault();var t=this.splitEvents(e);t.forEach(this.moveEnterLeave,this)},moveEnterLeave:function(e){var i=e,s=n.getPointerById(i.pointerId),o=s.over;s.event=i,t.move(i),o&&o.target!==i.target&&(o.relatedTarget=i.target,i.relatedTarget=o.target,r(o.relatedTarget,o.target)||t.leave(o),r(i.relatedTarget,i.target)||t.enter(i)),s.over=i},touchend:function(e){var t=this.splitEvents(e);t.forEach(this.upLeave,this)},upLeave:function(e){t.up(e),t.leave(e),n.removePointer(e.pointerId)}},s={POINTER_ID:-1,buttons:0,events:["click","mousedown","mousemove","mouseup","mouseover","mouseout"],click:function(e){t.tap(e)},mousedown:function(e){if(e.button==2)return;this.buttons==0&&(n.addPointer(this.POINTER_ID,e),t.down(e)),this.buttons++},mousemove:function(e){var r=n.getPointerById(this.POINTER_ID);r&&(r.event=e),t.move(e)},mouseup:function(e){this.buttons--,this.buttons==0&&(t.up(e),n.removePointer(this.POINTER_ID))},mouseover:function(e){if(!r(e.relatedTarget,e.target)){var n=t.cloneEvent(e);n.bubbles=!1,t.enter(n)}},mouseout:function(e){if(!r(e.relatedTarget,e.target)){var n=t.cloneEvent(e);n.bubbles=!1,t.leave(n)}}};"ontouchstart"in window?t.registerSource("touch",i):t.registerSource("mouse",s),t.registerTarget(document)}(window.__PointerEventShim__);
