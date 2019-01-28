/* jshint node: true, mocha: true */

'use strict';

var types = require('../lib/types'),
    assert = require('assert');

var schema = 
[
{
    "type": "record",
    "name": "TextData",
    "fields":
    [
        {"name": "id", "type": "int"},
        {"name": "text", "type": "string"}
    ]
},
{
    "type": "record",
    "name": "IntData",
    "fields":
    [
        {"name": "id", "type": "int"},
        {"name": "int", "type": "int"}
    ]
}
]


function TextData(id, text) {
    this.id = id
    this.text = text
}

function IntData(id, int) {
    this.id = id
    this.int = int
}

var classMapping = {
    getIndex: (type, fieldName) => {
        if (fieldName !== "TextData" && fieldName !== "IntData") return undefined
        let idx = -1
        type.types.some((t, i) => {
          if (t.name === fieldName) {
            idx = i
            return true
          }
          return false
        })
        if (idx < 0) return undefined
        return idx
    },
    getConstructor: (fieldName) => {
        if (fieldName === "TextData") return TextData
        if (fieldName === "IntData") return IntData
        return undefined
    }
}

suite("classMapping", function () {
    var type = types.Type.forSchema(schema, {
        wrapUnions: false,
        classMapping
    })

    test("basic text", function () {
        var original = new TextData(1, "test data")
        var buffer = type.toBuffer(original)
        var copy = type.fromBuffer(buffer)
        assert.equal(copy instanceof TextData, true)
        assert.deepEqual(original, copy)
    })

    test("basic int", function () {
        var original = new IntData(1, 123)
        var buffer = type.toBuffer(original)
        var copy = type.fromBuffer(buffer)
        assert.equal(copy instanceof IntData, true)
        assert.deepEqual(original, copy)
    })
})
