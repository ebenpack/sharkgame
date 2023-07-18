let clicked = null;
const scale = 1.5;
const canvasContainer = document.getElementById("");
const canvas = document.getElementById("canvas");
const hitboxes = {};
canvas.addEventListener("click", (e) => {
  const canvasRect = canvas.getBoundingClientRect();
  const x = Math.floor(e.clientX - canvasRect.left);
  const y = Math.floor(e.clientY - canvasRect.top);

  for (const [id, vals] of Object.entries(hitboxes)) {
    if (vals[`${x}-${y}`]) {
      clicked = 21 - parseInt(id.split("-")[1], 10);
      drawFrame();
      break;
    }
  }
});
const drawFrame = async () => {
  // TODO: DRAWFRAME IS F'N SLOW
  const maxWidth = 390;
  const maxHeight = 404;

  const images = [
    {
      id: "background",
      src: "background.png",
      width: 394,
      left: 29,
      top: 29,
    },
    {
      id: "frame",
      src: "frame.png",
      width: 448,
      left: 0,
      top: 0,
    },
    { id: "shark", src: "shark.png", width: 392, left: 30, top: 30 },
  ];

  for (i = 1; i <= 20; i++) {
    const src = i < 10 ? `tooth_0${i}.png` : `tooth_${i}.png`;
    images.push({
      id: `tooth-${i}`,
      src,
      width: 392,
      left: 30,
      top: 30,
      // TODO: THESE ARE COUNTING FROM DIFF DIRECTIONS THIS IS DUMB
      tint: 21 - i === clicked ? "#F00" : null,
    });
  }

  // find the largest dimesntions and set the canvas width/height to that
  images.forEach(({ width, height }) => {
    const scaledWidth = Math.floor(width * scale);
    const scaledHeight = Math.floor((maxHeight / maxWidth) * width * scale);
    if (canvas.width < scaledWidth) {
      canvas.width = scaledWidth;
    }
    if (canvas.height < scaledHeight) {
      canvas.height = scaledHeight;
    }
  });

  const backBuffer = window.OffscreenCanvas
    ? new OffscreenCanvas(canvas.width, canvas.height)
    : document.createElement("canvas");
  backBuffer.width = canvas.width;
  backBuffer.height = canvas.height;
  const backBufferCtx = backBuffer.getContext("2d");

  backBufferCtx.imageSmoothingEnabled = false;

  const buffer = document.createElement("canvas");
  buffer.width = canvas.width;
  buffer.height = canvas.height;

  const btx = buffer.getContext("2d");
  btx.imageSmoothingEnabled = false;

  const container = document.createElement("div");

  const makeImg = async ({ id, src, width, left, top, tint = null }) => {
    const img = document.createElement("img");
    img.src = `images/${src}`;
    container.appendChild(img);
    return new Promise((resolve) => {
      const scaledLeft = Math.floor(left * scale);
      const scaledTop = Math.floor(top * scale);
      const scaledWidth = Math.floor(width * scale);
      const scaledHeight = Math.floor((maxHeight / maxWidth) * width * scale);
      img.addEventListener("load", (e) => {
        if (tint) {
          btx.clearRect(0, 0, buffer.width, buffer.height);
          btx.drawImage(img, scaledLeft, scaledTop, scaledWidth, scaledHeight);

          // Now we'll multiply a rectangle of your chosen color
          btx.fillStyle = tint;
          btx.globalCompositeOperation = "multiply";
          btx.fillRect(0, 0, buffer.width, buffer.height);

          btx.globalAlpha = 0.5;
          btx.globalCompositeOperation = "destination-in";
          btx.drawImage(img, scaledLeft, scaledTop, scaledWidth, scaledHeight);
          backBufferCtx.drawImage(
            img,
            scaledLeft,
            scaledTop,
            scaledWidth,
            scaledHeight
          );
          backBufferCtx.drawImage(buffer, 0, 0, buffer.width, buffer.height);
        } else {
          if (id.startsWith("tooth")) {
            hitboxes[id] = {};
            const pixelFinder = document.createElement("canvas");
            pixelFinder.width = canvas.width;
            pixelFinder.height = canvas.height;
            const pxlCtx = pixelFinder.getContext("2d");
            pxlCtx.drawImage(
              img,
              scaledLeft,
              scaledTop,
              scaledWidth,
              scaledHeight
            );
            const imgd = pxlCtx.getImageData(0, 0, canvas.width, canvas.height);
            var pix = imgd.data;
            for (let i = 0; i < pix.length; i += 4) {
              const x = Math.round((i / 4) % canvas.width);
              const y = Math.round(i / 4 / canvas.height);
              const alpha = pix[i + 3];
              if (alpha > 20) {
                hitboxes[id][`${x}-${y}`] = true;
              }
            }
          }
          backBufferCtx.drawImage(
            img,
            scaledLeft,
            scaledTop,
            scaledWidth,
            scaledHeight
          );
        }
        resolve();
      });
    });
  };

  for (const img of images) {
    await makeImg(img);
  }
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(backBuffer, 0, 0, canvas.width, canvas.height);

  const drawHitboxen = () => {
    var imgData = ctx.createImageData(canvas.width, canvas.height); // only do this once per page
    for (let i = 0; i < imgData.data.length; i += 4) {
      imgData.data[i] = 0;
      imgData.data[i + 1] = 0;
      imgData.data[i + 2] = 0;
      imgData.data[i + 3] = 0;
    }
    for (const [id, vals] of Object.entries(hitboxes)) {
      for (const xy in vals) {
        const [x, y] = xy.split("-");
        const i =
          (canvas.height - 1 - parseInt(y)) * canvas.width + parseInt(x);

        imgData.data[i * 4] = 255;
        imgData.data[i * 4 + 3] = 255;
      }
    }
    // TODO: This wipes the canvas
    ctx.putImageData(imgData, 0, 0);
  };
  // Draw the polys (for debugging)
  // drawHitboxen();
};

drawFrame();
// TODO: Scan each tooth image and identify opaque pixels
//      (rather than use a fiddly polygon)
// Add a reset button
// Click cavity
// Tint cavity image red
// Click current thingy and hide teeth
// Show the solution
