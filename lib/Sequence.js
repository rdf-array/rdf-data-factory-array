"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sequence = void 0;
/**
 * RDF-: a term that is an ordered sequence of terms.
 *
 * In Turtle, `(1 2 3)` is one such term rather than an rdf:first/rdf:rest ladder of blank
 * nodes, and `()` is the empty sequence rather than rdf:nil. A sequence is immutable, and two
 * sequences are equal when their elements are pairwise equal.
 */
/**
 * The N-Triples escape of a character that may not appear bare in a literal.
 */
function escapeLiteralChar(char) {
    switch (char) {
        case '"': return '\\"';
        case '\\': return '\\\\';
        case '\n': return '\\n';
        default: return '\\r';
    }
}
class Sequence {
    constructor(elements) {
        this.termType = 'Sequence';
        this.elements = Object.freeze([...elements]);
        this.value = `(${this.elements.map(element => Sequence.termToString(element)).join(' ')})`;
    }
    equals(other) {
        return !!other && other.termType === 'Sequence' &&
            other.elements.length === this.elements.length &&
            this.elements.every((element, index) => element.equals(other.elements[index]));
    }
    /**
     * The N-Triples-style spelling of a term, as used in {@link Sequence.value}.
     * @param term An RDF term.
     */
    static termToString(term) {
        switch (term.termType) {
            case 'NamedNode':
                return `<${term.value}>`;
            case 'BlankNode':
                return `_:${term.value}`;
            case 'Variable':
                return `?${term.value}`;
            case 'DefaultGraph':
                return '';
            case 'Literal':
                return `"${term.value
                    // eslint-disable-next-line unicorn/prefer-string-replace-all
                    .replace(/["\\\n\r]/gu, escapeLiteralChar)}"${term.language ?
                    `@${term.language}${term.direction ? `--${term.direction}` : ''}` :
                    (term.datatype.value === 'http://www.w3.org/2001/XMLSchema#string' ?
                        '' :
                        `^^<${term.datatype.value}>`)}`;
            case 'Quad':
                return `<<${Sequence.termToString(term.subject)} ${Sequence.termToString(term.predicate)} ${Sequence.termToString(term.object)}${term.graph.termType === 'DefaultGraph' ? '' : ` ${Sequence.termToString(term.graph)}`}>>`;
            case 'Sequence':
                return term.value;
        }
        throw new Error(`Unknown term type: ${term.termType}`);
    }
}
exports.Sequence = Sequence;
//# sourceMappingURL=Sequence.js.map