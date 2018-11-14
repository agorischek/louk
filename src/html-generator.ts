// Turns the completed array of element objects into raw HTML
export function generateHTML(elements, options) {

    // As we iterate through the elements, the output will accumulate here.
    let html = "";

    let keepWhitespace = true;
    if (options && options.whitespace != null) {
        keepWhitespace = options.whitespace;
    }

    for (let index = 0; index < elements.length; index++) {
        const element = elements[index];

        // HTML is passed straight through
        if (element.lineType === "html") {

            if (keepWhitespace) {
                html = html + element.raw;

                // Insert a newline as long as we're not at the last line.
                if (index < (elements.length - 1)) {
                    html = html + "\n";
                }
            } else {
                html = html + element.unindented;
            }
        } else if (element.lineType === "comment") {
            // Do nothing; comments are completely discarded
        } else if (element.passthrough === true) {

            // Passthrough elements are things like scripts and styles that should be left untouched.
            const passthroughContentArray = element.lines;
            if (passthroughContentArray[passthroughContentArray.length - 1] === "") {
                passthroughContentArray.splice(-1, 1);
            }
            if (passthroughContentArray[0] === "") {
                passthroughContentArray.splice(0, 1);
            }
            const passthroughContentString = passthroughContentArray.join("\n");

            html = html + "\n" + passthroughContentString + "\n";

        } else {

            // Generate opening tags
            if (element.position === "opening" && element.key != null) {

                if (keepWhitespace && element.whitespace) {
                    html = html + element.whitespace;
                }

                html = html + "<";
                html = html + element.key;

                // Loop over all of the element's attributes
                Object.keys(element.attributes).forEach((key) => {

                    const attributeInfo = element.attributes[key];
                    let attribute = "";

                    // If the attribute should be interpretted dynamically...
                    if (attributeInfo.interpretation === "dynamic") {
                        if (attributeInfo.directiveType === "simple") {
                            attribute = "v-" + key;
                        } else if (attributeInfo.directiveType === "action") {
                            attribute = "v-on:" + key;
                        } else if (attributeInfo.directiveType === "bind") {
                            attribute = "v-bind:" + key;
                        }
                    } else if (attributeInfo.interpretation === "static") {
                        attribute = key;
                    }

                    // Put the above defined attribute and value into the HTML
                    html = html + " " + attribute;

                    // If the attribute is boolean, no explicit value is needed
                    if (attributeInfo.data) {
                        html = html + "=\"" + attributeInfo.data + "\"";
                    }
                });

                if (element.selfClosing) {
                    html = html + " /";
                }
                html = html + ">";

                // If there's body content...
                if (element.fill) {

                    if (keepWhitespace && element.containsElement) {
                        html = html + "\n" +
                        element.indentationUnit +
                        renderFill(element.fill, element.interpretation) +
                        "\n";
                    } else {
                        html = html + renderFill(element.fill, element.interpretation);
                    }

                } else {
                    if (keepWhitespace && element.containsElement) {
                        html = html +  "\n";
                    }
                }

            } else if (element.classification === "continuation") {

                if (element.fill) {

                    if (keepWhitespace && element.parentContainsElement) {
                        html = html + 
                        element.indentationUnit +
                        renderFill(element.fill, element.interpretation) +
                        "\n";
                    } else {
                        html = html + renderFill(element.fill, element.interpretation);
                    }

                }

            } else if (element.position === "closing" && element.key !== null) {

                if (keepWhitespace && element.containsElement && element.whitespace) {
                    html = html + element.whitespace;
                }

                html = html + "</" + element.key + ">";

                // Add a return if we're not at the last element.
                if (keepWhitespace && index < (elements.length - 1)) {
                    html = html +  "\n";
                }
            }
        }
    }
    return html;
}

// Renders static and dynamic fills
export function renderFill(fill, interpretation) {
    if (interpretation === "dynamic") {
        return "{{" + fill + "}}";
    } else if (interpretation === "static") {
        return fill;
    }
}
