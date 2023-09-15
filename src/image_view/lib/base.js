import * as base from '../../lib/base.js';
export * from '../../lib/base.js';

export class ActionModel extends base.FindTree {
  constructor(canvasModel, domId, to='top') {
    super(domId);
    this.canvasModel = canvasModel;
    this.ctx = canvasModel.ctx;
    this.canvas = canvasModel.canvas;
    this.canvasModel.addDrawAction(this, to);
  }
  draw(ctx){}
  clear(ctx){}
  redo(ctx){}
}

export class BuildActionModel extends base.BuildTree {
  constructor(canvasModel, to='top', tagName, options, ...children) {
    super(tagName, options, ...children);
    this.canvasModel = canvasModel;
    this.ctx = canvasModel.ctx;
    this.canvas = canvasModel.canvas;
    this.canvasModel.addDrawAction(this, to);
  }
  draw(ctx){
  }
  clear(ctx){}
  redo(ctx){}
}
export class ConfigModel extends base.FindTree {
  constructor(canvasModel, domId) {
    super(domId);
    this.canvasModel = canvasModel;
    this.ctx = canvasModel.ctx;
    this.canvas = canvasModel.canvas;
  }
  draw(ctx){}
  clear(ctx){}
  redo(ctx){}
}

export class BuildConfigModel extends base.BuildTree {
  constructor(canvasModel, tagName, options, ...children) {
    super(tagName, options, ...children);
    this.canvasModel = canvasModel;
    this.ctx = canvasModel.ctx;
    this.canvas = canvasModel.canvas;
  }
  draw(ctx){
  }
  clear(ctx){}
  redo(ctx){}
}

export const AimEnum = Object.freeze({
  draw:'draw', select:'select',
});
export const MouseModeEnum = Object.freeze({
  rect:'rect', circle:'circle', straight:'straight', path:'path', 
});
