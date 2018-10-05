var config = require("./config.json");
var dir = config.testTarget;

function file(path) { return dir + path;}

var louk = require(file("index.js"));
var chai = require("chai");
var assert = chai.assert;

var htmlGenerator = require(file("html-generator"));

describe("HTML Generator", function(){
    it("should generate HTML", function(){
        var input = [
            {
                unindented: 'a',
                lineType: 'louk',
                crux: 'a',
                selfClosing: false,
                key: 'a',
                interpretation: 'dynamic',
                fill: '',
                directiveType: '',
                position: 'opening',
                attributes: {}
            },
            { key: 'a', position: 'closing' }
        ];
        assert.equal(htmlGenerator.generateHTML(input), '<a></a>');
    });
});
