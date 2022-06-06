# commonform-flatten

Produces a useful intermediary representation for rendering in linear document formats, like [Office Open XML](https://npmjs.com/package/commonform-docx) and [terminal listings](https://npmjs.com/package/commonform-terminal).

```javascript
var flatten = require('commonform-flatten')
var assert = require('assert')

assert.deepStrictEqual(
  flatten(
    {
      content: [
        'some text ',
        { blank: '' },
        {
          heading: 'A',
          form: {
            conspicuous: 'yes',
            content: [
              'before',
              { form: { content: ['B'] } },
              { form: { content: ['C'] } },
              'between',
              { form: { content: ['D'] } },
              { form: { content: ['E'] } },
              'after'
            ]
          }
        },
        'after',
        { use: 'A Defined Term' },
        {
          heading: 'Some Component',
          component: 'https://example.com/component',
          version: '1.0.0',
          substitutions: {
            terms: {},
            headings: {}
          }
        }
      ]
    },
    [{ blank: ['content', 1], value: 'NewCo' }]
  ),
  [
    {
      depth: 1,
      content: [
        'some text ',
        { blank: 'NewCo' }
      ]
    },
    {
      depth: 2,
      heading: 'A',
      content: ['before'],
      numbering: [
        {
          series: { number: 1, of: 2 },
          element: { number: 1, of: 1 }
        }
      ],
      conspicuous: 'yes'
    },
    {
      depth: 3,
      content: ['B'],
      numbering: [
        {
          series: { number: 1, of: 2 },
          element: { number: 1, of: 1 }
        },
        {
          series: { number: 1, of: 2 },
          element: { number: 1, of: 2 }
        }
      ]
    },
    {
      depth: 3,
      content: ['C'],
      numbering: [
        {
          series: { number: 1, of: 2 },
          element: { number: 1, of: 1 }
        },
        {
          series: { number: 1, of: 2 },
          element: { number: 2, of: 2 }
        }
      ]
    },
    {
      depth: 2,
      content: ['between'],
      conspicuous: 'yes'
    },
    {
      depth: 3,
      content: ['D'],
      numbering: [
        {
          series: { number: 1, of: 2 },
          element: { number: 1, of: 1 }
        },
        {
          series: { number: 2, of: 2 },
          element: { number: 1, of: 2 }
        }
      ]
    },
    {
      depth: 3,
      content: ['E'],
      numbering: [
        {
          series: { number: 1, of: 2 },
          element: { number: 1, of: 1 }
        },
        {
          series: { number: 2, of: 2 },
          element: { number: 2, of: 2 }
        }
      ]
    },
    {
      depth: 2,
      content: ['after'],
      conspicuous: 'yes'
    },
    {
      depth: 1,
      content: [
        'after',
        { use: 'A Defined Term' }
      ]
    },
    {
      depth: 2,
      heading: 'Some Component',
      component: 'https://example.com/component',
      version: '1.0.0',
      substitutions: { terms: {}, headings: {} },
      numbering: [
        {
          series: { number: 2, of: 2 },
          element: { number: 1, of: 1 }
        }
      ]
    }
  ]
)
```

Preserves loaded component attributes:

```javascript
var form = { content: ['This is a test.'] }

var reference = {
  component: 'https://example.com/component',
  version: '1.0.0',
  substitutions: { terms: {}, headings: {} }
}

var component = {
  publisher: 'Example Publisher',
  name: 'Example Component',
  version: '1.0.0'
}

assert.deepStrictEqual(
  flatten(
    {
      content: [
        {
          heading: 'Example Component',
          form: form,
          component: component,
          reference: reference
        }
      ]
    },
    [/* no blanks */]
  ),
  [
    {
      depth: 2,
      heading: 'Example Component',
      content: ['This is a test.'],
      reference: reference,
      component: component,
      numbering: [
        {
          element: { number: 1, of: 1 },
          series: { number: 1, of: 1 }
        }
      ]
    }
  ]
)
```
