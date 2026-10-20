import type * as RDF from '@rdfjs/types';

/**
 * RDF-: a term that is an ordered sequence of terms.
 *
 * In Turtle, `(1 2 3)` is one such term rather than an rdf:first/rdf:rest ladder of blank
 * nodes, and `()` is the empty sequence rather than rdf:nil. A sequence is immutable, and two
 * sequences are equal when their elements are pairwise equal.
 */
export class Sequence implements RDF.Sequence {
  public readonly termType = 'Sequence';
  public readonly elements: readonly RDF.Term[];
  /**
   * The N-Triples-style spelling `(e1 e2 ...)` of the sequence, so that equal sequences have
   * equal values.
   */
  public readonly value: string;

  public constructor(elements: Iterable<RDF.Term>) {
    this.elements = Object.freeze([ ...elements ]);
    this.value = `(${this.elements.map(element => Sequence.termToString(element)).join(' ')})`;
  }

  public equals(other?: RDF.Term | null): boolean {
    return !!other && other.termType === 'Sequence' &&
      other.elements.length === this.elements.length &&
      this.elements.every((element, index) => element.equals(other.elements[index]));
  }

  /**
   * The N-Triples-style spelling of a term, as used in {@link Sequence.value}.
   * @param term An RDF term.
   */
  public static termToString(term: RDF.Term): string {
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
          .replaceAll('\\', '\\\\')
          .replaceAll('"', '\\"')
          .replaceAll('\n', '\\n')
          .replaceAll('\r', '\\r')}"${
          term.language ?
            `@${term.language}${term.direction ? `--${term.direction}` : ''}` :
            (term.datatype.value === 'http://www.w3.org/2001/XMLSchema#string' ?
              '' :
              `^^<${term.datatype.value}>`)}`;
      case 'Quad':
        return `<<${Sequence.termToString(term.subject)} ${Sequence.termToString(term.predicate)} ${
          Sequence.termToString(term.object)}${
          term.graph.termType === 'DefaultGraph' ? '' : ` ${Sequence.termToString(term.graph)}`}>>`;
      case 'Sequence':
        return term.value;
    }
    throw new Error(`Unknown term type: ${(<RDF.Term> term).termType}`);
  }
}
