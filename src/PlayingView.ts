import { h } from "./vdom";

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
  if (currentSlide === slides.length) {
    setTimeout(() => {
      onSlideShowFinished();
    }, 2000);
  } else {
    setTimeout(() => {
      onSlideFinished();
    }, 2000);
  }

  return h("div", { class: "PlayingView" }, [
    h("text", {}, ["playing slideshow"]),
    h("text", {}, [`current slide: ${currentSlide}`]),
    h("img", { src: slides[currentSlide] }, []),
  ]);
}

export default PlayingView;
