import { h } from "./vdom";

function onDragEnter(e) {
  e.preventDefault();
}

function onDragOver(e) {
  e.preventDefault();
}

function getImageURL(file: File): Promise<string> {
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onload = function (img) {
      if (typeof img.target.result === "string") {
        resolve(img.target.result);
      } else {
        reject("could not obtain url from file");
      }
    };
    reader.readAsDataURL(file);
  });
}

function CollectView({
  onCollected,
}: {
  onCollected: (urls: string[]) => void;
}) {
  function onDrop(e) {
    e.preventDefault();
    const fileList = e.dataTransfer.files;

    Promise.all<string>(
      Array.from(fileList)
        .sort((a, b) => parseInt(a.name) - parseInt(b.name))
        .map(getImageURL)
    ).then((urls) => {
      onCollected(urls);
    });
  }

  return h("div", { class: "CollectView", onDrop, onDragEnter, onDragOver }, [
    h("h1", { class: "title" }, [h("text", {}, ["Drop some slides"])]),
  ]);
}

export default CollectView;
