const indentations: { [key: number]: string } = {
  1: '  ',
  2: '    ',
  3: '      ',
  4: '        ',
  5: '          ',
  6: '            ',
  7: '              ',
  8: '                ',
  9: '                  '
}

export function indent(i: number): string {
  if (i === 0) return ''
  return indentations[i] || new Array(i).join(`  `)
}

export function escapeString(s: string): string {
  return '\'' + s.replace(/'/g, "\\'") + '\''
}

function isValidPropName(s: string): boolean {
  return /[-\s]/.exec(s) === null
}

export function escapeProp(prop: string): string {
  return isValidPropName(prop) ? prop : escapeString(prop)
}
