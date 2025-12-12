const FSD_LAYERS = {
  app: 1,
  pages: 2,
  widgets: 3,
  features: 4,
  entities: 5,
  shared: 6,
};

const getLayerFromPath = (filePath) => {
  if (filePath.includes('/app/')) return 'app';
  if (filePath.includes('/pages/')) return 'pages';
  if (filePath.includes('/widgets/')) return 'widgets';
  if (filePath.includes('/features/')) return 'features';
  if (filePath.includes('/entities/')) return 'entities';
  if (filePath.includes('/shared/')) return 'shared';
  return null;
};

const getLayerFromImport = (importPath) => {
  if (importPath.startsWith('@app/')) return 'app';
  if (importPath.startsWith('@pages/')) return 'pages';
  if (importPath.startsWith('@widgets/')) return 'widgets';
  if (importPath.startsWith('@features/')) return 'features';
  if (importPath.startsWith('@entities/')) return 'entities';
  if (importPath.startsWith('@shared/')) return 'shared';

  if (importPath.startsWith('../') || importPath.startsWith('./')) {
    return null;
  }

  return null;
};

const isSharedLibInternalImport = (filePath, importPath) => {
  const isInSharedLib = filePath.includes('/shared/lib/');
  const isTestFile = filePath.includes('.test.');
  const isImportingFromSharedLib = importPath.startsWith('@shared/lib');

  return isInSharedLib && !isTestFile && isImportingFromSharedLib;
};

export default {
  rules: {
    'fsd-imports': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Enforce FSD architecture import rules',
        },
        fixable: null,
        schema: [],
      },
      create(context) {
        return {
          ImportDeclaration(node) {
            const filePath = context.getFilename();
            const importPath = node.source.value;

            if (!filePath.includes('/src/')) {
              return;
            }

            if (isSharedLibInternalImport(filePath, importPath)) {
              context.report({
                node: node.source,
                message: `Files inside shared/lib should not import from @shared/lib. Use relative imports instead.`,
              });
              return;
            }

            const currentLayer = getLayerFromPath(filePath);
            const importLayer = getLayerFromImport(importPath);

            if (!currentLayer || !importLayer) {
              return;
            }

            const currentLayerLevel = FSD_LAYERS[currentLayer];
            const importLayerLevel = FSD_LAYERS[importLayer];

            const isSameLayer = currentLayer === importLayer;
            const isImportingFromLowerLayer =
              importLayerLevel > currentLayerLevel;
            const isTypeOnlyImport =
              node.importKind === 'type' ||
              node.specifiers.every(
                (spec) =>
                  spec.type === 'ImportSpecifier' && spec.importKind === 'type',
              );
            const isSharedImportingFromEntities =
              currentLayer === 'shared' && importLayer === 'entities';

            if (
              !isSameLayer &&
              !isImportingFromLowerLayer &&
              !(isTypeOnlyImport && isSharedImportingFromEntities)
            ) {
              context.report({
                node: node.source,
                message: `Layer "${currentLayer}" cannot import from layer "${importLayer}". Only same layer or lower layers can be imported.`,
              });
            }
          },
        };
      },
    },
  },
};
