module.exports = {
    assignAttributes: assignAttributes,
    assignMatches: assignMatches,
    closingTag: closingTag,
    insertMatches: insertMatches
};
var _ = require("underscore");
function assignAttributes(content) {
    var elements = [];
    var currentTag = {};
    for (var index = 0; index < content.length; index++) {
        var value = content[index];
        if (value.classification === "tag") {
            if (index > 0) {
                elements.push(currentTag);
            }
            currentTag = value;
            currentTag.position = "opening";
            currentTag.matched = false;
            currentTag.attributes = {};
        }
        else if (value.classification === "attribute") {
            currentTag.attributes[value.key] = {
                data: value.fill,
                directiveType: value.directiveType,
                interpretation: value.interpretation
            };
        }
    }
    elements.push(currentTag);
    return elements;
}
function assignMatches(elements) {
    var elementsForInsertion = {};
    var level = 0;
    var maxLevel = 0;
    for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
        var element = elements_1[_i];
        var currentLevelElement = "";
        level = element.indent;
        if (level >= maxLevel) {
            maxLevel = level;
        }
        if (elementsForInsertion[level]) {
            currentLevelElement = elementsForInsertion[level];
            delete elementsForInsertion[level];
        }
        if (!element.selfClosing) {
            elementsForInsertion[level] = {
                indent: element.indent,
                key: element.key,
                whitespace: element.whitespace
            };
            for (var subindex = (level - 1); subindex >= 0; subindex--) {
                if (elementsForInsertion[subindex]) {
                    elementsForInsertion[subindex].containsElement = true;
                    break;
                }
            }
        }
        while (level < maxLevel) {
            if (elementsForInsertion[maxLevel]) {
                element.preceding.push(closingTag(elementsForInsertion[maxLevel]));
                delete elementsForInsertion[maxLevel];
            }
            maxLevel--;
        }
        if (!element.preceding) {
            element.preceding = [];
        }
        element.preceding.push(closingTag(currentLevelElement));
    }
    var endElement = {
        preceding: [],
        system: "end"
    };
    var remainingElements = [];
    _.each(elementsForInsertion, function (value, key) {
        remainingElements[key] = value;
    });
    remainingElements.reverse();
    for (var _a = 0, remainingElements_1 = remainingElements; _a < remainingElements_1.length; _a++) {
        var element = remainingElements_1[_a];
        if (element) {
            endElement.preceding.push((closingTag(element)));
        }
    }
    elements.push(endElement);
    for (var index = 0; index < elements.length; index++) {
        if (index < (elements.length - 1)) {
            if (elements[index + 1].indent > elements[index].indent) {
                elements[index].containsElement = true;
            }
        }
        else {
            elements[index].containsElement = false;
        }
    }
    return elements;
}
function insertMatches(nestedElements) {
    var elements = [];
    for (var _i = 0, nestedElements_1 = nestedElements; _i < nestedElements_1.length; _i++) {
        var element = nestedElements_1[_i];
        for (var _a = 0, _b = element.preceding; _a < _b.length; _a++) {
            var precedingElement = _b[_a];
            if (precedingElement !== "") {
                elements.push(precedingElement);
            }
        }
        if (!element.system) {
            elements.push(element);
        }
    }
    return elements;
}
function closingTag(content) {
    var element = content;
    element.position = "closing";
    return element;
}
