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
        timeout = 60000,                        // 1 minute seems like a good timeout
        counter = 0,                            // Used to compare try time against timeout
        step = 30,                              // Amount of wait time on each load check
        docStyles = document.styleSheets        // local reference
        ssCount = docStyles.length,             // Initial stylesheet count
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
            
        // This setInterval will detect when style rules for our stylesheet have loaded.
        interval = setInterval(function() {
            try {
                // This will fail in Firefox (and kick us to the catch statement) if there are no 
                // style rules.
                style[0].sheet.cssRules;
                
                // The above statement will succeed in Chrome even if the file isn't loaded yet
                // but Chrome won't increment the styleSheet length until the file is loaded.
                if(ssCount === docStyles.length) {
                    throw(url + ' not loaded yet');
                }
                else {
                    var loaded = false,
                        href,
                        n;

                    // If there are multiple files being loaded at once, we need to make sure that 
                    // the new file is this file
                    for (n = docStyles.length - 1; n >= 0; n--) {
                        href = docStyles[n].cssRules[0].href;
                        
                        if (typeof href != 'undefined' && href === url) {
                            // If there is an HTTP error there is no way to consistently
                            // know it and handle it. The file is considered 'loaded', but
                            // the console should will the HTTP error.
                            loaded = true;
                            break;
                        }
                    }
                    
                    if (loaded === false) {
                        throw(url + ' not loaded yet');
                    }
                }
                
                // If an error wasn't thrown by now, the stylesheet is loaded, proceed.
                promise.resolve();
                clearInterval(interval);
            } catch (e) {
                counter += step;

                if (counter > timeout) {
                    // Time out so that the interval doesn't run indefinitely.
                    clearInterval(interval);
                    promise.reject();
                }
                
            }
        }, step);   
    }

    return promise;
}
