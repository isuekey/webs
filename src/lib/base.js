const hexArray = Object.freeze(new Array(256).fill(0).map((ele, idx) => {
  return idx.toString(16).padStart(2, '0').toLowerCase();
}));

const randomIndex = () => {
  return Math.floor(Math.random() * 256);
};

const randomHex = (size=0) => {
  return new Array(size).fill(0).map(ele => {
    return hexArray[randomIndex()];
  });
};

export const uuid = (divider="-") => {
  return [
    ...randomHex(4), divider,
    ...randomHex(2), divider,
    ...randomHex(2), divider,
    ...randomHex(2), divider,
    ...randomHex(6),
  ].join('');
};
export class Publisher {
  constructor() {
    this.map = new Map();
  }
  addListener(listener, action) {
    this.map.set(listener, action);
  }
  removeListener(listener) {
    this.map.delete(listener);
  }
  publish(...artifacts) {
    const event = artifacts.map(artifact => {
      if(typeof artifact == 'string') return artifact;
      else if(Array.isArray(artifact)) return Object.freeze([...artifact]);
      return Object.freeze({...artifact});
    });
    Array.from(this.map).forEach(([listener, action]) => {
      action.apply(listener, event);
    });
  }
}
export class Subscriber extends Publisher{
  constructor(...publishers) {
    super();
    this.subscribe(...publishers);
  }
  subscribe(listener, ...publishers) {
    publishers.forEach(pub => pub.addListener(this, listener));
  }
  unsubscribe(...publishers) {
    publishers.forEach(pub => pub.removeListener(this));
  }
}
export class Tree extends Subscriber {
  constructor() {
    super();
    this.children = [];
    this.stateList = [];
  }
  buildChildMap() {
    this.childrenMap = new Map(this.children.map((child,idx) => ([child, idx])));
  }
  appendChild(child){
    this.tree.appendChild(child.tree);
    this.children.push(child);
    this.buildChildMap();
  }
  removeChild(child) {
    this.tree.removeChild(child.tree);
    const idx = this.childrenMap.get(child);
    this.children.splice(idx, 1,);
    this.buildChildMap();
  }
  getChildren() {
    return this.children;
  }
  #afterState() {
    this.state = Object.assign({...this.state}, ...this.stateList);
    const hasChange = this.stateList.length;
    this.stateList = [];
    if(hasChange) {
      this.render();
    };
  }
  setState(state={}) {
    this.stateList.push(state);
    Promise.resolve('').then(_=> this.#afterState());
  }
  render() {
    const children = this.getChildren();
    children.forEach(child => {
      if(this.tree.contains(child.tree)) {
        this.tree.removeChild(child.tree);
      }
    });
    children.forEach(child => {
      this.tree.appendChild(child.tree);
      child.render && child.render();
    });
  }
  changeAttribute(attributes={}){
    Object.entries(attributes).forEach(([attrName,attrValue])=> {
      this.tree.setAttribute(attrName, attrValue);
    });
  }
}

export class BuildTree extends Tree{
  constructor(tagName, options, ...children) {
    super();
    this.tree = document.createElement(tagName, {is:options.is});
    Object.entries(options).filter(([key, val]) => key != 'is').forEach(([attrName,attrValue])=> {
      this.tree.setAttribute(attrName, attrValue);
    });
    this.children = children;
    this.buildChildMap();
  }
}

export class FindTree extends Tree {
  constructor(domId) {
    super();
    if( (typeof (domId).valueOf()) == 'string' ) {
      const query = `#${domId}`.replace(/\#+/, '#');
      this.tree = document.querySelector(query);
    } else {
      this.tree = domId;
    }
  }
}
