var Kempo = (function(){
  var Kempo = function(arg1, arg2){
    if(typeof(arg1) == "function"){
      if(document.readyState == "complete") arg1();
      else document.addEventListener("DOMContentLoaded", arg1);
    } else if(arg1[0] == "[" && arg1[arg1.length-1] == "]"){
      var attribute = arg1.substr(1, arg1.length-2);
      caa.push(attribute);
      car[attribute] = new KempoCustomAttribute(arg1, arg2);
      startObservingBody();
    } else {
      cer[arg1] = new KempoCustomElement(arg1, arg2);
    }
    return Kempo;
  };
  Kempo.version = {
    core: "0.17.1"
  };

  /* Helper Function */
  function nodeList2Array(nl){
    var a = [];
    for(var i=0; i<nl.length; i++){
      if(nl[i].nodeType != 3) a.push(nl[i]);
    }
    return a;
  }

  /* Custom Element Prototype */
  var KempoCustomElement = function(tag, options){
    this.added = function($element, attr, newVal){
      if(options.added) options.added.call($element, attr, newVal);
      if(options.changed && options.watch) watchForChanges($element);
    };
    this.removed = function($element, attr){
      if(options.removed) options.removed.call($element);
      if($element.observer){
        $element.observer.disconnect();
        delete $element.observer;
      }
    };
    function watchForChanges($element){
      var config = {};
      if(options.watch.attributes){
        config.attributes = true;
        config.attributeOldValue = true;
        if(options.watch.attributes instanceof Array)
          config.attributeFilter = options.watch.attributes;
      }
      if(options.watch.children){
        config.childList = true;
        config.subtree = true;
      }
      if(options.watch.text){
        config.childList = true;
        config.subtree = true;
        config.characterData = true;
        $element._oldInnerText = $element.innerText;
      }
      $element.observer = new MutationObserver(function(mutations){
        for(var i=0; i<mutations.length; i++){
          var m = mutations[i];
          if(options.watch && options.watch.attributes && m.type == "attributes"){
            options.changed.call(m.target, {
              attribute: {
                name: m.attributeName,
                oldValue: m.oldValue,
                newValue: m.target.getAttribute(m.attributeName)
              }
            });
          }
          if(options.watch && options.watch.children && m.type == "childList"){
            if(nodeList2Array(m.addedNodes).length){
              options.changed.call(m.target, {
                children: {
                  added: [].slice.call(m.addedNodes)
                }
              });
            }
            if(nodeList2Array(m.removedNodes).length){
              options.changed.call(m.target, {
                children: {
                  removed: [].slice.call(m.removedNodes)
                }
              });
            }
          }
          if(options.watch && options.watch.text && m.target._oldInnerText != m.target.innerText){
            options.changed.call(m.target, {
              text: {
                oldValue: m.target._oldInnerText,
                newValue: m.target.innerText
              }
            });
            m.target._oldInnerText = m.target.innerText;
          }
        }
      });
      $element.observer.observe($element, config);
    };
  };

  /* Custom Attribute Prototype */
  var KempoCustomAttribute = function(attribute, options){
    this.added = function($element, attr, newVal){
      if(options.added) options.added.call($element, attr, newVal);
    };
    this.removed = function($element, attr, oldVal){
      if(options.removed) options.removed.call($element, attr, oldVal);
    };
    this.changed = function($element, attr, oldVal, newVal){
      if(options.changed) options.changed.call($element, attr, oldVal, newVal);
    };
  };

  var cer = {}; // Custom Element Registry
  var car = {}; // Custom Attribute Registry
  var caa = []; // Custom Attribute Array

  var bodyObserver = new MutationObserver(function(mutations){
    for(var i=0; i<mutations.length; i++){
      var m = mutations[i];
      if(m.type == "attributes"){
        var attr = m.attributeName;
        var ca = car[attr];
        if(ca){
          var newVal = m.target.getAttribute(m.attributeName);
          if(m.attributeOldValue === null){
            ca.added(m.target, attr, newVal);
          } else if(newVal === null){
            ca.removed(m.target, attr, m.oldValue);
          } else {
            ca.changed(m.target, attr, m.oldValue, newVal);
          }
        }
      }
      if(m.type == "childList" && m.addedNodes.length){
        var an = [].slice.call(m.addedNodes);
        for(var a=0; a<an.length; a++){
          if(an[a].nodeType == 3) continue;
          var ce = cer[an[a].tagName.toLowerCase()];
          if(ce){
            ce.added(an[a]);
          }
        }
      }
      if(m.type == "childList" && m.removedNodes.length){
        var rn = [].slice.call(m.removedNodes);
        for(var r=0; r<rn.length; r++){
          if(rn[r].nodeType == 3) continue;
          var ce = cer[rn[r].tagName.toLowerCase()];
          if(ce){
            ce.removed(rn[r]);
          }
        }
      }
    }
  });
  function getBodyObserverConfig(){
    var bodyObserverConfig = {
      subtree: true,
      childList: true
    };
    if(caa.length){
      bodyObserverConfig.attributes = true;
      bodyObserverConfig.attributeOldValue = true;
      bodyObserverConfig.attributeFilter = caa;
    }
    return bodyObserverConfig;
  };
  function startObservingBody(){
    function observeBody(){
      if(startObservingBody.first){
        for(var tag in cer){
          var $ce = document.getElementsByTagName(tag);
          for(var i=0; i<$ce.length; i++){
            cer[tag].added($ce[i]);
          }
        }
        for(var attr in  car){
          // Custom Attribute Element
          var $cae = document.querySelectorAll("["+attr+"]");
          for(var i=0; i<$cae.length; i++){
            car[attr].added($cae[i], attr, $cae[i].getAttribute(attr));
          }
        }
        startObservingBody.first = false;
      }
      bodyObserver.disconnect();
      bodyObserver.observe(document.body, getBodyObserverConfig());
    }
    if(document.readyState == "complete") observeBody();
    else document.addEventListener("DOMContentLoaded", observeBody);
  };
  startObservingBody.first = true;
  startObservingBody();
  return Kempo;
})();
