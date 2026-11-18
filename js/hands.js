// Śledzenie dłoni przez kamerę: MediaPipe Hand Landmarker (21 punktów na dłoń).
const VERSION = '0.10.14';
const CDN = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${VERSION}`;
const MODEL =
  'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task';

export class HandTracker {
  constructor(video) {
    this.video = video;
    this.landmarker = null;
    this.lastVideoTime = -1;
    this.hands = [];
  }

  get ready() {
    return !!this.landmarker && this.video.readyState >= 2;
  }

  async init(onStatus = () => {}) {
    if (this.landmarker) return;
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error('Ta przeglądarka nie obsługuje kamery (uruchom grę przez http://localhost).');
    }
    onStatus('Włączam kamerę…');
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
      audio: false,
    });
    this.video.srcObject = stream;
    await this.video.play();

    onStatus('Ładuję model rozpoznawania dłoni…');
    const { HandLandmarker, FilesetResolver } = await import(`${CDN}/vision_bundle.mjs`);
    const fileset = await FilesetResolver.forVisionTasks(`${CDN}/wasm`);
    const options = (delegate) => ({
      baseOptions: { modelAssetPath: MODEL, delegate },
      runningMode: 'VIDEO',
      numHands: 2,
      minHandDetectionConfidence: 0.5,
      minHandPresenceConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
    try {
      this.landmarker = await HandLandmarker.createFromOptions(fileset, options('GPU'));
    } catch {
      this.landmarker = await HandLandmarker.createFromOptions(fileset, options('CPU'));
    }
    onStatus('');
  }

  /** Zwraca tablicę dłoni; każda dłoń to 21 punktów {x, y} w zakresie 0–1 (współrzędne obrazu z kamery). */
  detect() {
    if (!this.ready) return this.hands;
    if (this.video.currentTime === this.lastVideoTime) return this.hands;
    this.lastVideoTime = this.video.currentTime;
    const result = this.landmarker.detectForVideo(this.video, performance.now());
    this.hands = result.landmarks || [];
    return this.hands;
  }
}
