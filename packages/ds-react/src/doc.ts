/**
 * Typed component documentation (FE §5.3, §5.6). Props are referenced by typed name, so renaming or removing a
 * prop breaks type checking of the doc instead of silently leaving it stale.
 */
export interface ComponentDoc<P> {
  name: string;
  status: 'experimental' | 'stable' | 'deprecated';
  summary: string;
  /** WAI-ARIA Authoring Practices pattern this component implements. */
  a11yPattern: string;
  /** Knowledge Record id of the Contract Spec (FE §5.4). */
  contract: string;
  /** Descriptions of the props this component adds or constrains. */
  props: { [K in keyof P]?: string };
  do: string[];
  dont: string[];
}
