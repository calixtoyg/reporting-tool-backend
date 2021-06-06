import { NowRequestHandler } from 'fastify-now';
import S from 'fluent-json-schema';

export const GET: NowRequestHandler = async function () {
  return { hello: 'worl gasgasgd gasgsga' };
};

GET.opts = {
  schema: {
    response: {
      200: S.object().prop('hello', S.string().required()),
    },
  },
};
export const PostReportSchema = {
  description: 'Creates a report from a CSV',
  tags: ['reporting'],
  summary: 'Creates a report for product managers from a CSV',
  body: {
    type: 'object',
    required: ['file'],
    properties: {
      file: { $ref: '#mySharedSchema' },
    },
  },
  consumes: ['multipart/form-data'],
  produces: ['application/json'],
  exposeRoute: true,
};
