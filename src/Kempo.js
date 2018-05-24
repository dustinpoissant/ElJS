var Kempo = (function(){
  /*
    Closure Scoped Variables
  */
  var version = "0.20.0",
      eo = {}, // Element Observers
      ao = {}, // Attribute Observers
      co = {}; // Class Observers

  /*
    Closure Scoped Functions
  */
  function arrayDiff(a, b){
    var d = [];
    for(var i=0; i<a.length; i++) if(b.indexOf(a[i]) == -1) d.push(a[i]);
    return d;
  };
  function concatChildren($elements){
    var children = [];
    for(var i=0; i<$elements.length; i++)(function($el){
      if(!($el instanceof HTMLElement)) return;
      children.push($el);
      children = children.concat(concatChildren($el.children));
    })($elements[i]);
    return children;
  };
  function onDOMReady(handler){
    if(document.readyState == 'complete' || document.readyState == 'interactive'){
      handler.call(window);
    } else {
      document.addEventListener('DOMContentLoaded', function(){
        handler.call(window);
      });
    }
  };
  function addElementObserver(tagName, options){
    var tagName = tagName.trim().toLowerCase();
    if(!eo[tagName]) eo[tagName] = [];
    if(!options.added) options.added = function(){};
    if(!options.removed) options.removed = function(){};
    eo[tagName].push(options);
  };
  function addAttributeObserver(attrName, options){
    var attrName = attrName.trim().toLowerCase();
    if(!ao[attrName]) ao[attrName] = [];
    if(!options.added) options.added = function(){};
    if(!options.changed) options.changed = function(){};
    if(!options.removed) options.removed = function(){};
    ao[attrName].push(options);
  };
  function addClassObserver(className, options){
    if(!co[className]) co[className] = [];
    if(!options.added) options.added = function(){};
    if(!options.removed) options.removed = function(){};
    co[className].push(options);
  };

  /*
    Add a Attribute Observer for Classes
  */
  ao.class = [{
    added: function(attrName, val){
      var $el = this;
      var classNames = val.split(" ");
      for(var i=0; i<classNames.length; i++)(function(className){
        if(co[className]) for(var i=0; i<co[className].length; i++)(function(observer){
          observer.added.call($el, className);
        })(co[className][i]);
      })(classNames[i]);
    },
    changed: function(attrName, newVal, oldVal){
      var $el = this;
      var newClassNames = newVal.split(" ");
      var oldClassNames = oldVal.split(" ");
      var addedClassNames = arrayDiff(newClassNames, oldClassNames);
      for(var i=0; i<addedClassNames.length; i++)(function(className){
        if(co[className])for(var i=0; i<co[className].length; i++)(function(observer){
          observer.added.call($el, className);
        })(co[className][i]);
      })(addedClassNames[i]);
      var removedClassNames = arrayDiff(oldClassNames, newClassNames);
      for(var i=0; i<removedClassNames.length; i++)(function(className){
        if(co[className])for(var i=0; i<co[className].length; i++)(function(observer){
          observer.removed.call($el, className);
        })(co[className][i]);
      })(removedClassNames[i]);
    },
    removed: function(attrName, val){
      var $el = this;
      var classNames = val.split(" ");
      for(var i=0; i<classNames.length; i++)(function(className){
        if(co[className]) for(var i=0; i<co[className].length; i++)(function(observer){
          observer.removed.call($el, className);
        })(co[className][i]);
      })(classNames[i]);
    }
  }];


  /*
    Initialize Elements / Attributes / Classes
  */
  onDOMReady(function(){
    /* Initialize Elements */
    for(var tagName in eo)(function(tagName, observers){
      var $els = document.querySelectorAll(tagName);
      for(var i=0; i<$els.length; i++)(function($el){
        for(var i=0; i<observers.length; i++)(function(observer){
          observer.added.call($el, tagName);
        })(observers[i]);
      })($els[i]);
    })(tagName, eo[tagName]);

    /* Initialize Attriutes */
    for(var attrName in ao)(function(attrName, observers){
      var $els = document.querySelectorAll("["+attrName+"]");
      for(var i=0; i<$els.length; i++)(function($el){
        for(var i=0; i<observers.length; i++)(function(observer){
          observer.added.call($el, attrName, $el.getAttribute(attrName), null);
        })(observers[i]);
      })($els[i]);
    })(attrName, ao[attrName]);
  });
  /*
    Body MutationObserver
  */
  onDOMReady(function(){
    new MutationObserver(function(mutations){
      for(var i=0; i<mutations.length; i++) (function(mutation){
        if(mutation.type == "childList"){
          // Handle Added Elements
          var addedElements = concatChildren(mutation.addedNodes);
          for(var i=0; i<addedElements.length; i++) (function($el){
            var tagName = $el.tagName.trim().toLowerCase();
            if(eo[tagName]) for(var i=0; i<eo[tagName].length; i++) (function(o){
              o.added.call($el);
            })(eo[tagName][i]);
            for(var attrName in ao)(function(attrName, observers){
              var v = $el.getAttribute(attrName);
              if(v){
                for(var i=0; i<observers.length; i++)(function(observer){
                  observer.added.call($el, attrName, v);
                })(observers[i]);
              }
            })(attrName, ao[attrName]);
          })(addedElements[i]);
          // Handle Removed Elements
          var removedElements = concatChildren(mutation.removedNodes);
          for(var i=0; i<removedElements.length; i++) (function($el){
            var tagName = $el.tagName.trim().toLowerCase();
            if(eo[tagName]) for(var i=0; i<eo[tagName].length; i++) (function(o){
              o.removed.call($el);
            })(eo[tagName][i]);
            for(var attrName in ao)(function(attrName, observers){
              var v = $el.getAttribute(attrName);
              if(v){
                for(var i=0; i<observers.length; i++)(function(observer){
                  observer.removed.call($el, attrName, v);
                })(observers[i]);
              }
            })(attrName, ao[attrName]);
          })(removedElements[i]);
        } else if(mutation.type == "attributes"){
          var attrName = mutation.attributeName.trim().toLowerCase();
          if(ao[attrName]){
            var $el = mutation.target;
            var oldValue = mutation.oldValue;
            var newValue = $el.getAttribute(attrName);
            for(var i=0; i<ao[attrName].length; i++)(function(observer){
              if(newValue && !oldValue) observer.added.call($el, attrName, newValue);
              else if(!newValue && oldValue) observer.removed.call($el, attrName, oldValue);
              else if(newValue && oldValue) observer.changed.call($el, attrName, newValue, oldValue);
            })(ao[attrName][i]);
          }
        }
      })(mutations[i]);
    }).observe(document.body, {
      childList: true,
      attributes: true,
      attributeOldValue: true,
      subtree: true
    });
  });

  function Kempo(arg1, arg2){
    if(typeof(arg1) == "function"){
      onDOMReady(arg1);
    } else if(typeof(arg1) == "string"){
      arg1.split(",").forEach(function(selector){
        var selector = selector.trim();
        if(selector[0] == ".")
          addClassObserver(selector.substr(1), arg2);
        else if(selector[0] == "[" && selector[selector.length-1] == "]")
          addAttributeObserver(selector.substr(1, selector.length-2), arg2);
        else
          addElementObserver(selector, arg2);
      });
    }
  };
  Kempo.version = {};
  Object.defineProperty(Kempo.version, "core", {
    get: function(){
      return version;
    },
    enumerable: true
  });
  return Kempo;
})();
