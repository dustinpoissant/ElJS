var Kempo=function(){function e(t){for(var a=[],r=0;r<t.length;r++)[3,7,8,10].indexOf(t[r].nodeType)==-1&&(a.push(t[r]),a=a.concat(e(t[r].childNodes)));return a}function t(){var e={subtree:!0,childList:!0};return l.length&&(e.attributes=!0,e.attributeOldValue=!0,e.attributeFilter=l),e}function a(){function e(){if(a.first){for(var e in o)for(var r=document.getElementsByTagName(e),d=0;d<r.length;d++)o[e].added(r[d]);for(var n in i)for(var l=document.querySelectorAll("["+n+"]"),d=0;d<l.length;d++)i[n].added(l[d],n,l[d].getAttribute(n));a.first=!1}c.disconnect(),c.observe(document.body,t())}"complete"==document.readyState?e():document.addEventListener("DOMContentLoaded",e)}var r=function(e,t){if("function"==typeof e)"complete"==document.readyState?e():document.addEventListener("DOMContentLoaded",e);else if("["==e[0]&&"]"==e[e.length-1]){var c=e.substr(1,e.length-2);l.push(c),i[c]=new n(e,t),a()}else o[e]=new d(e,t);return r};r.version={core:"0.18.2"};var d=function(t,a){function r(t){var r={};a.watch.attributes&&(r.attributes=!0,r.attributeOldValue=!0,a.watch.attributes instanceof Array&&(r.attributeFilter=a.watch.attributes)),a.watch.children&&(r.childList=!0,r.subtree=!0),a.watch.text&&(r.childList=!0,r.subtree=!0,r.characterData=!0,t._oldInnerText=t.innerText),t.observer=new MutationObserver(function(t){for(var r=0;r<t.length;r++){var d=t[r];a.watch&&a.watch.attributes&&"attributes"==d.type&&a.changed.call(d.target,{attribute:{name:d.attributeName,oldValue:d.oldValue,newValue:d.target.getAttribute(d.attributeName)}}),a.watch&&a.watch.children&&"childList"==d.type&&(e(d.addedNodes).length&&a.changed.call(d.target,{children:{added:[].slice.call(d.addedNodes)}}),e(d.removedNodes).length&&a.changed.call(d.target,{children:{removed:[].slice.call(d.removedNodes)}})),a.watch&&a.watch.text&&d.target._oldInnerText!=d.target.innerText&&(a.changed.call(d.target,{text:{oldValue:d.target._oldInnerText,newValue:d.target.innerText}}),d.target._oldInnerText=d.target.innerText)}}),t.observer.observe(t,r)}this.added=function(e,t,d){a.added&&a.added.call(e,t,d),a.changed&&a.watch&&r(e)},this.removed=function(e,t){a.removed&&a.removed.call(e),e.observer&&(e.observer.disconnect(),delete e.observer)}},n=function(e,t){this.added=function(e,a,r){t.added&&t.added.call(e,a,r)},this.removed=function(e,a,r){t.removed&&t.removed.call(e,a,r)},this.changed=function(e,a,r,d){t.changed&&t.changed.call(e,a,r,d)}},o={},i={},l=[],c=new MutationObserver(function(t){for(var a=0;a<t.length;a++){var r=t[a];if("attributes"==r.type){var d=r.attributeName,n=i[d];if(n){var l=r.target.getAttribute(r.attributeName);null===r.attributeOldValue?n.added(r.target,d,l):null===l?n.removed(r.target,d,r.oldValue):n.changed(r.target,d,r.oldValue,l)}}if("childList"==r.type&&r.addedNodes.length){var c=e(r.addedNodes);for(var u in c){var s=o[c[u].tagName.toLowerCase()];s&&s.added(c[u]);for(var d in i)if(null!==c[u].getAttribute(d)){var n=i[d];n&&n.added(c[u],d,c[u].getAttribute(d))}}}if("childList"==r.type&&r.removedNodes.length){var h=e(r.removedNodes);for(var v in h)if(!document.body.contains(h[v])){var s=o[h[v].tagName.toLowerCase()];s&&s.removed(h[v])}}}});return a.first=!0,a(),r}();