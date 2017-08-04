/*
* Kempo.js is Licensed under CC BY-NC-SA 3.0
* Authored By Dustin Poissant
* https://github.com/dustinpoissant/
* dustinpoissant@gmail.com
*/

/*
Expose a single global prototype called "Kempo"
The prototype is returned from an immediately invoked anonymous function for
  the purpose of scoping.
*/
var Kempo = (function(){
  // Custom Elements Registry
  var cer = {};

  // Use a MutationObserver to watch for custom elements being added/removed from the DOM
  var bodyObserver = new MutationObserver(function(mutations){
    // Loop through all mutations
    for(var i=0; i<mutations.length; i++){
      // Call the "detached" option for each removed node
      for(var r=0; r<mutations[i].removedNodes.length; r++){
        var $node = mutations[i].removedNodes[r]; // Get the node
        if($node.nodeType == 3) continue; // Skip text nodes
        // Get the "Kempo" object representing the custom element
        var el = cer[$node.tagName.toLowerCase()];
        // If the custom element exists, call it's "detach" method, which will call the "detached" option
        if(el) el.detach($node);
      }
      // Call the "attached" option for each added node
      for(var a=0; a<mutations[i].addedNodes.length; a++){
        var $node = mutations[i].addedNodes[a]; // Get the node
        if($node.nodeType == 3) continue; // Skip text nodes
        // Get the "Kempo" object representing the custom element
        var el = cer[$node.tagName.toLowerCase()];
        // If the custom element exists, call it's "attach" method, which will call the "attached" option
        if(el) el.attach($node);
      }
    }
  })

  // Create a function to start observing the body as soon as it is ready
  function observeBody(){
    // Start watching for nodes being added/removed from the body
    bodyObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
    // Find all custom nodes that are already in the body
    for(var tag in cer){
      // Get all nodes of with this tag name
      var $elements = document.getElementsByTagName(tag);
      // Call the "attached" option for each node
      for(var i=0; i<$elements.length; i++){
        // Call the "attach" method of the custom element, which will call the "attached" option
        cer[tag].attach($elements[i]);
      }
    }
  }

  // If the document is already ready then start observing the body
  if(document.readyState == "complete") observeBody();
  // Otherwise, listen for the document to become ready then start observing it
  else document.addEventListener("DOMContentLoaded", observeBody);

  /*
    A function that will be assigned to the global "Kempo"
  */
  function Kempo(tag, options){
    if(!(this instanceof Kempo)){ // If Kempo was called as a function
      return new Kempo(tag, options); // Return a new instance of Kempo
    }

    /*  This function is called by the body observer when a new element
          with this tag is added to the body */
    this.attach = function($element){
      // If there is an "attached" option call it with the element as context
      if(options.attached) options.attached.call($element);
      // If there is a "changed" option watch for changes within this element
      if(options.changed) watchForChanges($element);
    };

    /*  This function is called by the body observer when an element with this
          tag is removed from the body */
    this.detach = function($element){
      if($element.observer){ // If there is an observer on this element
        $element.observer.disconnect(); // Stop observing this element
        delete $element.observer; // Delete the observer (free up memory)
      }

      /* If there is a "detached" option then call it with this element
        as its context */
      if(options.detached) options.detached.call($element);
    }

    /*  This function watches for changes within this element
          (attributes, chilren or text).
        This function is called within "this.attach". */
    function watchForChanges($element){
      /*  An object representing what is being watched for.
          Use the provided "watch" option if abailable */
      var watch = options.watch || {};

      if(
        // If there is something to watch for specified
        (watch.attributes || watch.children || watch.text) &&
        options.changed // And there is a "changed" callback option
      ){

        /* Create a new MutationOberver for this element */
        $element.observer = new MutationObserver(function(mutations){

          /*  This simple object is used to describe the changes that have been
                made to this element. It will basically be a simplified
                combination of all the MutationRecord objects */
          var changes = {};

          for(var i=0; i<mutations.length; i++){ // Loop through each mutation
            var m = mutations[i]; // Store the current mutation
            if(m.type == "attributes"){ // Is it an attribute mutation?
              /*  If this is the first attribute mutation create a new
                    sub-object of "changes" for attributes */
              if(!changes.attributes) changes.attributes = {};
              /*  Create a new object representing this attribute change
                    and assign it to the "changes.attributes" object with it's
                    key being the name of the attribute that was changed and
                    provide the old and new values */
              changes.attributes[m.attributeName.toLowerCase()] = {
                value: $element.getAttribute(m.attributeName.toLowerCase()),
                oldValue: m.oldValue
              };
            } else if(m.type == "childList"){ // Has a child been added/removed?
              /*  If this is the first child mutation create a new sub-object
                    of "changes" for children */
              if(!changes.children) changes.children = {};
              if(m.addedNodes.length){ // If children have been added
                /*  If this is the first mutation that added children create a
                      blank array that will represent the added children */
                if(!changes.children.added) changes.children.added = [];
                /*  Concat the array of added children on to the current array
                      of added children */
                changes.children.added = changes.children.added.concat(
                  [].slice.call(m.addedNodes) // Cast the NodeList to an array
                );
              }
              if(m.removedNodes.length){ // If children have been removed
                /*  If this is the first mutation that removed children create
                      a blank array that will represent the removed children */
                if(!changes.children.removed) changes.children.removed = [];
                /* Concat the array of removed children on to the current array
                    of removed children */
                changes.children.removed = changes.children.removed.concat(
                  [].slice.call(m.removedNodes) // Cast the NodeList to an array
                );
              }
            } else if(m.type == "characterData"){ // Is this a text change?
              changes.text = {//Create a new object representing the text change
                value: $element.innerText, // The current inner text
                oldValue: $elemnet._oldText || null // The old inner text
              };
              /*  Save the current inner text to be the "old" text of the next
                    text mutation. */
              $element._oldText = $element.innerText;
            }
          }
          /*  Call the "changed" option with this element as it's context
                and passing the "changes" object as it's only argument. */
          options.changed.call($element, changes);
        });

        /* Prepare the MutationObserver's configutation object */
        var config = {};

        if(watch.attributes){ // If we are watching for any attribute changes
          config.attributes = true; // Set the configuration to watch attributes
          config.attributeOldValue = true;// We want the old attribute value too
          /*  If the watch.attributes is an array then we only want to watch the
                attributes specified in the array */
          if(watch.attributes instanceof Array)
            config.attributeFilter = watch.attributes;
          /*  If the watch.attributes is a string than we want to split it into
                an array (by spaces and commas) and only watch those
                specified attributes */
          else if(typeof(watch.attributes) == "string")
            config.attributeFilter =
              watch.attributes.split(" ").concat(watch.attributes.split(","));
        }
        if(watch.children){ // Are we watching for children being added/removed?
          config.childList = true; // Watch the direct child list for changes
          config.subtree = true; // Watch the DOM subtree for changes
        }
        if(watch.text){ // Are we watching for text changes?
          /*  Save the current inner text to be used as the "old" text on the
                first text mutation. */
          $element._oldText = $element.innerText;
          /*  Watch the subtree for changes because their text is part of this
                element's inner text */
          config.subtree = true;
          config.characterData = true; // Watch for text changes
        }
        // Start observing this element with the configutation defiend above
        $element.observer.observe($element, config);
      }
    }

    /*  Save this object to Kempo's custom elements registry to be retrieved
          by the body observer */
    cer[tag.toLowerCase()] = this;

    /* Lets attempt to register this custom element using the official Custom
        Elements specifications */
    if(customElements && customElements.define){ // If Spec v1
      try {
        customElements.define(tag.toLoerCase());
      } catch(err){}; // Catch any errors and do nothing with them
    } else if(document.registerElement){ // If Spec v0
      try {
        document.registerElement(tag.toLowerCase());
      } catch(err){} // Catch any errors and do nothing with them
    }
  }
  Kempo.version = { // Used to save the version numbers of all Kempo Plugins
    core: "0.16.0" // The version number of this "core" Kempo library
  };
  return Kempo; // Return the Kempo prototype to the global scope
})();
