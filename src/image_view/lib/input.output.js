import * as base from './base.js';
export class ImageModel extends base.BuildActionModel{
  constructor(canvasModel, srcId='imageFile' ) {
    super(canvasModel, 'top', 'input', { type:'file', id:srcId, accept:".jpg, .jpeg, .png", } );
    this.image = new window.Image(this.canvas.offsetWidth, this.canvas.offsetHeight);
    this.loaded = false;
    this.image.addEventListener('load', this.imageLoadedListener);
    this.tree.addEventListener('change', this.fileChangeListener);
  }
  fileChangeListener = (event) => {
    const file = event.target.files[0];
    const url = window.URL.createObjectURL(file);
    this.image.src = url;
    this.image.alt = 'file image';
  }
  imageLoadedListener = (event) => {
    this.loaded = true;
    this.canvasModel.canvas.width = this.image.naturalWidth;
    this.canvasModel.canvas.height = this.image.naturalHeight;
    this.canvasModel.calcSize();
    this.canvasModel.clear();
  };
  draw(ctx=this.ctx) {
    if(!this.loaded || !this.image || !ctx) return;
    // ctx.canvas.width = this.image.naturalWidth;
    // ctx.canvas.height = this.image.naturalHeight;
    ctx.drawImage(this.image, 0, 0, this.image.naturalWidth, this.image.naturalHeight);
  }
}

export default ImageModel;

export class RedrawModel extends base.BuildActionModel {
  constructor(canvasModel, srcId='redrawImage' ) {
    super(canvasModel, 'top', 'button', { id:srcId, } , );
    this.tree.innerText = '重绘';
    this.tree.addEventListener('click', this.#redraw);
  }
  #redraw = () => {
    // console.log('will redraw');
    this.canvasModel.clear();
  }
  draw(ctx){
  }
}
export class RedoModel extends base.BuildActionModel {
  constructor(canvasModel, srcId='redoCanvas' ) {
    super(canvasModel, 'top', 'button', { id:srcId, } , );
    this.tree.innerText = '回退';
    this.tree.addEventListener('click', this.#redraw);
  }
  #redraw = () => {
    // console.log('will redraw');
    this.canvasModel.redo();
  }
  draw(ctx){
  }
}
