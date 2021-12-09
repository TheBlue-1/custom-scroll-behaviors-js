//if a setting is set to a function the function will be called each scroll event
export const ScrollElementsConfig: Config = {
  //just a sample because an empty class wouldn't work out with the typings
  autoSizePage: true,
};
export class CurrentConfig {
  public autoSizePage: boolean = false;
}
export type Config = {
  [Property in keyof CurrentConfig]: CurrentConfig[Property] | (() => CurrentConfig[Property]);
};
export function getCurrentConfig(): CurrentConfig {
  const config: CurrentConfig = new CurrentConfig();
  for (const key in ScrollElementsConfig) {
    const k = <keyof CurrentConfig>key;
    config[k] = typeof ScrollElementsConfig[k] == "function" ? (<() => any>ScrollElementsConfig[k])() : ScrollElementsConfig[k];
  }
  return config;
}
