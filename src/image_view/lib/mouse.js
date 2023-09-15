import * as base from './base.js';
const defaultConfig = { showTrack:true, };
const mouseState = {
  down:1, move:2, end:4,
};
const sumState = (...args) => args.reduce((sum, cur) => sum + mouseState[cur], 0);
class End {
  steps=[];
}
export class MouseModel extends base.ActionModel {
  constructor(canvasModel, config=defaultConfig) {
    super(canvasModel, {});
    this.start = {};
    this.dom = canvasModel.canvas;
    this.showTrack = config.showTrack;
    this.canvasModel.ctx.lineWidth=2;
    ['Down','Move','Up', 'Out'].forEach(ac => {
      this.dom.addEventListener('mouse'+ac.toLowerCase(), this['mouse'+ac+'Listener'],);
    });
    this.state = 0;
    this.drawed = [];
    this.selected = null;
    this.stash = null;
  }
  mouseDownListener = (event) => {
    this.which = event.which;
    if(this.which != 1) return;
    this.start.x = event.offsetX;
    this.start.y = event.offsetY;
    this.end = new End();
    // console.log('this.start', this.start.x, this.start.y);
    // this.canvasModel.ratio();
    this.state = sumState('down');
    this.canvasModel.ctx.save();
  }
  mouseMoveListener = (event) => {
    if(!(this.state & 0x01)) return;
    this.end.x = event.offsetX;
    this.end.y = event.offsetY;
    this.end.steps.push({x:event.offsetX, y:event.offsetY});
    this.state = sumState('down', 'move');
    if(this.showTrack) {
      this.stash = new Geometry(this.start, this.end,  this.canvasModel.ratio, this.mouseMode);
      this.canvasModel.drawCanvas();
    }
  }
  mouseUpListener = (event) => {
    if(!(this.state & 0x01)) return;
    this.end.x = event.offsetX;
    this.end.y = event.offsetY;
    this.end.steps.push({x:event.offsetX, y:event.offsetY});
    this.state = sumState('end');
    this.saveAction();
    this.canvasModel.drawCanvas();
  }
  mouseOutListener = (event) => {
    this.mouseUpListener(event);
  }
  saveAction() {
    const geometry = new Geometry(this.start, this.end,  this.canvasModel.ratio, this.mouseMode);
    if(!(this.state & 0x4) ) {
      this.stash = geometry;
      return;
    }
    this.stash = null;
    switch(this.aim) {
    case base.AimEnum.draw:
      this.drawed.push(geometry);
      break;
    case base.AimEnum.select:
      this.selected = geometry;
      break;
    }
  }
  draw(ctx) {
    const isOk = [this.start, this.end].every(ele => 'x' in ele && 'y' in ele);
    if(!isOk) return;
    if(!this.canvasModel.ratio) return;
    this.drawed.forEach(geometry => {
      geometry.drawOn(ctx);
    });
    if(this.stash) {
      this.stash.drawOn(ctx);
    }
    if(this.selected) {
      this.selected.drawOn(ctx);
    }
  }
  clear(ctx) {
    this.start = {};
    this.end = new End();
    this.drawed = [];
  }
  redo(ctx) {
    this.drawed.pop();
  }
  changeAim(aim) {
    if(!base.AimEnum[aim]) throw new Error('未知的鼠标行为');
    this.aim = aim;
  }
  changeMouseMode(mouseMode) {
    if(!base.MouseModeEnum[mouseMode]) throw new Error('未知的几何图形');
    this.mouseMode = mouseMode;
  }
};

class Geometry {
  constructor(start, end, ratio, mouseMode="rect") {
    const [xratio, yratio] = ratio;
    this.start = start;
    this.end = end;
    this.ratio = ratio;
    const rect = [this.start.x * xratio, this.start.y * yratio, (this.end.x - this.start.x) * xratio, (this.end.y - this.start.y) * yratio];
    this.rect = rect;
    this.mouseMode = mouseMode;
    this.#initParams();
  }
  #initParams() {
    switch(this.mouseMode) {
    case base.MouseModeEnum.rect:
      this.ctxAction = ['rect'];
      this.params = [[...this.rect]];
      break;
    case base.MouseModeEnum.circle:
      this.ctxAction = ['ellipse'];
      const radiusx = this.rect[2]/2;
      const radiusy = this.rect[3]/2;
      const x = this.rect[0] + radiusx;
      const y = this.rect[1] + radiusy;
      this.params = [[ x, y, Math.abs(radiusx), Math.abs(radiusy), 0, 0, 2 * Math.PI]];
      break;
    case base.MouseModeEnum.path:
      this.ctxAction = ['stroke'];
      const path = new window.Path2D();
      const [xratio, yratio] = this.ratio;
      path.moveTo(this.start.x * xratio, this.start.y * yratio);
      this.end.steps.forEach(step => path.lineTo(step.x * xratio, step.y * yratio));
      this.params = [[path]];
      break;
    case base.MouseModeEnum.straight:
      this.ctxAction = ['moveTo', 'lineTo'];
      this.params =[[this.rect[0],this.rect[1]],[this.rect[0] + this.rect[2],this.rect[1] +this.rect[3]]];
      break;
    }
  }
  drawOn(ctx) {
    ctx.beginPath();
    this.ctxAction.forEach((action,idx) => ctx[action](...this.params[idx]));
    // ctx[this.ctxAction](...this.params);
    ctx.stroke();
    ctx.closePath();
  }
}
