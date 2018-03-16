import ObjectBox from '../model/object-box';

const MIN_DISTANCE = 10;

export default class Canvas {
  constructor(rectMovedCallback) {
    const canvas = document.getElementById('canvas');
    canvas.addEventListener('mousedown', this.onMouseDown, false);
    canvas.addEventListener('mouseup', this.onMouseUp, false);
    canvas.addEventListener('mousemove', this.onMouseMove, false);
    canvas.addEventListener('mouseout', this.onMouseOut, false);

    const image = document.getElementById('img');
    image.addEventListener('load', this.changeImage, false);

    window.addEventListener('resize', this.resizeImage, false);

    this.canvas = canvas;
    this.image = image;
    this.ctx = canvas.getContext('2d');
    this.rect = {};
    this.objects = [];
    this.hoveredObjectId = null;
    this.dragType = -1; // -1: none, 0: whole rect, tl: 1, tr: 2, bl: 3, br: 4
    this.lastMousePos = null;
    this.rectMovedCallback = rectMovedCallback;
  }

  destroy = () => {
    window.removeEventListener('resize', this.resizeImage);
  }

  changeImage = () => this.resizeImage()

  resizeImage = () => {
    const imgStyle = getComputedStyle(this.image);
    this.canvas.style.width = imgStyle.width;
    this.canvas.style.height = imgStyle.height;
    this.canvas.width = parseFloat(imgStyle.width);
    this.canvas.height = parseFloat(imgStyle.height);
    this.resetRect();
  }

  getImageSize = () => ({
    w: this.image.width,
    h: this.image.height,
  })

  getImageScale = () => ({
    x: this.image.width / this.image.naturalWidth,
    y: this.image.height / this.image.naturalHeight,
  })

  resetRect = () => {
    const size = this.getImageSize();
    this.rect = {
      x: Math.round(size.w / 4),
      y: Math.round(size.h / 4),
      w: Math.round(size.w / 2),
      h: Math.round(size.h / 2),
    };
    this.onRectMoved();
  }

  setObjects = (objects) => {
    this.objects = objects;
    this.draw();
  }

  toImageScale = (object) => {
    const scale = this.getImageScale();
    return {
      x: Math.round(object.x / scale.x),
      y: Math.round(object.y / scale.y),
      w: Math.round(object.w / scale.x),
      h: Math.round(object.h / scale.y),
    };
  }

  getMousePosition = (e) => {
    const canvasBoundingRect = this.canvas.getBoundingClientRect();
    return {
      x: e.pageX - canvasBoundingRect.x,
      y: e.pageY - canvasBoundingRect.y,
    };
  }

  onMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const { rect } = this;

    const mouse = this.getMousePosition(e);

    // 1. top left
    if (this.checkMinDistance(mouse.x, rect.x) && this.checkMinDistance(mouse.y, rect.y)) {
      this.dragType = 1;
      this.canvas.style.cursor = 'nwse-resize';
    }
    // 2. top right
    else if (this.checkMinDistance(mouse.x, rect.x + rect.w) && this.checkMinDistance(mouse.y, rect.y)) {
      this.dragType = 2;
      this.canvas.style.cursor = 'nesw-resize';
    }
    // 3. bottom left
    else if (this.checkMinDistance(mouse.x, rect.x) && this.checkMinDistance(mouse.y, rect.y + rect.h)) {
      this.dragType = 3;
      this.canvas.style.cursor = 'nesw-resize';
    }
    // 4. bottom right
    else if (this.checkMinDistance(mouse.x, rect.x + rect.w) && this.checkMinDistance(mouse.y, rect.y + rect.h)) {
      this.dragType = 4;
      this.canvas.style.cursor = 'nwse-resize';
    }
    // 5. whole rect
    else if (mouse.x > rect.x && mouse.x < rect.x + rect.w && mouse.y > rect.y && mouse.y < rect.y + rect.h) {
      this.dragType = 0;
      this.canvas.style.cursor = 'move';
    }

    this.draw();
  }

  checkMinDistance = (p1, p2) => (Math.abs(p1 - p2) < MIN_DISTANCE)

  onMouseUp = () => {
    this.dragType = -1;
    this.lastMousePos = null;
    this.canvas.style.cursor = 'default';
  }

  onMouseOut = () => this.onMouseUp()

  onMouseMove = (e) => {
    // Do nothing if not dragging
    if (this.dragType === -1) {
      return;
    }

    const { rect, dragType, lastMousePos } = this;

    const mouse = this.getMousePosition(e);

    switch (dragType) {
      case 0: // whole rect
        if (lastMousePos !== null) {
          rect.x -= (lastMousePos.x - mouse.x);
          rect.y -= (lastMousePos.y - mouse.y);
        }
        break;
      case 1: // top left
        rect.w += rect.x - mouse.x;
        rect.h += rect.y - mouse.y;
        rect.x = mouse.x;
        rect.y = mouse.y;
        break;
      case 2: // top right
        rect.w = Math.abs(rect.x - mouse.x);
        rect.h += rect.y - mouse.y;
        rect.y = mouse.y;
        break;
      case 3: // bottom left
        rect.w += rect.x - mouse.x;
        rect.h = Math.abs(rect.y - mouse.y);
        rect.x = mouse.x;
        break;
      case 4: // bottom right
        rect.w = Math.abs(rect.x - mouse.x);
        rect.h = Math.abs(rect.y - mouse.y);
        break;
      default:
        break;
    }

    this.lastMousePos = mouse;
    this.onRectMoved();
  }

  setHoveredObject = (objectId) => {
    this.hoveredObjectId = objectId;
    this.draw();
  }

  onRectMoved = () => {
    const size = this.getImageSize();
    // Validate selection
    if (this.rect.x < 0) {
      this.rect.x = 0;
    } else if (this.rect.x > size.w - MIN_DISTANCE) {
      this.rect.x = size.w - MIN_DISTANCE;
    }

    if (this.rect.y < 0) {
      this.rect.y = 0;
    } else if (this.rect.y > size.h - MIN_DISTANCE) {
      this.rect.y = size.h - MIN_DISTANCE;
    }

    if (this.rect.w < MIN_DISTANCE) {
      this.rect.w = MIN_DISTANCE;
    } else if (this.rect.w > size.w - this.rect.x) {
      this.rect.w = size.w - this.rect.x;
    }

    if (this.rect.h < MIN_DISTANCE) {
      this.rect.h = MIN_DISTANCE;
    } else if (this.rect.h > size.h - this.rect.y) {
      this.rect.h = size.h - this.rect.y;
    }
    // Update UI
    this.rectMovedCallback(this.rect);
    this.draw();
  }

  draw = () => {
    const { canvas, ctx, rect, objects } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw objects
    const scale = this.getImageScale();
    ctx.lineWidth = 3;
    objects.forEach((object) => {
      const { color } = object;
      const box = new ObjectBox(object);
      box.toScreenScale(scale);
      if (this.hoveredObjectId === box.id) {
        ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.4)`;
        ctx.fillRect(box.x, box.y, box.w, box.h);
      }
      ctx.strokeStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
      ctx.strokeRect(box.x, box.y, box.w, box.h);
    });

    // Draw selection zone & handles
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
    this.drawCircle(rect.x, rect.y, MIN_DISTANCE);
    this.drawCircle(rect.x + rect.w, rect.y, MIN_DISTANCE);
    this.drawCircle(rect.x + rect.w, rect.y + rect.h, MIN_DISTANCE);
    this.drawCircle(rect.x, rect.y + rect.h, MIN_DISTANCE);
  }

  drawCircle = (x, y, radius) => {
    const { ctx } = this;
    ctx.fillStyle = '#FF0000';
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
  }
}
