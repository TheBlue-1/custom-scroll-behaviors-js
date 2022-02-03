//if a setting is set to a function the function will be called each scroll event
export const scrollElementsConfig: Config = {
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
  for (const key in scrollElementsConfig) {
    const k = <keyof CurrentConfig>key;
    config[k] = typeof scrollElementsConfig[k] == "function" ? (<() => any>scrollElementsConfig[k])() : scrollElementsConfig[k];
  }
  return config;
}
