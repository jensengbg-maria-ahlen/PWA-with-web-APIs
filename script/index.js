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

    notificationSettings()
})


function cameraSettings() {
    const startStreamButton = document.querySelector('.startStream');
    const stopStreamButton = document.querySelector('.stopStream');
    const takePictureButton = document.querySelector('.takePicture');
    const profilePicture = document.querySelector('#profilePicture');
    const errorMessage = document.querySelector('.errorMessage');

    let stream;

    startStreamButton.addEventListener('click', async () => {
        errorMessage.innerHTML = '';
        try {
            const md = navigator.mediaDevices;
            stream = await md.getUserMedia({
                video: {width: 320, height: 320}
            })
            
            const video = document.querySelector('.video > video');
            video.srcObject = stream;
            stopStreamButton.disabled = false;
            takePictureButton.disabled = false;
            startStreamButton.disabled = true;

        } catch (e) {
            errorMessage.innerHTML = 'Could not show camera window';
            console.log('Error: ', e)
        }
    });

    stopStreamButton.addEventListener('click', () => {
        errorMessage.innerHTML = '';
        if(!stream) {
            errorMessage.innerHTML = 'No video to stop.';
            return;
        }

        let tracks = stream.getTracks();
        tracks.forEach(track => track.stop());

        stopStreamButton.disabled = true;
        takePictureButton.disabled = true;
        startStreamButton.disabled = false;
    });

    takePictureButton.addEventListener('click', async () => {
        if(!stream) {
            errorMessage.innerHTML = 'No video to take pictures from.';
            return;
        }

        let tracks = stream.getTracks();
        let videoTrack = tracks[0];
        let capture = new ImageCapture(videoTrack);
        
        let blob = await capture.takePhoto();
        let imgUrl = URL.createObjectURL(blob);
        profilePicture.src = imgUrl;
        profilePicture.classList.remove('hidden');
    })

}

function locationSettings() {
    const locationButton = document.querySelector('#locationButton');
    const position = document.querySelector('.position');

    locationButton.addEventListener('click', () => {
        try {
            const geo = navigator.geolocation;

            geo.getCurrentPosition( pos => {
                let lat = pos.coords.latitude;
                let lng = pos.coords.longitude;
                position.innerHTML = `You are at Latitude: ${lat}°, Longitude: ${lng}°.`;
                getAdressFromPosition(lat, lng, position);
            }, error => {
                position.innerHTML = 'Please <em>allow</em> position and I will tell you where you are.';
                console.log(error);
            });
        } catch (e) {
            position.innerHTML = 'This device does not have access to the Geolocation API.';
        }
    })

    async function getAdressFromPosition(lat, lng, position) {
        try {
            const response = await fetch(`https://geocode.xyz/${lat},${lng}?json=1`);
            const data = await response.json();

            if(data.error) {
                position.innerHTML += `<br> Could not get location information at this time. Try again later!`;
            } else {
                const city = data.city;
                const country = data.country;
                position.innerHTML += `<br> It's in ${city}, ${country}.`;
            }
        } catch (error) {
            position.innerHTML += `<br> Could not find your city. Errormessage ${error}`
        }
    }

    
    
}

function notificationSettings() {

}