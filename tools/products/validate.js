// A value checked against a JSON Schema (FS-825), for the subset the
// product vocabulary's schema is written in. The repository installs no
// packages, so this is ours; the code repository's full validator reads
// the same file. A schema using a keyword outside the subset is refused,
// so the two can never disagree about what a keyword means.

'use strict';

const KEYWORDS = new Set([
  '$schema', '$id', '$ref', '$defs', 'title', 'description',
  'type', 'enum', 'const', 'properties', 'required', 'additionalProperties',
  'items', 'minItems', 'uniqueItems', 'minimum', 'maximum', 'exclusiveMinimum', 'pattern', 'anyOf',
]);

// Every keyword the schema uses, anywhere, is in the subset.
function subsetProblems(schema, at = '#') {
  const out = [];
  if (!schema || typeof schema !== 'object') return out;
  for (const [k, v] of Object.entries(schema)) {
    if (!KEYWORDS.has(k)) out.push(`${at}: "${k}" is outside the subset this validator reads`);
    if (k === 'properties' || k === '$defs') for (const [n, s] of Object.entries(v)) out.push(...subsetProblems(s, `${at}/${k}/${n}`));
    if (k === 'items' || k === 'additionalProperties') out.push(...subsetProblems(v, `${at}/${k}`));
    if (k === 'anyOf') v.forEach((s, i) => out.push(...subsetProblems(s, `${at}/anyOf/${i}`)));
  }
  return out;
}

const typeOf = (v) => (v === null ? 'null' : Array.isArray(v) ? 'array' : Number.isInteger(v) ? 'integer' : typeof v);
const isType = (v, t) => t === typeOf(v) || (t === 'number' && typeof v === 'number');

// The problems with `value` under `schema`, each with its path. With
// blanks, a null anywhere is a blank still to fill, not an error.
function validate(schema, value, { root = schema, blanks = false, path = '' } = {}) {
  const errs = [];
  const at = path || '(the value)';
  if (blanks && value === null) return errs;
  if (schema.$ref) {
    const name = schema.$ref.replace(/^#\/\$defs\//, '');
    if (!root.$defs || !root.$defs[name]) return [`${at}: unknown $ref ${schema.$ref}`];
    return validate(root.$defs[name], value, { root, blanks, path });
  }
  if (schema.anyOf) {
    const tries = schema.anyOf.map((s) => validate(s, value, { root, blanks, path }));
    if (!tries.some((e) => e.length === 0)) {
      const best = tries.reduce((a, b) => (b.length < a.length ? b : a));
      errs.push(`${at}: matches none of its ${schema.anyOf.length} forms; nearest: ${best.join('; ')}`);
    }
    return errs;
  }
  if (schema.type) {
    const types = [].concat(schema.type);
    if (!types.some((t) => isType(value, t))) return [`${at}: ${JSON.stringify(value)} is not ${types.join(' or ')}`];
  }
  if (schema.const !== undefined && value !== schema.const) errs.push(`${at}: must be ${JSON.stringify(schema.const)}`);
  if (schema.enum && !schema.enum.includes(value)) errs.push(`${at}: ${JSON.stringify(value)} is not one of ${schema.enum.join(', ')}`);
  if (typeof value === 'number') {
    if (schema.minimum !== undefined && value < schema.minimum) errs.push(`${at}: ${value} is below ${schema.minimum}`);
    if (schema.maximum !== undefined && value > schema.maximum) errs.push(`${at}: ${value} is above ${schema.maximum}`);
    if (schema.exclusiveMinimum !== undefined && value <= schema.exclusiveMinimum) errs.push(`${at}: ${value} must be above ${schema.exclusiveMinimum}`);
  }
  if (typeof value === 'string' && schema.pattern && !new RegExp(schema.pattern).test(value)) errs.push(`${at}: "${value}" does not match ${schema.pattern}`);
  if (Array.isArray(value)) {
    if (schema.minItems !== undefined && value.length < schema.minItems) errs.push(`${at}: fewer than ${schema.minItems} items`);
    if (schema.uniqueItems && new Set(value.map((v) => JSON.stringify(v))).size !== value.length) errs.push(`${at}: items repeat`);
    if (schema.items) value.forEach((v, i) => errs.push(...validate(schema.items, v, { root, blanks, path: `${path}[${i}]` })));
  }
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    for (const r of schema.required || []) if (!(r in value)) errs.push(`${at}: "${r}" is required`);
    const props = schema.properties || {};
    for (const [k, v] of Object.entries(value)) {
      const sub = props[k] || (typeof schema.additionalProperties === 'object' ? schema.additionalProperties : null);
      if (sub) errs.push(...validate(sub, v, { root, blanks, path: path ? `${path}.${k}` : k }));
      else if (schema.additionalProperties === false) errs.push(`${at}: "${k}" is not a field of it`);
    }
  }
  return errs;
}

module.exports = { validate, subsetProblems, KEYWORDS };
