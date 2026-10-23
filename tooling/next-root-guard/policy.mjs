const defaultRootOnly = {
  meta: {
    type: 'problem',
    docs: { description: 'Require the default Next root under the Conqueror security contract' },
    schema: [],
  },
  create(context) {
    const next = context.settings?.next;
    if (next == null) return {};
    if (typeof next !== 'object' || Array.isArray(next) || Reflect.has(next, 'rootDir')) {
      const error = new Error('CONQUEROR_NEXT_ROOT_POLICY: settings.next.rootDir is unsupported; use the default project root');
      error.code = 'CONQUEROR_NEXT_ROOT_POLICY';
      throw error;
    }
    return {};
  },
};

const rootPolicy = { rules: { 'default-next-root-only': defaultRootOnly } };
export default rootPolicy;
