export const getVideoAudioStream = (video=true, audio=true) => {
    let quality = null;
    if (quality) quality = parseInt(quality);
    const constraints = {
        video: video ? {
            frameRate: quality ? quality : 12,
            noiseSuppression: true,
            width: {min: 640, ideal: 1280, max: 1920},
            height: {min: 480, ideal: 720, max: 1080}
        } : false,
        audio: audio,
    };
    // Always use the standard getUserMedia
    return navigator.mediaDevices.getUserMedia(constraints);
}