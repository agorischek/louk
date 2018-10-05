"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    prefix: /^([":@-])/,
    staticPrefix: /^(["])/,
    suffix: /(["/,])$/,
    staticSuffix: /(["/,])$/,
    plainCrux: /^(.+)/,
    modifiedCrux: /^(.+?)\s/,
    staticCrux: /^([>#\.]).*/,
    sectionCrux: /^(\w+),/,
    fill: /^.+?\s(.+)/,
    staticFill: /^[>#\.](.*)/,
    key: /^[":@-]*([\w\.-]+)/,
    loukLangAttribute: /"lang louk/,
    unindentedElement: /^[\w<]/,
    comment: /^\/\/(.*)/,
    html: /^([<])/,
    initialSpace: /^(\s)/,
    whitespace: /^(\s*)/,
    unindented: /^\S/,
};
