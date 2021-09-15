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
