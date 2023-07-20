import { cli } from "webpack-dev-server";

type Image = {
  id: string;
  src: string;
  width: number;
  left: number;
  top: number;
};

type ScaledImage = Image & { height: number };

type ScaledImageWithImage = ScaledImage & { image: HTMLImageElement };

type ScaledImageWithImageWithCanvas = ScaledImageWithImage & {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
};

type ScaledImageWithImageWithCanvasWithRenderSettings =
  ScaledImageWithImageWithCanvas & {
    tint?: { color: string; alpha: number } | null;
    clear?: true;
  };

type Solution = {
  rem: number;
  quot: number;
};

const solve = (cavity: number, remaining: number): Solution => {
  // Divide the target number minus 1 by 4 and take the remainder
  // (or modulus, for the math nerds), as well as keeping the quotient handy.
  // (18-1)/4 is 4 with a remainder of 1. This remainder is important,
  // but so is the quotient, so keep 1 and 4 in mind.
  const target = remaining - cavity - 1;
  const rem = target % 4;
  const quot = Math.floor((target - 1) / 4);
  return { rem, quot };
};

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

const main = async () => {
  const scale = 1.5;
  const canvasContainer = document.getElementById("shark-game");
  if (!canvasContainer) {
    throw new Error("Container not found");
  }
  const hitboxes: {
    ids: Record<string, true>;
    hitboxes: Record<string, string>;
  } = {
    ids: {},
    hitboxes: {},
  };

  const maxWidth = 390;
  const maxHeight = 404;
  let actualWidth = 0;
  let actualHeight = 0;

  let images: Image[] = [
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
  const scaledImages: ScaledImage[] = images.map(
    ({ width, left, top, ...rest }) => ({
      width: Math.floor(width * scale),
      height: Math.floor((maxHeight / maxWidth) * width * scale),
      left: Math.floor(left * scale),
      top: Math.floor(top * scale),
      ...rest,
    })
  );

  // find the largest dimesntions and set the canvas width/height to that
  scaledImages.forEach(({ width, height }) => {
    if (actualWidth < width) {
      actualWidth = width;
    }
    if (actualHeight < height) {
      actualHeight = height;
    }
  });
  canvasContainer.style.position = "relative";
  canvasContainer.style.width = `${actualWidth}px`;
  canvasContainer.style.height = `${actualHeight}px`;

  const makeImg = async (image: ScaledImage): Promise<ScaledImageWithImage> => {
    const { id, src, width, height, left, top } = image;
    const container = document.createElement("div");
    const img = document.createElement("img");
    img.src = `images/${src}`;
    container.appendChild(img);
    return new Promise((resolve) => {
      const onLoad = (e: Event) => {
        if (id.startsWith("tooth") && !hitboxes.ids[id]) {
          hitboxes.ids[id] = true;
          const pixelFinder = document.createElement("canvas");
          pixelFinder.width = actualWidth;
          pixelFinder.height = actualHeight;
          const pxlCtx = pixelFinder.getContext("2d");
          if (!pxlCtx) {
            throw new Error("Something wonky with this context yo");
          }
          pxlCtx.drawImage(img, left, top, width, height);
          const imgd = pxlCtx.getImageData(0, 0, actualWidth, actualHeight);
          var pix = imgd.data;
          for (let x = 0; x < actualWidth; x++) {
            for (let y = 0; y < actualHeight; y++) {
              const index = (y * actualWidth + x) * 4;
              const alpha = pix[index + 3];
              if (alpha > 1) {
                hitboxes.hitboxes[`${x}-${y}`] = id;
              }
            }
          }
        }
        resolve({ ...image, image: img });
        img.removeEventListener("load", onLoad);
      };
      img.addEventListener("load", onLoad);
    });
  };

  const scaledImagesWithImages = await Promise.all(scaledImages.map(makeImg));

  const makeCanvas = (
    image: ScaledImageWithImage
  ): ScaledImageWithImageWithCanvas => {
    const canvas = document.createElement("canvas");
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.background = "transparent";
    canvas.width = actualWidth;
    canvas.height = actualHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Something wonky with this context yo");
    }
    ctx.imageSmoothingEnabled = false;
    canvasContainer.appendChild(canvas);
    return { ...image, canvas, ctx };
  };

  const scaledImagesWithImagesWithCanvases =
    scaledImagesWithImages.map(makeCanvas);

  const drawImg = (img: ScaledImageWithImageWithCanvasWithRenderSettings) => {
    const { ctx, image, left, top, width, height, tint = null, clear } = img;
    if (clear) {
      ctx.clearRect(0, 0, actualWidth, actualHeight);
    } else if (tint) {
      const { color, alpha = 0.5 } = tint;
      const backBuffer = document.createElement("canvas");
      backBuffer.width = actualWidth;
      backBuffer.height = actualHeight;
      const btx = backBuffer.getContext("2d");
      if (!btx) {
        throw new Error("Something wonky with this context yo");
      }
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

  scaledImagesWithImagesWithCanvases.forEach((img) => drawImg(img));

  type SelectCavity = { state: "select-cavity" };
  type SelectTooth = {
    state: "select-tooth";
    cavity: number;
    selected: number | null;
  };
  type Win = {
    state: "win";
    cavity: number;
    selected: number | null;
  };
  type State = SelectCavity | SelectTooth | Win;
  let state: State = { state: "select-cavity" };
  const clickLock: { lock: null | Promise<void> } = { lock: null };

  const resetButton = document.getElementById("reset");
  if (!resetButton) {
    throw new Error("Reset button not found");
  }
  resetButton.addEventListener("click", async () => {
    if (clickLock.lock) {
      await clickLock.lock;
    }
    state = { state: "select-cavity" };
    scaledImagesWithImagesWithCanvases
      .filter((i) => i.id.startsWith("tooth"))
      .map(drawImg);
  });

  canvasContainer.addEventListener("click", async (e) => {
    if (clickLock.lock !== null) {
      return;
    }
    clickLock.lock = new Promise(async (res) => {
      const canvasRect = canvasContainer.getBoundingClientRect();
      const x = Math.floor(e.offsetX);
      const y = Math.floor(e.offsetY);
      const hitboxId = hitboxes.hitboxes[`${x}-${y}`];
      if (hitboxId) {
        const image = scaledImagesWithImagesWithCanvases.find(
          ({ id }) => id === hitboxId
        );
        if (image) {
          const target = parseInt(hitboxId.split("-")[1], 10);
          if (state.state === "select-cavity") {
            drawImg({ ...image, tint: { color: "#F00000", alpha: 0.3 } });
            state = { state: "select-tooth", cavity: target, selected: null };
          } else if (
            target < state.cavity &&
            (state.selected == null || state.selected < target)
          ) {
            // Hide all teeth up to this one
            for (let i = state.selected ?? 1; i <= target; i++) {
              const image = scaledImagesWithImagesWithCanvases.find(
                ({ id }) => id === `tooth-${i}`
              );
              if (image) {
                drawImg({ ...image, clear: true });
                await sleep(150);
              }
            }
            if (target + 1 === state.cavity) {
              state = {
                state: "win",
                cavity: state.cavity,
                selected: target,
              };
            } else {
              state = {
                state: "select-tooth",
                cavity: state.cavity,
                selected: target,
              };
            }
          }
        }
        const instructionsContent = document.getElementById(
          "instructions-content"
        );
        if (!instructionsContent) {
          throw new Error("Instructions content area not found");
        }
        switch (state.state) {
          case "select-cavity": {
            instructionsContent.textContent =
              "Select the tooth with the cavity!";
            break;
          }
          case "select-tooth": {
            // TODO: Try to always count from the same side.
            const { rem } = solve(
              21 - state.cavity,
              21 - (state.selected || 0)
            );
            instructionsContent.textContent = `Select the currently played tooth!\nIf it's your turn, then play ${
              rem || 1
            }!`;
            break;
          }
          case "win": {
            instructionsContent.textContent = `If it's your turn, then you've won!`;
            break;
          }
        }
      }
      res();
    });
    await clickLock.lock;
    clickLock.lock = null;
  });

  const _drawHitboxen = () => {
    const canvas = document.createElement("canvas");
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.background = "transparent";
    canvas.width = actualWidth;
    canvas.height = actualHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Something wonky with this context yo");
    }
    ctx.imageSmoothingEnabled = false;
    const img = ctx.getImageData(0, 0, actualWidth, actualHeight);
    const { data } = img;
    for (const hitboxId in hitboxes.hitboxes) {
      const [x, y] = hitboxId.split("-");
      const index = parseInt(y, 10) * actualWidth + parseInt(x, 10);
      data[index * 4] = 255;
      data[index * 4 + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    canvasContainer.appendChild(canvas);
  };

  // TODO:
  // Fix instructions pane height
  // Improve instructions copy
  // Responsivize
};

main();
