const validCharacters = [
  '!', '&', '|', '->', '<->', '=', '(', ')',
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Z', 'Y'
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
 * Splits expression
 * @param {Array} chars Chars
 * @returns Array
 */
function splitExpression (expr) {
  const chars = parseCharacters(expr)

  const stack = []
  const indexStack = []

  const vufs = []
  for (let i = 0; i < chars.length; i++) {
    if (chars[i] === '(') {
      stack.push('(')
      indexStack.push(i + 1)
    } else if (chars[i] === ')') {
      if (stack.length !== 0) {
        const stackTop = stack.pop()

        if (stackTop === '(') {
          const startIndex = indexStack.pop()

          vufs.push(chars.slice(startIndex, i))
        } else {
          throw new Error('Parantheses not matching')
        }
      } else {
        throw new Error('Parantheses not matching')
      }
    }
  }

  if (stack.length !== 0) {
    throw new Error('Parantheses not matching')
  }

  return vufs
}

/**
 * Returns multidimensional array
 * @param {Array} chars Chars
 */
function deepenExpression (chars) {
  const result = []

  const stack = [result]

  for (let i = 1; i < chars.length - 1; i++) {
    if (chars[i] === '(') {
      stack[stack.length - 1].push([null])
      stack.push(stack[stack.length - 1][stack[stack.length - 1].length - 1])
    } else if (chars[i] === ')') {
      stack.pop()
    } else {
      stack[stack.length - 1].push(chars[i])
    }
  }

  return result
}

function determineExpressionHelper (options, tree) {

}

function determineExpression (options, tree) {
  for (let i = 1; i < tree.length; i++) {
    if (Array.isArray(tree[i])) {
      tree[i] = determineExpression(options, tree[i])
    }
  }

  if (tree[1] === '!') {
    tree[0] = determineExpression(options, tree[i])
  } else if (tree[2] === '&') {

  }

  return tree
}

/**
 *
 * @param {String} vuf
 * @param {Number} i
 * @param {String} operator
 * @param {Array} parts
 */
function parseVufOperatorHelper (vuf, i, parts) {
  return function curried (operator) {
    if (vuf.substr(i, operator.length) === operator) {
      parts.push(vuf.substring(0, i))
      parts.push(vuf.substring(i, operator.length))
      parts.push(vuf.substr(operator.length + 1))
      return true
    }
    return false
  }
}

function parseVuf (vuf) {
  const stack = []
  const parts = []

  for (let i = 0; i < vuf.length; i++) {
    if (stack.length === 0) {
      ['!', '&', '|', '->', '<->'].find(parseVufOperatorHelper(vuf, i, parts))
    }

    if (vuf[i] === '(') {
      stack.push('(')
    } else if (vuf[i] === ')') {
      stack.pop()
    }
  }

  return parts
}

function determineVufStack (values, expr) {
  const cache = {
    ...values
  }

  const stack = splitExpression(expr)

  stack.forEach(vuf => {
    console.log(parseVuf(vuf))
  })
}

// console.log(determineVufStack({ P: true, Q: true, S: true }, '(((P&Q)->(R|Q))|(!(P<->(S->Q))))'))

function main ({ expression }) {
  console.log(
    determineExpression(
      options,
      deepenExpression(
        parseCharacters(
          expression
        )
      )
    )
  )
}

main({
  options: { P: true, Q: true, S: true },
  expression: '(((P&Q)->(R|Q))|(!(P<->(S->Q))))'
  // expression: '((P&Q)->(R|Q))'
})
