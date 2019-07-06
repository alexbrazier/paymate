/* eslint-disable import/no-dynamic-require */
export interface AssetMap {
  [name: string]: string;
}

export const createAssetMap = (context: any): AssetMap =>
  context.keys().reduce((assets: AssetMap, next: string) => {
    const name = next.replace('./', '');
    assets[name] = context(next);
    return assets;
  }, {});

const assets: AssetMap = createAssetMap(
  // @ts-ignore
  require.context('.', true, /\.(png|jpe?g|svg)$/)
);

export default assets;
