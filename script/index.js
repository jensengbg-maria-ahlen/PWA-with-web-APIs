if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(reg => {
            console.log('Registration succeeded. Scope is ' + reg.scope);
        });
}

window.addEventListener('load', () => {
    if ('mediaDevices' in navigator) {
        cameraSettings();
    }

    if ('geolocation' in navigator) {
        locationSettings();
    }

    notifications()
})