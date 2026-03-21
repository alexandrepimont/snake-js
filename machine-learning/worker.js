import * as tf from 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.22.0/+esm';

const MODEL_PATH = './yolov5n_web_model/model.json';
const LABELS_PATH = './yolov5n_web_model/labels.json';
const INPUT_MODEL_DIMENTIONS = 640
const CLASS_THRESHOLD = 0.4
let _labels = [];
let _model = null;

async function loadModel() {
    await tf.ready();

    _labels = await (await fetch(LABELS_PATH)).json();
    _model = await tf.loadGraphModel(MODEL_PATH);
    const dummyInput = tf.ones(_model.inputs[0].shape);
    await _model.executeAsync(dummyInput);
    postMessage({
        type: 'model-ready',
        labelsCount: _labels.length,
    });
}

function preprocessImage(input) {
    return tf.tidy(() => {
        const imageTensor = tf.browser.fromPixels(input)
        const imageTest = tf.image
        .resizeBilinear(imageTensor, [INPUT_MODEL_DIMENTIONS, INPUT_MODEL_DIMENTIONS])
        .div(255)
        .expandDims(0);
        return imageTest;
    });
}

self.onmessage = ({ data }) => {
    if (data.type !== 'predict') {
        return;
    }

    
    const input = preprocessImage(data.image);
    debugger;
    
    const width = self.innerWidth || 640;
    const height = self.innerHeight || 360;

    postMessage({
        type: 'prediction',
        x: 2 * width,
        y: 2 * height,
        score: data.score ?? 0,
    });

    input.dispose();
};