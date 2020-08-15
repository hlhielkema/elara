const cache = {};

function createSvgElement(src, w, h) {
    const cacheKey = `${src};${w}x${h}`;
    if (cache[cacheKey] === undefined) {
        const placeholder = document.createElement('div');
        fetch(src).then((data) => data.text()).then((data) => {
            const el = document.createElement('div');
            el.innerHTML = data;
            const svg = el.querySelector('svg');
            svg.removeAttribute('xmlns:a');
            svg.setAttribute('width', `${w}px`);
            svg.setAttribute('height', `${h}px`);
            placeholder.parentNode.replaceChild(svg, placeholder);
            cache[cacheKey] = svg;
        });
        return placeholder;
    }

    return cache[cacheKey].cloneNode(true);
}

export default {
    createSvgElement,
};
