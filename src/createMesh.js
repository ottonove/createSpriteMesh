import * as THREE from "three";

export const createMesh = function (drawText, scale, useSprite = true) {
  const CANVAS_MAX_WIDTH = 1200;
  const fontSize = 100;
  const fontConfig = `${fontSize}px courier`;
  const fontColor = "white";
  const fillStyle = "rgba(0, 128, 0, 0.5)";

  let ctx = null;

  function createCanvasForTexture(text) {
    const canvasForText = document.createElement("canvas");
    ctx = canvasForText.getContext("2d");

    // set canvas size widh fontConfig
    ctx.font = fontConfig;
    const metrics = ctx.measureText(text);
    if (CANVAS_MAX_WIDTH < metrics.width) {
      ctx.canvas.width = CANVAS_MAX_WIDTH;
    } else {
      ctx.canvas.width = metrics.width;
    }
    ctx.canvas.height =
      metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

    // draw canvas background
    ctx.fillStyle = fillStyle;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // draw text
    ctx.fillStyle = fontColor;
    ctx.font = fontConfig;
    ctx.fillText(
      text,
      0,
      ctx.canvas.height - metrics.actualBoundingBoxDescent,
      CANVAS_MAX_WIDTH
    );

    return canvasForText;
  }

  function spriteMesh(texture, scale) {
    const spriteMaterial = new THREE.SpriteMaterial({
      map: texture
    });
    const mesh = new THREE.Sprite(spriteMaterial);
    mesh.scale.set(scale.x, scale.y, scale.z);
    return mesh;
  }

  function planeMesh(texture, scale) {
    const geometry = new THREE.PlaneGeometry();
    const material = new THREE.MeshBasicMaterial({
      map: texture
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.scale.set(scale.x, scale.y, scale.z);
    return mesh;
  }

  function changeTexture(newText) {
    this.material.map.dispose();
    this.material.map = null; // ← これが必要かは不明
    const newCanvas = createCanvasForTexture(newText);
    const newTexture = new THREE.CanvasTexture(newCanvas);
    this.material.map = newTexture;
    this.scale.set(newCanvas.width * (scale / newCanvas.height), scale, 0);
  }

  const canvasTexture = new THREE.CanvasTexture(
    createCanvasForTexture(drawText)
  );

  // const sprite = spriteMesh(canvasTexture, {
  const mesh = useSprite
    ? spriteMesh(canvasTexture, {
        x: ctx.canvas.width * (scale / ctx.canvas.height),
        y: scale,
        z: 0
      })
    : planeMesh(canvasTexture, {
        x: ctx.canvas.width * (scale / ctx.canvas.height),
        y: scale,
        z: 0
      });

  mesh.changeTexture = changeTexture;

  return mesh;
};
