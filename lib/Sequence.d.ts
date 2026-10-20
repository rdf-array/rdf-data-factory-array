import type * as RDF from '@rdfjs/types';
export declare class Sequence implements RDF.Sequence {
    readonly termType = "Sequence";
    readonly elements: readonly RDF.Term[];
    /**
     * The N-Triples-style spelling `(e1 e2 ...)` of the sequence, so that equal sequences have
     * equal values.
     */
    readonly value: string;
    constructor(elements: Iterable<RDF.Term>);
    equals(other?: RDF.Term | null): boolean;
    /**
     * The N-Triples-style spelling of a term, as used in {@link Sequence.value}.
     * @param term An RDF term.
     */
    static termToString(term: RDF.Term): string;
}
