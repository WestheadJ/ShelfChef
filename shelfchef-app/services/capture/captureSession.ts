let capturedPhotoUri: string | null = null;

export function setCapturedPhotoUri(uri: string) {
    capturedPhotoUri = uri;
}

export function getCapturedPhotoUri() {
    return capturedPhotoUri;
}

export function clearCapturedPhotoUri() {
    capturedPhotoUri = null;
}
