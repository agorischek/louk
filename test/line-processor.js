var config = require("./config.js");
var file = config.file;
var assert = config.assert;

var louk = require(file("index.js"));

var lineProcessor = require(file("line-processor"));

describe("Line Processor", function(){
    it("should delete comments", function(){
        var input = [
            { raw: '//a', lineType: 'comment' },
            { raw: 'b', lineType: 'louk' }
        ];
        assert.equal(lineProcessor.deleteComments(input).length, 1);
    });
    it("should break lines", function(){
        assert.deepEqual(lineProcessor.breakLines("a\n\tb c"), ['a','\tb c']);
    });
});
