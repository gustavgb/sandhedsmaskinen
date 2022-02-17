const printTable = require('./logical-expr-parser')

try {
  printTable('(P->Q)|((!R)->Q), !(R&P) = Q|P').split('\n').forEach(line => console.log(line))
} catch (err) {
  console.log(err.toString())
}
