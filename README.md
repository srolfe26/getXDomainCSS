# getXDomainCSS

A small jQuery dependent function for getting cross-domain CSS via javascript with a cross-browser (IE8-Evergreen) method for firing a callback on CSS loading.

## Usage

*Single File*

```
getXDomainCSS('https://www.tsheets.com/assets/_css/header.css').done(function() {
    alert('Single CSS file loaded before JS run!');
});
```

*Multiple Files*

```
var all_loaded = $.Deferred();
            
function loadCssMultiple() {
    if (all_loaded.state() != 'resolved') {        
        // How to load multiple CSS files before callback
        $.when.apply($, [
            getXDomainCSS('https://www.tsheets.com/assets/_css/header.css'),
            
            // You can get your non-x-domain CSS here too if you want
            getXDomainCSS('demo-styles.css'),
        ]).done(function() {
            all_loaded.resolve();
        });
    }
    
    // Perform JS
    all_loaded.done(function() {
        alert('Multiple CSS files loaded before JS run!');
    });   
}
```