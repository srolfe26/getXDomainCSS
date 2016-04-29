/*!
 * getXDomainCSS 0.1
 * https://github.com/srolfe26/getXDomainCSS
 * MIT License 2016 Stephen Rolfe Nielsen
 */


/**
 * Retrieves CSS files from a cross-domain source via javascript. Provides a jQuery implemented
 * promise object that can be used for callbacks for when the CSS is actually completely loaded.
 * The 'onload' function works for IE, while the 'style/cssRules' version works everywhere else
 * and accounts for differences per-browser.
 *
 * @param   {String}    url     The url/uri for the CSS file to request
 * 
 * @returns {Object}    A jQuery Deferred object that can be used for 
 */
function getXDomainCSS(url) {
    var link,
        style,
        interval,
        promise = $.Deferred();
    
    // IE 8 & 9 it is best to use 'onload'. style[0].sheet.cssRules has problems.
    if (navigator.appVersion.indexOf("MSIE") != -1) {
        link = document.createElement('link');
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = url;
         
        link.onload = function () {
            promise.resolve();
        }
         
        document.getElementsByTagName('head')[0].appendChild(link);
    }
    
    // Support for FF, Chrome, Safari, and Opera
    else {
        style = $('<style>')
            .text('@import "' + url + '"')
            .attr({
                 // Adding this attribute allows the file to still be identified as an external
                 // resource in developer tools.
                 'data-uri': url
            })
            .appendTo('body');
            
        interval = setInterval(function() {
            try {
                style[0].sheet.cssRules;
                promise.resolve();
                clearInterval(interval);
            } catch (e){}
        }, 10);   
    }

    return promise;
}
