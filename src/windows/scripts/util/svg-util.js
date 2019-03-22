var svgUtil = {
    cache: { },
    createSvgElement: function (src, w, h) {
        var cacheKey = src + ';' + w + 'x' + h;
        if (svgUtil.cache[cacheKey] === undefined) {
            var placeholder = document.createElement('div');            
            fetch(src).then(function (data) {
                return data.text();
            }).then(function (data) {
                var el = document.createElement('div');
                el.innerHTML = data;
                var svg = el.querySelector('svg');
                svg.removeAttribute('xmlns:a')
                svg.setAttribute('width', w + 'px');
                svg.setAttribute('height', h + 'px');                
                placeholder.parentNode.replaceChild(svg, placeholder);
                svgUtil.cache[cacheKey] = svg;
            });            
            return placeholder;
        }
        else {
            return svgUtil.cache[cacheKey].cloneNode(true);
        }        
    }
};