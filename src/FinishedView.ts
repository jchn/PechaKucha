import { h } from "./vdom";

function FinishedView({
  urls,
  onPressReplay,
}: {
  urls: string[];
  onPressReplay: () => void;
}) {
  return h("div", { class: "FinishedView" }, [
    h("div", { class: "overlay" }, []),
    h("div", { class: "center-container" }, [
      h("btn", { class: "title btn", onClick: onPressReplay }, [
        h("text", {}, ["Replay"]),
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

export default FinishedView;
