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

// funcao recursiva
/**
 {
    "tagName": "div",
    "props": null,
    "children": ["ola"]
}
*/
function createElement(node) {
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

  const tree = h(
    "p",
    null,
    h("h1", null, "My Todo List"),
    h("ul", null, h("li", null, "oi"), h("li", null, "meu chapa"))
  );

  console.log(tree);
  const dom = createElement(tree);

  console.log(dom);

  $root.append(dom);
}

document.addEventListener("DOMContentLoaded", main);
