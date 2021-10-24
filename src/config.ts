//if a setting is set to a function the function will be called each scroll event
export const ScrollElementsConfig: Config = {
  //just a sample because an empty class wouldn't work out with the typings
  sampleSetting: false,
};
export class CurrentConfig {
  public sampleSetting: boolean = false;
}
export type Config = {
  [Property in keyof CurrentConfig]:
    | CurrentConfig[Property]
    | (() => CurrentConfig[Property]);
};
export function getCurrentConfig(): CurrentConfig {
  const config: CurrentConfig = new CurrentConfig();
  for (const key in ScrollElementsConfig) {
    const k = <keyof CurrentConfig>key;
    config[k] =
      typeof ScrollElementsConfig[k] == "function"
        ? (<() => any>ScrollElementsConfig[k])()
        : ScrollElementsConfig[k];
  }
  return config;
}
let attributeName: keyof {
  [Property in keyof CSSStyleDeclaration]: CSSStyleDeclaration[Property] extends string
    ? IfEquals<
        CSSStyleDeclaration,
        { -readonly [Q in Property]: string },
        Property
      >
    : never;
};
type IfEquals<X, Y, A = X, B = never> = (<T>() => T extends X ? 1 : 2) extends <
  T
>() => T extends Y ? 1 : 2
  ? A
  : B;

type WritableKeys<T> = {
  [P in keyof T]-?: IfEquals<
    { [Q in P]: T[P] },
    { -readonly [Q in P]: T[P] },
    P
  >;
}[keyof T];
