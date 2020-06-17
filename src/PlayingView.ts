import { h } from "./vdom";

const SLIDE_DURATION_MS = 20000;

function PlayingView({
  currentSlide,
  slides,
  onSlideFinished,
  onSlideShowFinished,
}: {
  currentSlide: number;
  slides: string[];
  onSlideFinished: () => void;
  onSlideShowFinished: () => void;
}) {
  if (currentSlide === slides.length - 1) {
    setTimeout(() => {
      onSlideShowFinished();
    }, SLIDE_DURATION_MS);
  } else {
    setTimeout(() => {
      onSlideFinished();
    }, SLIDE_DURATION_MS);
  }

  return h("div", { class: "PlayingView" }, [
    h("img", { class: "slide", src: slides[currentSlide] }, []),
    h("div", { class: "progress-indicator-container" }, [
      h("div", { class: "progress-indicator-track" }, [
        h("div", { class: "progress-indicator-slider" }, []),
      ]),
    ]),
  ]);
}

export default PlayingView;
