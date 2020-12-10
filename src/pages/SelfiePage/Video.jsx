import React, { Component } from "react";
import Konva from "konva";
import { Image, Stage, Layer } from "react-konva";

class Video extends Component {
  constructor(props) {
    super(props);
    this.video = this.props.video;
    this.video.addEventListener(
      "loadedmetadata",
      this.updateImageSize.bind(this)
    );
  }

  updateImageSize() {
    const { image, video } = this;

    if (image) {
      const newImageHeight =
        (image.width() * video.videoHeight) / video.videoWidth;
      const currentImagePosition = image.position();
  
      image.position({
        x: currentImagePosition.x,
        y: currentImagePosition.y + (image.height() - newImageHeight) / 2
      });
      image.height(newImageHeight);
    }
  }

  play() {
    this.animation.start();
    // if (this.video) {
    //   this.video.play();
    // }
  }

  pause() {
    this.video.pause();
    this.animation.stop();
  }

  componentDidMount() {
    this.animation = new Konva.Animation(() => {}, this.image.getLayer());
    this.play();
  }

  // componentDidUpdate() {
  //   this.updateImageSize();
  //   this.play();
  // }

  // componentWillUnmount() {
  //   this.pause();
  // }

  render() {
    const { video } = this;
    const { x, y, width, height } = this.props;

    return (
      <div className="video-canvas">
        <Stage width={window.innerWidth} height={window.innerHeight}>
          <Layer>
            <Image
              x={x}
              y={y}
              width={width}
              height={height}
              image={video}
              ref={node => {
                this.image = node;
              }}
            />
          </Layer>
        </Stage>
      </div>
    );
  }
}

Video.defaultProps = {
  x: 0,
  y: 0,
  width: window.innerWidth,
  height: window.innerHeight,
};

export default Video;
