import { GraphQLError } from 'graphql/error';
import { Kind } from 'graphql/language';
import validator from 'validator';

export const DateScalar = {
  __serialize: value => String(value),
  __parseValue: value => String(value),
  __parseLiteral: ast => {
    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError(`Query error: Date is not a string, it is a: ${ast.kind}`, [ast]);
    }
    const result = new Date(ast.value);
    if (isNaN(result.getTime())) {
      throw new GraphQLError('Query error: Invalid date', [ast]);
    }
    if (ast.value !== result.toJSON()) {
      throw new GraphQLError('Query error: Invalid date format, only accepts: YYYY-MM-DDTHH:MM:SS.SSSZ', [ast]);
    }
    return result;
  }
};

export const EmailScalar = {
  __serialize: value => validator.normalizeEmail(value),
  __parseValue: value => validator.normalizeEmail(value),
  __parseLiteral: ast => {
    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError(`Query error: Email is not a string, it is a: ${ast.kind}`, [ast]);
    }
    if (!validator.isEmail(ast.value)) {
      throw new GraphQLError('Query error: Invalid email', [ast]);
    }
    if (ast.value.length < 4) {
      throw new GraphQLError(`Query error: Email is too short. The minimum length is 4.`, [ast]);
    }
    if (ast.value.length > 255) {
      throw new GraphQLError(`Query error: Email is too long. The maximum length is 255.`, [ast]);
    }
    return validator.normalizeEmail(ast.value);
  }
};

export const UrlScalar = {
  __serialize: value => String(value),
  __parseValue: value => String(value),
  __parseLiteral: ast => {
    if (!validator.isURL(ast.value)) {
      throw new GraphQLError('Query error: Invalid URL', [ast]);
    }
    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError(`Query error: URL is not a string, it is a: ${ast.kind}`, [ast]);
    }
    if (ast.value.length < 1) {
      throw new GraphQLError(`Query error: URL is too short. The minimum length is 1.`, [ast]);
    }
    if (ast.value.length > 2083) {
      throw new GraphQLError(`Query error: URL is too long. The maximum length is 2083.`, [ast]);
    }
    return String(ast.value);
  }
};
