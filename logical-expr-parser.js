const util = require('util')

function print (obj) {
  console.log(util.inspect(obj, false, null, true))
}

const operators = [
  '!', '&', '|', '->', '<->'
]

const letters = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Z', 'Y'
]

const validCharacters = [
  '=', '(', ')', ',',
  ...operators,
  ...letters
]

function parseCharacters (expr) {
  const chars = []
  for (let i = 0; i < expr.length; i++) {
    for (let j = 0; j < validCharacters.length; j++) {
      const char = validCharacters[j]
      if (expr.substr(i, char.length) === char) {
        i += char.length - 1
        chars.push(char)
        break
      }
    }
  }

  return chars
}

// function validateParenteses (chars) {
//   const stack = []
//   for (let i = 0; i < chars.length; i++) {
//     if (chars[i] === '(') {
//       stack.push('(')
//     } else if (chars[i] === ')') {
//       if (stack.length === 0) {
//         return false
//       } else {
//         const stackTop = stack.pop()

//         if (stackTop !== '(') {
//           return false
//         }
//       }
//     }
//   }

//   return stack.length === 0
// }

/**
 * Returns multidimensional array
 * @param {Array} expression Expression
 */
function makeTree (expression) {
  const chars = parseCharacters(expression)
  const result = [null]

  const stack = [result]

  for (let i = 1; i < chars.length - 1; i++) {
    if (chars[i] === '(') {
      stack[stack.length - 1].push([null])
      stack.push(stack[stack.length - 1][stack[stack.length - 1].length - 1])
    } else if (chars[i] === ')') {
      stack.pop()
    } else if (letters.indexOf(chars[i]) > -1) {
      stack[stack.length - 1].push([null, chars[i]])
    } else {
      stack[stack.length - 1].push(chars[i])
    }
  }

  return result
}

/**
 * Determine tree
 * @param {Object} options Options
 * @param {Array} tree Tree
 * @returns Array
 */
function determineTree (options, tree) {
  if (tree.length === 2 && letters.indexOf(tree[1]) > -1) {
    tree[0] = !!options[tree[1]]
  } else if (tree.length === 2) {
    tree[0] = !!determineTree(options, tree[1])[0]
  } else if (tree[2] === '->') {
    const a = determineTree(options, tree[1])[0]
    const b = determineTree(options, tree[3])[0]

    tree[0] = !!(
      (a && b) ||
      (!a && !b) ||
      (!a && b)
    )
  } else if (tree[2] === '|') {
    const a = determineTree(options, tree[1])[0]
    const b = determineTree(options, tree[3])[0]

    tree[0] = !!(a || b)
  } else if (tree[2] === '&') {
    const a = determineTree(options, tree[1])[0]
    const b = determineTree(options, tree[3])[0]

    tree[0] = !!(a && b)
  } else if (tree[2] === '<->') {
    const a = determineTree(options, tree[1])[0]
    const b = determineTree(options, tree[3])[0]

    tree[0] = !!(
      (a && b) || (!a && !b)
    )
  } else if (tree[1] === '!') {
    const a = determineTree(options, tree[2])[0]

    tree[0] = !a
  }

  return tree
}

/**
 * Determine expression
 * @param {Object} options Options
 * @param {String} expression Expression
 * @returns Array
 */
function determineExpression (options, expression) {
  return determineTree(options, makeTree(expression))
}

/**
 * Sentence
 * @param {String} sentence Sentence
 * @returns Array<Array>
 */
function splitSentence (sentence) {
  return sentence.split('=').map(side => side.split(',').map(a => a.trim()))
}

/**
 * Determine Sentence
 * @param {Object} options Options
 * @param {String} sentence Sentence
 * @returns Array
 */
function determineSentence (options, sentence) {
  const sentenceParts = splitSentence(sentence)
    .map(expressions => expressions.map(expr => determineExpression(options, expr)))

  if (sentenceParts.length !== 2) {
    sentenceParts.unshift(null)
    return sentenceParts
  }

  const truePremises = sentenceParts[0].every(part => part[0])
  const falseConclusion = sentenceParts[1].some(part => !part[0])

  if (truePremises && falseConclusion) {
    sentenceParts.unshift(false)
  } else {
    sentenceParts.unshift(true)
  }

  return sentenceParts
}

function determineTable (sentence) {
  const variations = []
  const usedLetters = []

  for (let i = 0; i < sentence.length; i++) {
    if (letters.indexOf(sentence[i]) > -1 && usedLetters.indexOf(sentence[i]) === -1) {
      usedLetters.push(sentence[i])
    }
  }

  const totalVariations = Math.pow(2, usedLetters.length)
  for (let i = 0; i < totalVariations; i++) {
    const variation = {}
    for (let j = 0; j < usedLetters.length; j++) {
      variation[usedLetters[j]] = (Math.floor((i / (totalVariations / Math.pow(2, j + 1))) % 2) === 0)
    }
    variations.push(variation)
  }

  return variations.map(variation => [
    variation,
    determineSentence(variation, sentence)
  ])
}

/**
 *
 * @param {Array} tree Tree
 * @returns String
 */
function printExpressionTreeHeader (tree, isRoot) {
  if (Array.isArray(tree)) {
    if (tree.length > 2) {
      if (isRoot === true) {
        return tree.slice(1).map(printExpressionTreeHeader).join(' ')
      }
      return `(${tree.slice(1).map(printExpressionTreeHeader).join(' ')})`
    } else {
      return printExpressionTreeHeader(tree[1])
    }
  } else {
    return tree
  }
}

function printBoolean (bool) {
  if (bool) {
    return 's'
  }
  return 'f'
}

function printValid (bool) {
  if (bool) {
    return 'valid'
  } else if (bool === false) {
    return 'invalid'
  }
  return ''
}

/**
 *
 * @param {Array} tree Tree
 * @returns String
 */
function printExpressionTree (tree, isRoot) {
  if (Array.isArray(tree)) {
    if (tree.length === 4) {
      return `${printExpressionTree(tree[1])} ${printBoolean(tree[0])} ${printExpressionTree(tree[3])}`
    } else if (tree.length === 3) {
      return `${printBoolean(tree[0])} ${printExpressionTree(tree[2])}`
    } else if (tree.length === 2) {
      return printBoolean(tree[0])
    }
  }
}

function printOptions (letters, options) {
  return letters.map(letter => printBoolean(options[letter])).join(' ')
}

function printTable (sentence) {
  const determinations = determineTable(sentence)
  const letters = Object.keys(determinations[0][0])

  const sentenceHeader = determinations[0][1].slice(1)
    .map(side => side.map(tree => printExpressionTreeHeader(tree, true)).join(', '))
    .join(' = ')

  const spaces = sentenceHeader.split(' ').reduce(
    (acc, component, index, arr) => {
      if (index === arr.length - 1) {
        return acc
      }

      if (component === '=') {
        acc[acc.length - 1] += 2
        return acc
      }

      for (let i = 0; i < component.length; i++) {
        if (component[i] !== '(') {
          acc.push(component.length - 1 - i)
          break
        } else {
          acc[acc.length - 1] += 1
        }
      }
      return acc
    },
    [0]
  )

  const lines = [
    `[ ${letters.join(' ')} ]   ${sentenceHeader}`,
    ...determinations.map(determination => {
      const lineValues = determination[1].slice(1)
        .map(side => side.map(tree => printExpressionTree(tree)).join(' '))
        .join(' ')
        .split(' ')
        .map((value, index) => [...new Array(spaces[index])].fill(' ').join('') + value)
        .join(' ')

      return `[ ${printOptions(letters, determination[0])} ]   ${lineValues}    ${printValid(determination[1][0])}`
    })
  ]

  lines.forEach(line => console.log(line))
}

function main (sentence) {
  const result = printTable(sentence)

  console.log(util.inspect(result, false, null, true))
}

main(
  // '(((P&Q)->(R|Q))|(!(P<->(S->Q))))',
  // '(((((Q)->(R))|((Q)->(!(R))))->((P)|(Q)))<->(P))'
  // expression: '((P&Q)->(R|Q))'
  // expression: '((P&Q)->(P|Q))'
  // '(P->Q),(Q)=(P)'
  '(((P)->(Q))|((!(R))->(Q))), (!((R)&(P))) |= ((Q)|(P))'
)
