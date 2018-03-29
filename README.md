# Kempo

> *v 0.19 beta*

A small library that packs a big punch.

```javascript
Kempo("my-element", {
  added: function(){
    console.log('A new "my-element" was attached to the DOM.', this);
  },
  changed: function(change){
  	console.log("The following change was made to this element.", this, change);
  },
  removed: function(){
  	console.log("This element was removed from the DOM.", this);
  }
});
```

![Kempo Icon](docs/Kempo.png)

### Why use Kempo?

##### Works Today

"Custom Elements are coming, Custom Elements are coming".

For 3+ years we have listened to the "experts" tell us that ES6 Custom Elements are coming... **but they're not**. Even when ES6 does come... what do we do about old browsers? We will have to:

1. Write our fancy code in ES6.
2. Compile to ES5 using Babel
3. Use a backend library to determine if the browser supports ES6.
4. If it does then serve it the ES6.
5. if it doesn't then serve it the larger ES5 Babelified code.

...Ain't nobody got time for that.

**Kempo** is written in ES5 and can be used in all* browsers right now, no more waiting.

_*Requires `MutationObserver` which can be easily polyfilled._

##### Small

Other frameworks that claim to be "small" are around 3-4kb; **Kempo** is about 1/3th of the size of these "small" frameworks coming in at 1.1kb when compressed and gzipped.

##### Custom Attributes

**Kempo** Not only has custom elements, but it also allows you to define custom attributes.

```javascript
Kempo("[custom-attribute]", {
  added: function(name, newValue){
    console.log('The "'+name+'" attribute was added to', this, 'with a value of "'+newValue+'.');
  },
  changed: function(name, oldValue, newValue){
    console.log('The "'+name+'" attribute was changed on', this, 'from "'+oldValue+'" to "'+newValue'".');
  },
  removed: function(name, oldValue){
    console.log('The "'+name'" attribute, which had a value of "'+oldValue+'", was removed from', this);
  }
})
```

### Getting Started with Custom Elements

##### 1. Declare a custom element

```javascript
Kempo("my-element", {})
```

Declare a custom element by passing the tag name and options into the `Kempo(tag, options)` function. The `options` argument is optional.

##### 2. Create an `added` option

```javascript
Kempo("my-element", {
  added: function(){
    // The newly added element is the context
    console.log(this);
  }
});
```

When a new `<my-element>` is added to the DOM the `added` option will be called and the element will become its context.

##### 3. Create a `changed` option

```javascript
Kempo("my-element", {
  /* ... */
  changed: function(change){
    // The changed element is the context
    console.log(this);
    // The only argument is an object that represents the change that occurred
    console.log(change);
  }
});
```

When a change is made to the element the `changed` option will be called, the element will become its context and an object representing the change is passed into the `changed` option.

If the change was an attribute change, the "change" object will look like this:

```javascript
{
  attribute: {
    name: "class", // The name of the attribute that was changed
    oldValue: "myclass1", // The previous attribute value, null = this is a new attribute
    newValue: "myclass2" // The new attribute value, null = this attribute was removed
  }
}
```

If the change was child nodes being added, the "change" object will look like this:

```javascript
{
  children: {
    added: [element, element, element] // An array of the added child nodes
  }
}
```

If the change was child nodes being removed, the "change" object will look like this:

```javascript
{
  children: {
    removed: [element, element, element] // An array of the removed child nodes
  }
}
```

If the change was a text change, the "change" object will look like this:

```javascript
{
  text: {
    oldValue: "The old inner text",
    newValue: "The new inner text"
  }
}
```

##### 4. Create a `removed` option

```javascript
Kempo("my-element", {
  /* ... */
  removed: function(){
    // The recently removed element is the context
    console.log(this);
  }
});
```

When the element is removed from the DOM the `removed` option will be called and the element will become its context.

##### 5. Tell it what to watch for

```javascript
Kempo("my-element", {
  /* ... */
  watch: { // All properties are optional
    attributes: ["class", "info"],
    children: true,
    text: true
  }
});
```

The `watch` property is an object that describes what changes should trigger the `changed` option.

- `attributes`
  - `false` = Do not watch for changes to attributes.
  - `true` = Watch all attributes for changes.
  - Array = Only watch the attributes listed in the array.
- `children`
  - `true` = Watch for child nodes being added or removed from this element.
  - `false` = Do not watch for child nodes being added or removed from this element.
- `text`
  - `true` = Watch for the `innerText` of this element changing.
  - `false` = Do not watch for text changes.

### Getting Started with Custom Attributes

##### 1. Declare a custom attribute

```javascript
Kempo("[my-attribute]", {});
```

Declare a custom attribute by passing the attribute name wrapped with "[" and "]" into the `Kempo(attribute, options)` function. The `options` parameter is optional.

##### 2. Create an `added` method

```javascript
Kempo("[my-attribute]", {
  added: function(name, value){
    // The element that the attribute was added to is the context
    console.log(this);
    // The first parameter is the name of the attribute that was added
    console.log(name);
    // The second parameter is the value of the newly added attribute
    console.log(value);
  }
});
```

When the `my-attribute` attribute is added to any element in the DOM the `added` option will be called and the element will become the context. The first parameter will be the name of the newly added attribute and the second parameter will be the value of the newly added attribute.


##### 3. Create a `changed` method

```javascript
Kempo("[my-attribute]", {
  /* ... */
  changed: function(name, oldValue, newValue){
    // The element that the attribute belongs to is the context
    console.log(this);
    // The first parameter is the name of the attribute that was changed
    console.log(name);
    // The second parameter is the old value of the attribute
    console.log(oldValue);
    // The third parameter is the new value of the attribute
    console.log(newValue);
  }
});
```

When the value of this custom attribute is changed on any element in the DOM the `changed` option will be called, the context will become the element. The first parameter is the name of the attribute that was changed, the second parameter is the old value of the attribute and the third parameter is the new value of the attribute.

##### 4. Create a `removed` method

```javascript
Kempo("[my-attribute]", {
  /* ... */
  removed: function(name, oldValue){
    // The element that the attribute was removed from is the context
    console.log(this);
    // The first parameter is the name of the attribute that was removed
    console.log(name);
    // The second parameter is the old value of the attribute before it was removed
    console.log(oldValue);
  }
})
```

When a custom attribute is removed from any element in the DOM, the `removed` option will be called, the context will be the element that it was removed from. The first parameter is the name of that attribute that was removed and the second parameter is what the value of the attribute was before it was removed.


### License

Authored By: [Dustin Poissant](https://github.com/dustinpoissant/)

[dustinpoissant@gmail.com](mailto:dustinpoissant@gmail.com)

License: [CC-BY-NC-SA 3.0](https://creativecommons.org/licenses/by-nc-sa/3.0/)
