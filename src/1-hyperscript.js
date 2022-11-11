function h(tagName, props = null, ...children) {
  if (Array.isArray(children[0])) {
    children = children[0];
  }

  return {
    tagName,
    props,
    children,
  };
}

function createElement(node) {
  // so pode ser um objeto `h` ou um string
  if (!node?.tagName) {
    return document.createTextNode(String(node));
  }

  const $el = document.createElement(node.tagName);

  const elements = node.children.map(createElement);
  $el.append(...elements);

  return $el;
}

function main() {
  const $root = document.getElementById("root");

  const tree = h("div", null, "texto");

  console.log(tree);

  const dom = createElement(tree);

  console.log(dom);

  $root.append(dom);
}

document.addEventListener("DOMContentLoaded", main);
