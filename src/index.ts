import type { TranspileOptions } from 'typescript';
import * as typescript from 'typescript';

import { Transformer } from '@parcel/plugin';
import SourceMap from '@parcel/source-map';
import { loadTSConfig } from '@parcel/ts-utils';
import { relativeUrl } from '@parcel/utils';

export default new Transformer({
  async loadConfig({ config, options }) {
    return loadTSConfig(config, options);
  },

  async transform({ asset, config, options }) {
    asset.type = 'js';

    let code = await asset.getCode();

    let transpiled = typescript.transpileModule(code, {
      compilerOptions: {
        // React is the default. Users can override this by supplying their own tsconfig,
        // which many TypeScript users will already have for typechecking, etc.
        jsx: typescript.JsxEmit.React,
        ...config as Object,
        // Always emit output
        noEmit: false,
        // Don't compile ES `import`s -- scope hoisting prefers them and they will
        // otherwise compiled to CJS via babel in the js transformer
        module: typescript.ModuleKind.ESNext,
        sourceMap: !!asset.env.sourceMap,
      },
      fileName: asset.filePath, // Should be relativePath?
    } as TranspileOptions);

    const originalMap = await asset.getMap();

    let map: SourceMap;
    let { outputText, sourceMapText } = transpiled;
    if (sourceMapText != null) {
      map = new SourceMap(options.projectRoot);
      type Writeable<T> = { -readonly [P in keyof T]: Writeable<T[P]> };

      const sourcePath = relativeUrl(options.projectRoot, asset.filePath);

      const jsourceMap = JSON.parse(sourceMapText) as Writeable<
        Parameters<typeof map['addVLQMap']>[0]
      >;

      jsourceMap.file = sourcePath;

      // replace path with one relative to root
      jsourceMap.sources[0] = sourcePath;

      map.addVLQMap(jsourceMap);

      // extend original if there is one
      if (originalMap) {
        map.extends(originalMap.toBuffer());
      }

      outputText = outputText.substring(
        0,
        outputText.lastIndexOf('//# sourceMappingURL')
      );
    }

    return [
      {
        type: 'js',
        content: outputText,
        map,
      },
    ];
  },
});