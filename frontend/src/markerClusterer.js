export default new Promise(resolve => {
    const script = document.createElement('script');
    script.src = 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/markerclusterer.js';
    script.async = true;
    script.defer = true;
    script.onload = resolve;

    document.head.appendChild(script);
})