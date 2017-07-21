var El = (function(){
  var customElements = {};
  var bodyObserver = new MutationObserver(function(mutations){
    for(var i=0; i<mutations.length; i++){
      for(var r=0; r<mutations[i].removedNodes.length; r++){
        var node = mutations[i].removedNodes[r];
        if(node.nodeType == 3) continue;
        var tag = node.tagName.toLowerCase();
        var el = customElements[node.tagName.toLowerCase()];
        if(el) el.detached(node);
      }
      for(var a=0; a<mutations[i].addedNodes.length; a++){
        var node = mutations[i].addedNodes[a];
        if(node.nodeType == 3) continue;
        var el = customElements[node.tagName.toLowerCase()];
        if(el) el.attached(node);
      }
    }
  });
  function observeBody(){
    bodyObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
    for(var tag in customElements){
      var elements = document.getElementsByTagName(tag);
      for(var i=0; i<elements.length; i++){
        customElements[tag].attached(elements[i]);
      }
    }
  };
  if(document.readyState === 'complete') observeBody();
  else document.addEventListener("DOMContentLoaded", observeBody);
  return function El(tag, settings){
    this.attached = function($element){
      if(settings.attached) settings.attached.call($element);
      if(settings.changed) watchForChanges($element);
      return this;
    };
    this.detached = function($element){
      if($element.observer){
        $element.observer.disconnect()
        delete $element.observer;
      }
      if(settings.detached) settings.detached.call($element);
      return this;
    };
    function watchForChanges($element){
      var watch = settings.watch || {
        attributes: true,
        children: true,
        text: true
      };
      if(watch.attributes || watch.children){
        $element.observer = new MutationObserver(function(mutations){
          var changes = {
            attributes: {},
            children: {
              added: [],
              removed: []
            }
          };
          for(var i=0; i<mutations.length; i++){
            var m = mutations[i];
            if(m.type == "attributes"){
              changes.attributes[m.attributeName] = {
                value: $element.getAttribute(m.attributeName),
                oldValue: m.oldValue
              };
            } else if(m.type == "childList"){
              changes.children.added = [].slice.call(m.addedNodes);
              changes.children.removed = [].slice.call(m.removedNodes);
            } else if(m.type == "characterData"){
              changes.text = {
                value: $element.innerText,
                oldValue: $element._oldText
              };
              $element._oldText = $element.innerText;
            }
          }
          settings.changed.call($element, changes);
        });
        var config = {};
        if(watch.attributes){
          config.attributes = true;
          config.attributeOldValue = true;
          if(watch.attributes instanceof Array) config.attributeFilter = watch.attributes;
          else if(typeof(watch.attributes) == "string") config.attributesFilter = watch.attributes.split(" ").concat(watch.attributes.split(","));
        }
        if(watch.children){
          config.childList = true;
          config.subtree = true;
        }
        if(watch.text){
          $element._oldText = $element.innerText;
          config.subtree = true;
          config.characterData = true;
        }
        $element.observer.observe($element, config);
      }
    };
    customElements[tag.toLowerCase()] = this;
    if(document.registerElement){
      try {
        document.registerElement(tag.toLowerCase());
      } catch(err){}
    }
  };
})();
