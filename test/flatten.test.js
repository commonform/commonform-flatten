/* jshint mocha: true */
var expect = require('chai').expect;

var flatten = require('..');

var num = function(sn, sof, en, eof) {
  return {
    series: {number: sn, of: sof},
    element: {number: en, of: eof}
  };
};

var noValues = {};

describe('flatten', function() {
  before(function() {
    var form = {
      content: [
        'before',
        {
          heading: 'A',
          form: {
            conspicuous: 'yes',
            content: [
              'before',
              {form: {content: ['B']}},
              {form: {content: ['C']}},
              'between',
              {form: {content: ['D']}},
              {form: {content: ['E']}},
              'after']}},
        'after']};
    this.flattened = flatten(form, noValues);
  });

  var results = [
    {depth: 1, content: ['before']},
      {depth: 2, heading: 'A', content: ['before'],
          numbering: [num(1, 1, 1, 1)], conspicuous: 'yes'},
        {depth: 3, content: ['B'], numbering: [
          num(1, 1, 1, 1), num(1, 2, 1, 2)]},
        {depth: 3, content: ['C'], numbering: [
          num(1, 1, 1, 1), num(1, 2, 2, 2)]},
      {depth: 2, content: ['between'], conspicuous: 'yes'},
        {depth: 3, content: ['D'], numbering: [
          num(1, 1, 1, 1), num(2, 2, 1, 2)]},
        {depth: 3, content: ['E'], numbering: [
          num(1, 1, 1, 1), num(2, 2, 2, 2)]},
      {depth: 2, content: ['after'], conspicuous: 'yes'},
    {depth: 1, content: ['after']},
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
