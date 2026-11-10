/** Validate req[source] with a zod schema; replace it with the parsed (trimmed, typed) data. */
export function validate(schema, source = 'body') {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const fields = {};
      for (const issue of result.error.issues) {
        const key = issue.path.join('.') || '_';
        if (!fields[key]) fields[key] = issue.message;
      }
      return res.status(400).json({
        error: { code: 'validation_error', message: 'Please check the highlighted fields', fields },
      });
    }
    req[source] = result.data;
    next();
  };
}
