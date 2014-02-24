border-animate.js 
=================
Effortless border animations.


Demo
----
The algorithm is simple: (1) The bounding rect of the selected element is found (2) "faux borders" are created using divs (3) width/height of said divs are animated (4) upon animation completion, real borders are applied to element and faux borders removed from DOM.

<img src="https://raw2.github.com/briangonzalez/border-animate.js/master/misc/border-animate.gif" width='400px'>

How to use
----------
Create an element or elements on your page, with the `data-border-animate` attribute. Define your borders in order from `top|right|bottom|left`:

```html
<div class='animate-me' data-border-animate="1px solid blue, 1000, 0, left|1px solid blue, 1000, 0|1px solid blue, 1000, 0, right|1px solid blue, 1000, 0"></div>
```

Once the document is ready, select the element(s) you want to have a border animation, then call `run` on the selection:

__Using Vanilla JS:__

```javascript
document.addEventListener('DOMContentLoaded', function(){
  var selection = document.querySelectorAll('.animate-me');
  var b = new BorderAnimate();
  b.run(selection);
});
````

__Or, using jQuery:__

```javascript
$(document).ready(function(){
  var $selection = $('.animate-me');
  var b = new BorderAnimate();
  b.run($selection);
});
```

Furthermore, the `run` function takes an optional callback parameter as the second argument, which executes when all borders have finished animating:

```javascript
b.run($selection, function(el){
  console.log('Animation complete for: ', el)
});
````


Declaring your animation
------------------------
You can define your border animations using a declaritive approach within your `data-border-animate` attribute. Using the CSS convention (top, right, bottom, left), you can declare each border animation seperated by the pipe (`|`) character:

For example, using the `<div class='animate-me' data-border-animate='top|right|bottom|left'></div>` syntax:

```html
<div class='animate-me' data-border-animate="2px solid red, 1000, 0, left|1px solid blue, 500, 500|none|1px dashed green, 2000, 0"></div>
```

Would translate to:

* __TOP__: Apply a `2px solid red` border with an animation duration of __1000ms__ immeditely, and animate if from right to left
* __RIGHT__: Apply a `1px solid blue` border with an animation duration of __500ms__ after a delay of __500ms__
* __BOTTOM__: Do nothing to the bottom border
* __RIGHT__: Apply a `1px dashed green` border with an animation duration of __2000ms__ immediately.

The result:

<img src="https://raw2.github.com/briangonzalez/border-animate.js/master/misc/border-animate-2.gif" width='400px'>


Author
------
| ![twitter/brianmgonzalez](http://gravatar.com/avatar/f6363fe1d9aadb1c3f07ba7867f0e854?s=70](http://twitter.com/brianmgonzalez "Follow @brianmgonzalez on Twitter") |
|---|
| [Brian Gonzalez](http://briangonzalez.org) |
