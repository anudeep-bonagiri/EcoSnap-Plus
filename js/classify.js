let model, webcam, labelContainer, maxPredictions;

async function init() {
  const URL = "models/";
  model = await tmImage.load(URL + "model.json", URL + "metadata.json");

  webcam = new tmImage.Webcam(224, 224, true);
  await webcam.setup();
  await webcam.play();
  window.requestAnimationFrame(loop);

  document.getElementById("webcam").replaceWith(webcam.canvas);

  labelContainer = document.getElementById("label-container");
  maxPredictions = model.getTotalClasses();
}

async function loop() {
  webcam.update();
  window.requestAnimationFrame(loop);
}

async function predict() {
  const prediction = await model.predict(webcam.canvas);
  labelContainer.innerHTML = "";
  prediction.forEach(p => {
    const label = `${p.className}: ${(p.probability * 100).toFixed(2)}%`;
    labelContainer.innerHTML += `<div>${label}</div>`;
  });
}
