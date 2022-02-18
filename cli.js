const printTable = require('./logical-expr-parser')

try {
  printTable('(P->Q)v((!R)->Q), !(R&P) = QvP').split('\n').forEach(line => console.log(line))
} catch (err) {
  console.log(err.toString())
}
