import { OpenAPIHono } from "@hono/zod-openapi";
import {
  createUserBlockRoute,
  deleteUserBlockRoute,
  listUserBlocksRoute,
} from "../../openapi/userBlock";
import { handleErrors } from "../error";
import { svc } from "../service";

const app = new OpenAPIHono();

app.openapi(createUserBlockRoute, async (c) => {
  return handleErrors(async (ctx) => {
    const {
      blockedId,
      userId
    } = ctx.req.valid("json");
    const res = await svc.userBlock.create(ctx, userId, blockedId);
    return ctx.json(res, 201);
  }, c);
});

app.openapi(deleteUserBlockRoute, async (c) => {
  return handleErrors(async (ctx) => {
    const {
      userId,
      blockedId
    } = ctx.req.valid("json");
    await svc.userBlock.delete(ctx, userId, blockedId);
    return ctx.json(null, 204);
  }, c);
});

app.openapi(listUserBlocksRoute, async (c) => {
  return handleErrors(async (ctx) => {
    const query = ctx.req.valid("query")
    const {
      userId,
    } = ctx.req.valid("json")
    const page = query.page ? Number.parseInt(query.page) : 1;
    const limit = query.limit ? Number.parseInt(query.limit) : 20;
    const res = await svc.userBlock.getAll(ctx, userId, page, limit);
    return ctx.json(res);
  }, c);
});

export { app as userBlockApp };
