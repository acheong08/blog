+++
title = "Image scroller for a certain suspicious site"
+++

To be used with Tampermonkey

```js
(function() {
    let target = '#image-container';
    let ic = $("#image-container");
    let num = parseInt($("span.num-pages").first().text());
    let img = ic.find("img");
    let src = img.attr("src");
    let base = src.slice(0, src.lastIndexOf("/") + 1);
    let width = img.attr("width");
    let height = img.attr("height");
    let start = parseInt(window.location.pathname.slice(0, -1).split('/').pop()) + 1;
    let extensions = ['jpg', 'png', 'webp'];
    let cachedExtension = null;

    function insertImage(base, i, img) {
        let url = base + (i - 1).toString();
        let extension = $(img).attr('src').split('.').pop();

        if ($(target).find(`img[src$="${url}.${extension}"]`).length > 0) {
            $(`img[src$="${url}.${extension}"]`).after($(img));
        } else {
            $(img).appendTo(target);
        }
    }

    function loadImage(base, i, width, height) {
        function tryExtension(index) {
            let extension = extensions[index];
            let url = base + i.toString() + '.' + extension;
            let img = $('<img>').attr('src', url);
            img.one("load", function() {
                cachedExtension = extension;
                extensions.unshift(extensions.splice(index, 1)[0]);
                insertImage(base, i, this);
            });
            img.one("error", function() {
                if (index < extensions.length - 1) {
                    tryExtension(index + 1);
                }
            });
        }

        tryExtension(0);
    }

    for (let i = start; i <= num; i++){
        window.setTimeout(function() {
            loadImage(base, i, width, height);
        }, 750 * (i - start));
    }
})();
```

Clicker on thumbnails for other site

```js
const interval = setInterval(() => {
    const thumbs = document.getElementsByClassName('fileThumb');
    console.log(thumbs)
    if (thumbs.length > 0) {
        for (let i = 0; i < thumbs.length; i++) {
            thumbs[i].click();
        }
        clearInterval(interval);
    }
}, 500);
```

Fix scroll on sites that disable it (for ad reasons)

```js
// Remove inline onscroll handlers
window.onscroll = null;
document.onscroll = null;

// Override addEventListener to block new scroll listeners
const origAddEventListener = EventTarget.prototype.addEventListener;
EventTarget.prototype.addEventListener = function(type, listener, options) {
  if (type === 'scroll') return;
  return origAddEventListener.call(this, type, listener, options);
};

// Remove CSS that disables scrolling
document.body.style.overflow = 'auto';
document.documentElement.style.overflow = 'auto';

// Remove scroll-blocking event handlers on body
['touchmove', 'wheel', 'mousewheel'].forEach(evt => {
  window.addEventListener(evt, e => e.stopImmediatePropagation(), true);
  document.addEventListener(evt, e => e.stopImmediatePropagation(), true);
});
```
