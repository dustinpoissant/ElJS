var Kempo=(function(){var d={};var a=new MutationObserver(function(f){for(var h=0;h<f.length;h++){for(var k=0;k<f[h].removedNodes.length;k++){var g=f[h].removedNodes[k];if(g.nodeType==3){continue}var j=d[g.tagName.toLowerCase()];if(j){j.detach(g)}}for(var e=0;e<f[h].addedNodes.length;e++){var g=f[h].addedNodes[e];if(g.nodeType==3){continue}var j=d[g.tagName.toLowerCase()];if(j){j.attach(g)}}}});function c(){a.observe(document.body,{childList:true,subtree:true});for(var e in d){var g=document.getElementsByTagName(e);for(var f=0;f<g.length;f++){d[e].attach(g[f])}}}if(document.readyState=="complete"){c()}else{document.addEventListener("DOMContentLoaded",c)}function b(f,g){if(!(this instanceof b)){return new b(f,g)}this.attach=function(i){if(g.attached){g.attached.call(i)}if(g.changed){e(i)}};this.detach=function(i){if(i.observer){i.observer.disconnect();delete i.observer}if(g.detached){g.detached.call(i)}};function e(i){var k=g.watch||{};if((k.attributes||k.children||k.text)&&g.changed){i.observer=new MutationObserver(function(n){var p={};for(var o=0;o<n.length;o++){var l=n[o];if(l.type=="attributes"){if(!p.attributes){p.attributes={}}p.attributes[l.attributeName.toLowerCase()]={value:i.getAttribute(l.attributeName.toLowerCase()),oldValue:l.oldValue}}else{if(l.type=="childList"){if(!p.children){p.children={}}if(l.addedNodes.length){if(!p.children.added){p.children.added=[]}p.children.added=p.children.added.concat([].slice.call(l.addedNodes))}if(l.removedNodes.length){if(!p.children.removed){p.children.removed=[]}p.children.removed=p.children.removed.concat([].slice.call(l.removedNodes))}}else{if(l.type=="characterData"){p.text={value:i.innerText,oldValue:$elemnet._oldText||null};i._oldText=i.innerText}}}}g.changed.call(i,p)});var j={};if(k.attributes){j.attributes=true;j.attributeOldValue=true;if(k.attributes instanceof Array){j.attributeFilter=k.attributes}else{if(typeof(k.attributes)=="string"){j.attributeFilter=k.attributes.split(" ").concat(k.attributes.split(","))}}}if(k.children){j.childList=true;j.subtree=true}if(k.text){i._oldText=i.innerText;j.subtree=true;j.characterData=true}i.observer.observe(i,j)}}d[f.toLowerCase()]=this;if(customElements&&customElements.define){try{customElements.define(f.toLoerCase())}catch(h){}}else{if(document.registerElement){try{document.registerElement(f.toLowerCase())}catch(h){}}}}b.version={core:"0.16.0"};return b})();