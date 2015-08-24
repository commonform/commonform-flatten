Produces a useful intermediary representation for rendering in linear document formats, like [Office Open XML](https://npmjs.com/package/commonform-docx) and [terminal listings](https://npmjs.com/package/commonform-terminal).

```javascript
var flatten = require('commonform-flatten')

var num = function(sn, sof, en, eof) {
  return {
    series: { number: sn, of: sof },
    element: { number: en, of: eof } } }

var form = {
  content: [
    'before',
    { heading: 'A',
      form: {
        conspicuous: 'yes',
        content: [
          'before',
          { form: { content: [ 'B' ] } },
          { form: { content: [ 'C' ] } },
          'between',
          { form: { content: [ 'D' ] } },
          { form: { content: [ 'E' ] } },
          'after' ] } },
    'after' ] }

var flattened = flatten(form, { })

var results = [
  { depth: 1, content: [ 'before' ] },
    { depth: 2, heading: 'A', content: [ 'before' ],
        numbering: [ num(1, 1, 1, 1) ], conspicuous: 'yes' },
      { depth: 3, content: [ 'B' ], numbering: [
        num(1, 1, 1, 1), num(1, 2, 1, 2) ] },
      { depth: 3, content: [ 'C' ], numbering: [
        num(1, 1, 1, 1), num(1, 2, 2, 2) ] },
    { depth: 2, content: [ 'between' ], conspicuous: 'yes' },
      { depth: 3, content: [ 'D' ], numbering: [
        num(1, 1, 1, 1), num(2, 2, 1, 2) ] },
      { depth: 3, content: [ 'E' ], numbering: [
        num(1, 1, 1, 1), num(2, 2, 2, 2) ] },
    { depth: 2, content: [ 'after' ], conspicuous: 'yes' },
  { depth: 1, content: [ 'after' ] } ]

var assert = require('assert')

results
  .forEach(function(object, index) {
    assert.deepEqual(this.flattened[index], object) })

assert.equal(this.flattened.length, results.length)
```
