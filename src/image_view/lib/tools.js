import * as base from './base.js';

class TextElement extends base.BuildTree {
  constructor(innerText, tagName, options={}, ...children) {
    super('lengend', options, ...children);
    this.tree.innerText = innerText;
  }
}
class BuildConfigModel extends base.BuildConfigModel {
  constructor(canvasModel, mouseModel, tagName, options, ...children) {
    super(canvasModel, tagName, options, ...children);
    this.mouseModel = mouseModel;
  }
}
export class ToolsModel extends BuildConfigModel {
  constructor(canvasModel, mouseModel, srcId='toolsContainer') {
    super(
      canvasModel, mouseModel, 'div', { id:srcId, class:'tools-container', },
        new AimModel(canvasModel, mouseModel),
        new MouseModeModel(canvasModel, mouseModel),
    );
  }
}

class AimModel extends BuildConfigModel {
  constructor(canvasModel, mouseModel, srcId="aimContainer") {
    super(
      canvasModel, mouseModel, 'fieldset', {}, new TextElement('目的', 'lengend'),
    );
    this.aimMap = {
      drawButton: new DrawButton(canvasModel, mouseModel),
      selectButton: new SelectButton(canvasModel, mouseModel),
    };
    const children = [
      this.aimMap.drawButton, this.aimMap.selectButton,
    ];
    this.appendChild(new base.BuildTree(
      'div', { class:'display-flex flex-row', }, ...children,
    ));
    this.state = {selected: base.AimEnum.draw};
    this.mouseModel.changeAim(base.AimEnum.draw);
    Promise.resolve('').then(_=>{this.subscribe(this.#changeAim, ...children); });
  }
  #changeAim = (...listened) => {
    // console.log('listened', ...listened);
    const [action, value] = listened;
    Object.values(this.aimMap).forEach(aim => {
      aim.changeAttribute({selected: aim.aim == value});
    });
    this.mouseModel.changeAim(value);
  }
}

class DrawButton extends BuildConfigModel {
  constructor(canvasModel, mouseModel, srcId="drawButton") {
    super(canvasModel, mouseModel, 'div', { class:'flex-1 button', selected:true, }, new TextElement('绘制', 'label'));
    this.tree.addEventListener('click', this.#handleClick);
    this.srcId = srcId;
    this.aim = base.AimEnum.draw;
  }
  #handleClick = () => {
    this.publish('aimModel', this.aim);
  }
}

class SelectButton extends BuildConfigModel {
  constructor(canvasModel, mouseModel, srcId="selectButton") {
    super(canvasModel, mouseModel, 'div', { class:'flex-1 button', }, new TextElement('选择', 'label'));
    this.tree.addEventListener('click', this.#handleClick);
    this.srcId = srcId;
    this.aim = base.AimEnum.select;
  }
  #handleClick = () => {
    this.publish('aimModel', this.aim);
  }
}

class MouseModeModel extends BuildConfigModel {
  constructor(canvasModel, mouseModel, srcId="mouseModeContainer") {
    super(
      canvasModel, mouseModel, 'fieldset', {}, new TextElement('方式', 'lengend'),
    );
    this.modeMap = {
      rectButton: new RectButton(canvasModel, mouseModel),
      circleButton: new CircleButton(canvasModel, mouseModel),
      pathButton: new PathButton(canvasModel, mouseModel),
      straightButton: new StraightButton(canvasModel, mouseModel),
    };
    const children = [ this.modeMap.rectButton, this.modeMap.circleButton, this.modeMap.pathButton, this.modeMap.straightButton, ];
    this.appendChild(new base.BuildTree(
      'div', { class:'display-flex flex-row', }, ...children,
    ));
    this.state = { selected: base.MouseModeEnum.rect };
    this.mouseModel.changeMouseMode(base.MouseModeEnum.rect);
    Promise.resolve('').then(_=>{this.subscribe(this.#changeMode, ...children);});
  }
  #changeMode = (...listened) => {
    const [action, value] = listened;
    Object.values(this.modeMap).forEach(aim => {
      aim.changeAttribute({selected: aim.aim == value});
    });
    this.mouseModel.changeMouseMode(value);
  }
}

class RectButton extends BuildConfigModel {
  constructor(canvasModel, mouseModel, srcId="rectButton") {
    super(canvasModel, mouseModel, 'div', { class:'flex-1 button', selected:true, }, new TextElement('矩形', 'label'));
    this.tree.addEventListener('click', this.#handleClick);
    this.srcId = srcId;
    this.aim = base.MouseModeEnum.rect;
  }
  #handleClick = () => {
    this.publish('modeModel', this.aim);
  }
}

class CircleButton extends BuildConfigModel {
  constructor(canvasModel, mouseModel, srcId="circleButton") {
    super(canvasModel, mouseModel, 'div', { class:'flex-1 button', }, new TextElement('圆形', 'label'));
    this.tree.addEventListener('click', this.#handleClick);
    this.srcId = srcId;
    this.aim = base.MouseModeEnum.circle;
  }
  #handleClick = () => {
    this.publish('modeModel', this.aim);
  }
}

class PathButton extends BuildConfigModel {
  constructor(canvasModel, mouseModel, srcId="pathutton") {
    super(canvasModel, mouseModel, 'div', { class:'flex-1 button', }, new TextElement('路线', 'label'));
    this.tree.addEventListener('click', this.#handleClick);
    this.srcId = srcId;
    this.aim = base.MouseModeEnum.path;
  }
  #handleClick = () => {
    this.publish('modeModel', this.aim);
  }
}

class StraightButton extends BuildConfigModel {
  constructor(canvasModel, mouseModel, srcId="straightButton") {
    super(canvasModel, mouseModel, 'div', { class:'flex-1 button', }, new TextElement('直线段', 'label'));
    this.tree.addEventListener('click', this.#handleClick);
    this.srcId = srcId;
    this.aim = base.MouseModeEnum.straight;
  }
  #handleClick = () => {
    this.publish('modeModel', this.aim);
  }
}
