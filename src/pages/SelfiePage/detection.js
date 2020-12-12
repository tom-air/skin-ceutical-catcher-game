class detection {
  constructor() {
    this.targetInView = false;
  }

  set target(onTarget) {
    this._targetInView = onTarget;
  }

  get target() {
    console.log('setting target', this.targetInView);
    return this.targetInView;
  }
}

export default detection;