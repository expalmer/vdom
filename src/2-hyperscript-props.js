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
  if (!node?.tagName) {
    return document.createTextNode(String(node));
  }

  const $el = document.createElement(node.tagName);

  applyProps($el, node.props);

  const elements = node.children.map(createElement);
  $el.append(...elements);

  return $el;
}

function applyProps($el, props) {
  Object.entries(props || {}).forEach(([propName, propValue]) => {
    const name = propName === "className" ? "class" : propName;
    //{ style: { color: red }, className: 'container' }
    if (name === "style") {
      Object.entries(propValue).forEach(([key, val]) => {
        $el.style[key] = val;
      });
    } else {
      $el.setAttribute(name, propValue);
    }
  });
}

function main() {
  const $root = document.getElementById("root");

  const tree = h(
    "div",
    { className: "container" },
    h("h1", null, "My Todo List"),
    h(
      "ul",
      { style: { fontSize: "18px" } },
      h("li", { style: { color: "red" } }, "oi"),
      h("li", null, "meu chapa")
    )
  );

  console.log(tree);

  const dom = createElement(tree);

  console.log(dom);

  $root.append(dom);
}

document.addEventListener("DOMContentLoaded", main);
