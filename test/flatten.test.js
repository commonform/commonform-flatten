/* jshint mocha: true */
var expect = require('chai').expect;
var flatten = require('..');
var resolve = require('commonform-resolve');

var testProject = function(content, values) {
  return {
    commonform: '0.0.0',
    metadata: {title: 'Test'},
    preferences: {},
    values: values || {},
    form: {content: content}
  };
};

var num = function(sn, sof, en, eof) {
  return {
    series: {number: sn, of: sof},
    element: {number: en, of: eof}
  };
};

describe('flatten', function() {
  describe('integration test', function() {
    before(function() {
      var project = testProject([
        'before',
        {
          summary: 'A',
          form: {
            conspicuous: 'true',
            content: [
              'before',
              {form: {content: ['B']}},
              {form: {content: ['C']}},
              'between',
              {form: {content: ['D']}},
              {form: {content: ['E']}},
              'after'
            ]
          }
        },
        'after'
      ]);
      this.flattened = flatten(resolve(project)).flattened;
    });

    var results = [
      {depth: 1, flattened: ['before']},
        {depth: 2, summary: 'A', flattened: ['before'],
            numbering: [num(1, 1, 1, 1)], conspicuous: 'true'},
          {depth: 3, flattened: ['B'], numbering: [
            num(1, 1, 1, 1), num(1, 2, 1, 2)]},
          {depth: 3, flattened: ['C'], numbering: [
            num(1, 1, 1, 1), num(1, 2, 2, 2)]},
        {depth: 2, flattened: ['between'], conspicuous: 'true'},
          {depth: 3, flattened: ['D'], numbering: [
            num(1, 1, 1, 1), num(2, 2, 1, 2)]},
          {depth: 3, flattened: ['E'], numbering: [
            num(1, 1, 1, 1), num(2, 2, 2, 2)]},
        {depth: 2, flattened: ['after'], conspicuous: 'true'},
      {depth: 1, flattened: ['after']},
    ];

    results.forEach(function(object, index) {
      it('element ' + index + ' is as expected', function() {
        expect(this.flattened[index])
          .to.eql(object);
      });
    });

    it('results length is ' + results.length, function() {
      expect(this.flattened.length)
        .to.equal(results.length);
    });
  });
});
