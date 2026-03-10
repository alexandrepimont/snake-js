importScripts('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest');

const MODEL_PATH = `yolov5n_web_model/model.json`;
const LABELS_PATH = `yolov5n_web_model/labels.json`;
let _labels = []
let _model = null

async function loadModel() {
    await tf.ready()

    _labels = await (await fetch(LABELS_PATH)).json()
    _model = await tf.loadGraphModel(MODEL_PATH)
    debugger;
}

loadModel();


self.onmessage = ({ data }) => {
    if (data.type !== 'predict') {
        return;
    }

    const width = self.innerWidth || 640;
    const height = self.innerHeight || 360;

    postMessage({
        type: 'prediction',
        x: 2 * width,
        y: 2 * height,
        score: data.score ?? 0,
    });
};