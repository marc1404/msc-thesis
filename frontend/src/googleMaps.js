export default new Promise(resolve => {
    window.initGoogleMaps = resolve;
    const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
    const googleMapsScript = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&callback=initGoogleMaps`;
    const script = document.createElement('script');
    script.src = googleMapsScript;
    script.async = true;
    script.defer = true;

    document.head.appendChild(script);
});