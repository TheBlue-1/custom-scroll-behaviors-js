//if a setting is set to a function the function will be called each scroll event
export const ScrollElementsConfig: Config = {
  //if set to true the html attributes of the behavior elements will be read at each scroll event. otherwise they will only be read once.
  alwaysCheckAttributes: false,
};
export class CurrentConfig {
  public alwaysCheckAttributes: boolean = false;
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
