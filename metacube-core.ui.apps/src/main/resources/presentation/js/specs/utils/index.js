/*
 * A function that returns an Array of DOM elements.
 * This sets up an accessibility fixture that is inserted into the page.
 * @param {string} the string of html to be appended to the DOM
 */

export function appendFixture(htmlString) {
    // Create a DOM Element and set the inner HTML to the passed string of HTML
    const element = document.createElement('div');
    element.innerHTML = htmlString || '';

    // append the element to the browser window launched by the test runner
    document.body.appendChild(element);

    // filter out the text nodes
    const nodes = Array.prototype.slice.call(element.childNodes);
    const elements = nodes.filter((item) => {
        const test = item.nodeType === 1 ? item : false;
        return test;
    });

    return elements;
}

export { appendFixture as default };
