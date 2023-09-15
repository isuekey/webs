import * as base from '../lib/base.js';
import * as inputOutput from './lib/input.output.js';
import * as canvas from './lib/canvas.js';
import * as mouse from './lib/mouse.js';
import * as tools from './lib/tools.js';

// const mainTools = () => base.createNode('div', { }, );
class App extends base.FindTree {
  constructor(domId) {
    super(domId);
    this.tree.className = "display-flex flex-row";
    const canvasModel = new canvas.CanvasModel('imageShowCanvas');
    this.mainLeft = new base.BuildTree(
      'div', {class:"flex-1 position-relative"},
      new base.BuildTree(
        'div', {id:'inputOutput'}, new inputOutput.ImageModel(canvasModel),
        new inputOutput.RedrawModel(canvasModel),
        new inputOutput.RedoModel(canvasModel),
      ),
      new base.BuildTree(
        'div', { id:"canvasContainer", class:'image-show-canvas'}, canvasModel,
      ),
    );
    const mouseModel = new mouse.MouseModel(canvasModel);
    this.mainRight = new tools.ToolsModel(canvasModel, mouseModel);
    this.appendChild(this.mainLeft);
    this.appendChild(this.mainRight);
    this.canvasModel = canvasModel;
  }
};

const app = new App('#imageViewMain');
app.render();
app.canvasModel.calcSize();
