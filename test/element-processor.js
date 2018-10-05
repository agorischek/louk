var config = require("./config.js");
var file = config.file;

var louk = require(file("index.js"));
var chai = require("chai");
var assert = chai.assert;

var elementProcessor = require(file("element-processor"));

describe("Element Processor", function(){
    it.skip("assignAttributes", function(){
        // assignAttributes
    });
    it("should assign a closing tag", function(){
        var input = [
            {
                classification: 'tag',
                key: 'a',
                preceding: []
            }
        ];
        assert.equal(elementProcessor.assignMatches(input).length, 2);
    });
    it.skip("insertMatches", function(){
        // insertMatches
    });
    it.skip("closingTag", function(){
        // closingTag
    });
});
