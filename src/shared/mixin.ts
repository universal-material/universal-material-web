export type MixinBase<ExpectedBase = object> = abstract new (
  // Mixins must have a constructor with `...args: any[]`
  // @ts-ignore
  ...args: any[]
) => ExpectedBase;

export type MixinReturn<MixinBase, MixinClass = object> =
// Mixins must have a constructor with `...args: any[]`
// tslint:disable-next-line:no-any
  (abstract new (...args: any[]) => MixinClass) & MixinBase;
