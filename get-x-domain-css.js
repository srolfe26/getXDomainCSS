function get_x_domain_css(url) {
    var link = document.createElement('link'),
        style,
        fi,
        promise = $.Deferred();
    
    // IE 8 & 9 are special children, as usual
    if (navigator.appVersion.indexOf("MSIE") != -1) {
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = url;
         
        link.onload = function () {
            promise.resolve();
        }
         
        document.getElementsByTagName('head')[0].appendChild(link);
    }
    else {
        style = $('<style>')
            .text('@import "' + url + '"')
            .attr({
                 'data-uri': url,
                 'data-version': '0.1'
            })
            .appendTo('body');
        fi = setInterval(function() {
            try {
                style[0].sheet.cssRules; // <--- MAGIC: only populated when file is loaded
                promise.resolve();
                clearInterval(fi);
            } catch (e){}
        }, 10);   
    }

    return promise;
}
