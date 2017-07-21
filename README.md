# El.JS

> *v 0.1 beta*

![El.JS Logo](docs/ElJS-green.png)
Custom Elements Today.

```javascript
El("my-element", {
  attached: function(){
    console.log('A new "my-element" was attached to the DOM.', this);
  },
  changed: function(changes){
  	console.log("The following changes were made to this element.", this, changes);
  },
  detached: function(){
  	console.log("This element was removed from the DOM.", this);
  }
});
```

### Works Today

"Custom Elements are coming, Custom Elements are coming".

For 3+ years we have listened to the "experts" telling us that ES6 is coming... but it's not. Even when ES6 does come we do we do about old browsers? We will have to:

1. Write our fancy code in ES6.
2. Compile to ES5 using Babel
3. Use a backend library to determine if the browser supports ES6.
4. If it does then serve it the ES6.
5. if it doesn't then serve it the larger ES5 Babelified code.

...Ain't nobody got time for that. El.JS can be used in all browsers right now, no more waiting.

##### Small

Other frameworks that claim to be "small" are around 3-4kb; El.JS is about 1/4th of the size of these "small" frameworks coming in at 804 bytes when compressed and gzipped.

### Getting Started

##### 1. Declare a custom element

```javascript
El("my-element", {})
```

Declare a custom element by passing the tag name and options into `El(tag, options)`.

##### 2. Create an `attached` method.

```javascript
El("my-element", {
  attached: function(){
  	// The newly attacked element is the context, aka "this"
    console.log(this);
  }
})
```

When a new `<my-element>` is added to the DOM the `attached` function will be called and the element will become the context.

##### 3. Create a `changed` method.

```javascript
El("my-element", {
  /* ... */
  changed: function(changes){
  	// The changed element is the context, aka "this"
    console.log(this);
    // The first parameter represents the changes that occured
    console.log(changes);
  }
})
```

When a change is made to the element the `changed` function will be called, the element will become the context and an object representing the changes is passed to `changed` function.

##### 4. Create a `detached` method.
```javascript
El("my-element", {
  /* ... */
  detached: function(){
    // The recently detached element is the context, aka "this"
    console.log(this);
  }
});
```

When the element is removed from the DOM the `detached` function will be called and the element will become the context.

##### 5. Tell it what to watch for

```javascript
El("my-element", {
  /* ... */
  watch: { // All properties are optional
    attributes: "class name",
    children: true,
    text: true
  }
});
```

The `watch` property is an object that describes that changes should trigger the `changed` function.

- `attributes`
    - `false` = Do not watch for changes to attributes.
    - `true` = Watch all attributes for changes.
    - Array = Watch the attributes listed in the array.
    - String = Watch the attributes listed in the string (comma or space delimited).
  - `children`
    - `true` = Watch for nodes being added or removed from this element.
    - `false` = Do not watch for nodes being added or removed from this element.
  - `text`
    - `true` = Watch for the text changes within this element and it's children.
    - `false` = Do not watch for text changes.

 By default, the `watch` object has all properties set to `true`. Limiting this to only watch for specific changes will greatly increase your page's performance.


### License

Authored By: [Dustin Poissant](https://github.com/dustinpoissant/)

[dustinpoissant@gmail.com](mailto:dustinpoissant@gmail.com)

License: [CC-BY-NC-SA 3.0](https://creativecommons.org/licenses/by-nc-sa/3.0/)
