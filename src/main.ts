const body = document.querySelector("body");
if (body === null) throw new Error("body is null");

const container = document.createElement("div");
container.classList.add("container");

body.append(container);

const test = document.createElement("p");
test.textContent = "testing";
container.appendChild(test);

