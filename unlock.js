// Replace with your Teachable Machine model URL
const URL = "https://teachablemachine.withgoogle.com/models/hTY7ennyH/";

let model, webcam, maxPredictions;
let unlocked = false;
const CONFIDENCE = 0.85;
const REQUIRED_FRAMES = 5;
let upCount = 0;

async function init() {
  try {
   
    // Load the model
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Setup webcam
    webcam = new tmImage.Webcam(320, 240, true); // width, height, flip
    await webcam.setup();    // asks for permission
    await webcam.play();     // starts the stream
    document.getElementById("webcam-container").appendChild(webcam.canvas);

    window.requestAnimationFrame(loop);
  } catch (err) {
    console.error("Webcam init failed:", err);
    document.getElementById("status").innerText =
      "⚠️ Webcam access denied! Check browser permissions.";
  }
}

async function loop() {
  webcam.update();
  await predict();
  if (!unlocked) window.requestAnimationFrame(loop);
}

async function predict() {
  const prediction = await model.predict(webcam.canvas);

  let upProb = 0;
  for (let i = 0; i < prediction.length; i++) {
    if (prediction[i].className.toLowerCase().includes("up")) {
      upProb = prediction[i].probability;
    }
  }

  document.getElementById("status").innerText =
    `Thumbs Up: ${(upProb * 100).toFixed(1)}%`;

  if (upProb > CONFIDENCE) {
    upCount++;
  } else {
    upCount = 0;
  }

  if (upCount >= REQUIRED_FRAMES && !unlocked) {
    unlocked = true;
    if (webcam.stop) webcam.stop();

    // Hide lock screen, show To-Do app
    document.getElementById("lock-screen").style.display = "none";
    document.getElementById("todo-app").style.display = "block";
  }
}
