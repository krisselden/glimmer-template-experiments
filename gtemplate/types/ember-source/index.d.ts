declare module 'ember-source/dist/ember-template-compiler.js' {
  const emberTemplateCompiler: {
    readonly defaultPlugins: import('@glimmer/syntax').ASTPluginBuilder[];
  };
  export = emberTemplateCompiler;
}
