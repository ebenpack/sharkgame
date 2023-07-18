const main = async () => {
  const scale = 1.5;
  const canvasContainer = document.getElementById("shark-game");
  const hitboxes = {};

  // TODO: DRAWFRAME IS F'N SLOW
  const maxWidth = 390;
  const maxHeight = 404;
  let actualWidth = 0;
  let actualHeight = 0;

  let images = [
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
    ...[...Array(20)].map((_, index) => {
      const i = index + 1;
      return {
        id: `tooth-${i}`,
        src: i < 10 ? `tooth_0${i}.png` : `tooth_${i}.png`,
        width: 392,
        left: 30,
        top: 30,
      };
    }),
  ];

  // Scale everything
  images = images.map(({ width, height, left, top, ...rest }) => ({
    width: Math.floor(width * scale),
    height: Math.floor((maxHeight / maxWidth) * width * scale),
    left: Math.floor(left * scale),
    top: Math.floor(top * scale),
    ...rest,
  }));

  // find the largest dimesntions and set the canvas width/height to that
  images.forEach(({ width, height }) => {
    if (actualWidth < width) {
      actualWidth = width;
    }
    if (actualHeight < height) {
      actualHeight = height;
    }
  });
  canvasContainer.style = `position: relative; width: ${actualWidth}px; height: ${actualHeight}`;

  const makeImg = async (image) => {
    const { id, src, width, height, left, top } = image;
    const container = document.createElement("div");
    const img = document.createElement("img");
    img.src = `images/${src}`;
    container.appendChild(img);
    return new Promise((resolve) => {
      img.addEventListener("load", (e) => {
        // if (tint) {
        //   btx.clearRect(0, 0, buffer.width, buffer.height);
        //   btx.drawImage(img, left, top, width, height);

        //   // Now we'll multiply a rectangle of your chosen color
        //   btx.fillStyle = tint;
        //   btx.globalCompositeOperation = "multiply";
        //   btx.fillRect(0, 0, buffer.width, buffer.height);

        //   btx.globalAlpha = 0.5;
        //   btx.globalCompositeOperation = "destination-in";
        //   btx.drawImage(img, left, top, width, height);
        //   backBufferCtx.drawImage(img, left, top, width, height);
        //   backBufferCtx.drawImage(buffer, 0, 0, buffer.width, buffer.height);
        // } else {
        if (id.startsWith("tooth") && !hitboxes[id]) {
          hitboxes[id] = {};
          const pixelFinder = document.createElement("canvas");
          pixelFinder.width = actualWidth;
          pixelFinder.height = actualHeight;
          const pxlCtx = pixelFinder.getContext("2d");
          pxlCtx.drawImage(img, left, top, width, height);
          const imgd = pxlCtx.getImageData(0, 0, actualWidth, actualHeight);
          var pix = imgd.data;
          for (let i = 0; i < pix.length; i += 4) {
            const x = Math.round((i / 4) % actualWidth);
            const y = Math.round(i / 4 / actualHeight);
            const alpha = pix[i + 3];
            if (alpha > 20) {
              hitboxes[id][`${x}-${y}`] = true;
            }
          }
        }
        // }
        resolve({ ...image, image: img });
      });
    });
  };

  images = await Promise.all(images.map(makeImg));

  const makeCanvas = (image) => {
    const canvas = document.createElement("canvas");
    canvas.style =
      "position: absolute; top:0; left:0; background: transparent;";
    canvas.width = actualWidth;
    canvas.height = actualHeight;
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    canvasContainer.appendChild(canvas);
    return { ...image, canvas, ctx };
  };

  images = images.map(makeCanvas);

  const drawImg = (img, { tint = null, clear = false } = {}) => {
    const { ctx, image, left, top, width, height } = img;
    if (clear) {
      ctx.clearRect(0, 0, actualWidth, actualHeight);
    } else if (tint) {
      const { color, alpha = 0.5 } = tint;
      const backBuffer = document.createElement("canvas");
      backBuffer.width = actualWidth;
      backBuffer.height = actualHeight;
      const btx = backBuffer.getContext("2d");
      btx.clearRect(0, 0, actualWidth, actualHeight);
      btx.drawImage(image, left, top, width, height);

      // Now we'll multiply a rectangle of your chosen color
      btx.fillStyle = color;
      btx.globalCompositeOperation = "multiply";
      btx.fillRect(0, 0, actualWidth, actualHeight);

      btx.globalAlpha = alpha;
      btx.globalCompositeOperation = "destination-in";
      btx.drawImage(image, left, top, width, height);
      ctx.drawImage(backBuffer, 0, 0, actualWidth, actualHeight);
    } else {
      ctx.drawImage(image, left, top, width, height);
    }
  };

  images.forEach((i) => drawImg(i));

  const state = { cavity: null, selected: null };

  canvasContainer.addEventListener("click", (e) => {
    const canvasRect = canvasContainer.getBoundingClientRect();
    const x = Math.floor(e.clientX - canvasRect.left);
    const y = Math.floor(e.clientY - canvasRect.top);

    for (const [hitboxId, vals] of Object.entries(hitboxes)) {
      if (vals[`${x}-${y}`]) {
        const image = images.find(({ id }) => id === hitboxId);
        if (image) {
          const target = parseInt(hitboxId.split("-")[1], 10);
          if (state.cavity === null) {
            drawImg(image, { tint: { color: "#F00000", alpha: 0.3 } });
            state.cavity = target;
            break;
          } else if (
            target < state.cavity &&
            (state.selected == null || state.selected > target)
          ) {
            // Hide all teeth up to this one
            for (let i = 1; i <= target; i++) {
              debugger;
              const image = images.find(({ id }) => id === `tooth-${i}`);
              console.log(image);
              if (image) {
                drawImg(image, { clear: true });
              }
            }
            state.step = "done";
          }
          break;
        }
      }
    }
  });
  // Show the solution when you click teeth (after cavity)
  //    a) if you're in a winnning position
  //    b) if not then play 1
  // Add a reset button
  // Add some explanatory text: state-dependent
};

main();
