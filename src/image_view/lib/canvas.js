import * as base from './base.js';

const ResizeObserver = window.ResizeObserver;
export class CanvasModel extends base.BuildTree {
  constructor(canvasId='imageShowCanvas') {
    super('canvas', { id:canvasId, class:'border', }, );
    this.canvasId = canvasId;
    this.canvas = this.tree;
    this.ctx = this.canvas.getContext('2d');
    this.drawAction = new Set();
  }
  prepareDraw() {
    this.ctx.save();
  }
  drawCanvas() {
    this.ctx.restore();
    this.clearCanvas();
    for(let action of this.drawAction) {
      action.draw(this.ctx);
    }
  }
  drawAction(actions=[]) {
    actions.forEach(action => action.draw(this.ctx));
  }
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  addDrawAction(actionModel) {
    if(this.drawAction.has(actionModel)) {
      this.drawAction.delete(actionModel);
    }
    this.drawAction.add(actionModel);
  }
  clear() {
    for(let action of this.drawAction) {
      action.clear(this.ctx);
    }
    this.drawCanvas();
  }
  calcSize() {
    this.ratio = [this.canvas.width/this.canvas.offsetWidth, this.canvas.height/this.canvas.offsetHeight];
  }
  redo() {
    const lastAction = Array.from(this.drawAction).pop();
    // console.log('this.drawAction', this.drawAction);
    if(lastAction && lastAction.drawed && lastAction.drawed.length){
      lastAction.redo();
    } else {
      // this.drawAction.delete(lastAction);
    }
    this.drawCanvas();
  }
}
export default CanvasModel;
