const ajv = require(`../validator`);

var gradeItemSchema = {
  type: 'object',
  properties: {
    label: {
      type: 'string',
    },
    max: {
      type: 'number',
    },
    min: {
      type: 'number',
    },
  },
  required: ['label', 'min', 'max'],
};

const CreateGradeValidator = ajv.compile({
  type: 'array',
  items: gradeItemSchema,
  minItems: 1,
});

const UpdateGradeValidator = ajv.compile({
  type: 'array',
  items: gradeItemSchema,
  minItems: 1,
});

module.exports = { CreateGradeValidator, UpdateGradeValidator };
