var config = require("./config.js");
var file = config.file;
var assert = config.assert;

var louk = require(file("index.js"));

var markunit = require("markunit");
var fs = require('fs');
var readme = markunit(fs.readFileSync("./README.md", "utf8"));

describe("Louk (core)", function(){
    it("should return a simple element", function(){
        assert.equal(louk('a'),'<a></a>');
    });
    it("should return a simple header element", function(){
        assert.equal(louk('h1'),'<h1></h1>');
    });
    it("should return a simple img element", function(){
        assert.equal(louk('img'),'<img></img>');
    });
    it("should return two peer elements", function(){
        assert.equal(louk('a\nb'),'<a></a>\n<b></b>');
    });
    it("should return two peer elements without whitespace", function(){
        assert.equal(louk('a\nb',{whitespace:false}),'<a></a><b></b>');
    });
    it("should return a nested element", function(){
        assert.equal(louk('a\n\tb'),'<a>\n\t<b></b>\n</a>');
    });
    it("should return a nested element with dynamic content", function(){
        assert.equal(louk('a\n\tb c'),'<a>\n\t<b>{{c}}</b>\n</a>');
    });
    it("should return an element with dynamic content", function(){
        assert.equal(louk('a b'),'<a>{{b}}</a>');
    });
    it("should return a an element with a class", function(){
        assert.equal(louk('a\n.c'),'<a class="c"></a>');
    });
    it("should return a an element with an ID", function(){
        assert.equal(louk('a\n#c'),'<a id="c"></a>');
    });
    it("should return two peer nested elements", function(){
        assert.equal(louk('a\n\tb\nc\n\td'),'<a>\n\t<b></b>\n</a>\n<c>\n\t<d></d>\n</c>');
    });
    it("should return two peer nested elements without whitespace", function(){
        assert.equal(louk('a\n\tb\nc\n\td',{whitespace:false}),'<a><b></b></a><c><d></d></c>');
    });
    it("should return a double nested element", function(){
        assert.equal(louk('a\n\tb\n\t\tc'),'<a>\n\t<b>\n\t\t<c></c>\n\t</b>\n</a>');
    });
    it("should return a double nested element with a trailing line", function(){
        assert.equal(louk('a\n\tb\n\t\tc\n'),'<a>\n\t<b>\n\t\t<c></c>\n\t</b>\n</a>');
    });
    it("should return a double nested element without whitespace", function(){
        assert.equal(louk('a\n\tb\n\t\tc',{whitespace:false}),'<a><b><c></c></b></a>');
    });
    it("should handle multiple consecutive closures", function(){
        assert.equal(louk('a\n\tb\n\t\tc\nd'),'<a>\n\t<b>\n\t\t<c></c>\n\t</b>\n</a>\n<d></d>');
    });
    it("should return an element with static content", function(){
        assert.equal(louk('a" b'),'<a>b</a>');
    });
    it("should return an element with both a fill and a child element", function(){
        assert.equal(louk('a b\n\tc'),'<a>\n\t{{b}}\n\t<c></c>\n</a>');
    });
    it("should return an element with both a fill and a child element without whitespace", function(){
        assert.equal(louk('a b\n\tc',{whitespace:false}),'<a>{{b}}<c></c></a>');
    });
    it("should return a self-closing element", function(){
        assert.equal(louk('a/'),'<a />');
    });
    it("should return an attribute with dynamic content", function(){
        assert.equal(louk('a\n:b c'),'<a v-bind:b="c"></a>');
    });
    it("should return a boolean attribute", function(){
        assert.equal(louk("a\n'b"),'<a b></a>');
    });
    it("should return an attribute with static content", function(){
        assert.equal(louk("a\n'b c"),'<a b="c"></a>');
    });
    it("should return an element with a simple directive", function(){
        assert.equal(louk('a\n-if b'),'<a v-if="b"></a>');
    });
    it("should return an element with a boolean directive", function(){
        assert.equal(louk('a\n-b'),'<a v-b></a>');
    });
    it("should return an element with a for statement", function(){
        assert.equal(louk('a\n-for b'),'<a v-for="b"></a>');
    });
    it("should return an element with a click action directive", function(){
        assert.equal(louk('a\n@click b'),'<a v-on:click="b"></a>');
    });
    it("should return an element with a key action directive", function(){
        assert.equal(louk('a\n@keyup.enter b'),'<a v-on:keyup.enter="b"></a>');
    });
    it("should return an element with static URL", function(){
        assert.equal(louk('a\n>b'),'<a href="b"></a>');
    });
    it("should pass through HTML content", function(){
        assert.equal(louk('<a>b</a>'),'<a>b</a>');
    });
    it("should discard a comment", function(){
        assert.equal(louk('//a\nb'),'<b></b>');
    });
    it("should pass through multi-line HTML content", function(){
        assert.equal(louk('<a>\n<b></b>\n</a>'),'<a>\n<b></b>\n</a>');
    });
    it("should pass through HTML content with Louk content in it", function(){
        assert.equal(louk('<a>\n<b>\nc d\n</b></a>'),'<a>\n<b>\n<c>{{d}}</c>\n</b></a>');
    });
    it("should pass through an HTML comment", function(){
        assert.equal(louk('a\n<!-- b -->\nc'),'<a></a>\n<!-- b -->\n<c></c>');
    });
    it("should pass through an HTML comment without whitespace", function(){
        assert.equal(louk('a\n<!-- b -->\nc',{whitespace:false}),'<a></a><!-- b --><c></c>');
    });
    it("should handle skipped indentation levels", function(){
        assert.equal(louk('a\n\t\t\tc',{whitespace:false}),'<a><c></c></a>');
    });
    it("should handle a plain boolean attribute", function(){
        assert.equal(louk('style,\n"scoped'),'<style scoped>\n\n</style>');
    });
    it("should handle a Vue boolean attribute", function(){
        assert.equal(louk('div\n-cloak'),'<div v-cloak></div>');
    });
    it("should ignore duplicate attributes", function(){
        assert.equal(louk('div\n"a b\n"a c'),'<div a="b"></div>');
    });
    it("should ignore duplicate shorthand attributes", function(){
        assert.equal(louk('div\n.abc\n.def'),'<div class="abc"></div>');
    });
});
