import { h } from "./vdom";

function ReadyView({
  onPressPlay,
  urls,
}: {
  onPressPlay: () => void;
  urls: string[];
}) {
  return h("div", { class: "ReadyView" }, [
    h("div", { class: "overlay" }, []),
    h("div", { class: "center-container" }, [
      h("btn", { class: "title btn", onClick: onPressPlay }, [
        h("text", {}, ["Play"]),
      ]),
    ]),
    h(
      "div",
      { class: "slide-grid" },
      urls.map((url) => {
        return h("img", { src: url }, []);
      })
    ),
  ]);
}

export default ReadyView;
