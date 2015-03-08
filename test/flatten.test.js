/* jshint mocha: true */
var Immutable = require('immutable');
var expect = require('chai').expect;
var resolve = require('commonform-resolve');
var number = require('commonform-number');

var flatten = require('..');

var num = function(sn, sof, en, eof) {
  return {
    series: {number: sn, of: sof},
    element: {number: en, of: eof}
  };
};

var noValues = Immutable.Map();

describe('flatten', function() {
  describe('integration test', function() {
    before(function() {
      var form = Immutable.fromJS({
        content: [
          'before',
          {
            heading: 'A',
            inclusion: {
              conspicuous: 'true',
              content: [
                'before',
                {inclusion: {content: ['B']}},
                {inclusion: {content: ['C']}},
                'between',
                {inclusion: {content: ['D']}},
                {inclusion: {content: ['E']}},
                'after'
              ]
            }
          },
          'after'
        ]
      });
      var numbering = number(form);
      var resolved = resolve(form, noValues, numbering);
      this.flattened = flatten(resolved);
    });

    var results = [
      {depth: 1, content: ['before']},
        {depth: 2, heading: 'A', content: ['before'],
            numbering: [num(1, 1, 1, 1)], conspicuous: 'true'},
          {depth: 3, content: ['B'], numbering: [
            num(1, 1, 1, 1), num(1, 2, 1, 2)]},
          {depth: 3, content: ['C'], numbering: [
            num(1, 1, 1, 1), num(1, 2, 2, 2)]},
        {depth: 2, content: ['between'], conspicuous: 'true'},
          {depth: 3, content: ['D'], numbering: [
            num(1, 1, 1, 1), num(2, 2, 1, 2)]},
          {depth: 3, content: ['E'], numbering: [
            num(1, 1, 1, 1), num(2, 2, 2, 2)]},
        {depth: 2, content: ['after'], conspicuous: 'true'},
      {depth: 1, content: ['after']},
    ];

    results.forEach(function(object, index) {
      it('element ' + index + ' is as expected', function() {
        expect(this.flattened.get(index).toJS())
          .to.eql(object);
      });
    });

    it('results length is ' + results.length, function() {
      expect(this.flattened.count())
        .to.equal(results.length);
    });
  });
});
