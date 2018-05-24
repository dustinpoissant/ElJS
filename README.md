# Kempo

> *v 0.20 beta*

A small library that packs a big punch.

### Observe Elements
_**Kempo**_ allows you to observe elements being added to or removed from the document.

```javascript
Kempo("p", {
  added: function(tagName){
    // this = the element
    console.log("This ", this, " element was added to the document.");
  },
  removed: function(tagName){
    // this = the element
    console.log("This ", this, " element was removed to the document.");
  }
});
```

### Observe Attributes
_**Kempo**_ allows you to observe attributes being added to the document, removed from the document or changed.

```javascript
Kempo("[title]", {
  added: function(attrName, newValue){
    // this = the element
    console.log('A '+attrName+' attribute was added to ', this, ' element with a value of "'+newValue+'".');
  },
  changed: function(attrName, newValue, oldValue){
    // this = the element
    console.log('A '+attrName+' attribute was changed on ', this, ' element from "'+oldValue+'" to "'+newValue+'".');
  },
  removed: function(attrName, oldValue){
    // this = the element
    console.log('A '+attrName+' attribute was removed from ', this, ' element with a value of "'+oldVlaue+'".');
  }
});
```

### Observe Classes
_**Kempo**_ allows you to observe a class being added to or removed from an element.

```javascript
Kempo(".myclass", {
  added: function(className){
    // this = the element
    console.log('A class of '+className+' was added to ', this);
  },
  removed: function(className){
    // this = the element
    console.log('A class of '+className+' was removed from ', this);
  }
});
```

### Observe Multiple Things
You can observe mutliple things at once by separacting them by a comma.

```javascript
Kempo("p, [title], .myclass", {
  added: function(){
    // this = the element
    // The arguments will change depending on what was added
    console.log(this, arguments);
  },
  removed: function(){
    // this = the element
    // The arguments will change depending on what was removed
    console.log(this, arguments);
  },
  changed: function(attrName, newValue, oldValue){
    // the "changed" method will only be called on attribute changes
    // this = the element
    console.log(this, arguments);
  }
})
```

### On DOM Ready
Passing a single function into Kempo will call it immediatly if the DOM is ready, if not it will be called once the DOM is read.

```javascript
Kempo(function(){
  console.log(document.body); // this will not cause an error even if ran from the head
});
```

### License

Authored By: [Dustin Poissant](https://github.com/dustinpoissant/)

[dustinpoissant@gmail.com](mailto:dustinpoissant@gmail.com)

License: [CC-BY-NC-SA 3.0](https://creativecommons.org/licenses/by-nc-sa/3.0/)
