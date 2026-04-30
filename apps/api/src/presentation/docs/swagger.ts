export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'PIDEC API',
    version: '1.0.0',
    description: 'Complete API Documentation for the Prototype Inter-Departmental Engineering Challenge (PIDEC).',
  },
  servers: [
    {
      url: '/api/v1',
      description: 'Current API Version',
    },
  ],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'access_token',
        description: 'Authentication is handled via HTTP-Only cookies.',
      },
    },
    schemas: {
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: {
            type: 'object',
            properties: {
              code: { type: 'string', example: 'VALIDATION_ERROR' },
              message: { type: 'string', example: 'Invalid input' },
            },
          },
        },
      },
      SuccessResponse: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'success' },
          data: { type: 'object' },
        },
      },
    },
  },
  security: [
    {
      cookieAuth: [],
    },
  ],
  tags: [
    { name: 'Public', description: 'Publicly accessible endpoints' },
    { name: 'Auth', description: 'Authentication operations' },
    { name: 'Teams', description: 'Team management' },
    { name: 'Submissions', description: 'Project submissions' },
    { name: 'Notifications', description: 'User notifications' },
    { name: 'Feedback', description: 'Judge feedback' },
    { name: 'Judge', description: 'Judge actions' },
    { name: 'Admin', description: 'Administrative operations' },
  ],
  paths: {
    // HEALTH
    '/health': {
      get: { tags: ['Public'], summary: 'Check API Health', responses: { 200: { description: 'API is healthy' } } },
    },
    // PUBLIC
    '/public/edition': {
      get: { tags: ['Public'], summary: 'Get current edition details', responses: { 200: { description: 'Success' } } },
    },
    '/public/teams': {
      get: { tags: ['Public'], summary: 'List public teams', responses: { 200: { description: 'Success' } } },
    },
    '/public/submissions': {
      get: { tags: ['Public'], summary: 'List public submissions', responses: { 200: { description: 'Success' } } },
    },
    '/public/content/sponsors': {
      get: { tags: ['Public'], summary: 'List sponsors', responses: { 200: { description: 'Success' } } },
    },
    '/public/content/partners': {
      get: { tags: ['Public'], summary: 'List partners', responses: { 200: { description: 'Success' } } },
    },
    '/public/content/faqs': {
      get: { tags: ['Public'], summary: 'List FAQs', responses: { 200: { description: 'Success' } } },
    },
    // AUTH
    '/auth/login': {
      post: { tags: ['Auth'], summary: 'Login user', security: [], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { email: { type: 'string' }, password: { type: 'string' } } } } } }, responses: { 200: { description: 'Success' } } },
    },
    '/auth/register': {
      post: { tags: ['Auth'], summary: 'Register a new student', security: [], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { name: { type: 'string' }, email: { type: 'string' }, password: { type: 'string' }, matricNumber: { type: 'string' }, department: { type: 'string' }, level: { type: 'number' } } } } } }, responses: { 201: { description: 'Success' } } },
    },
    '/auth/refresh': {
      post: { tags: ['Auth'], summary: 'Refresh access token', responses: { 200: { description: 'Success' } } },
    },
    '/auth/logout': {
      post: { tags: ['Auth'], summary: 'Logout user', responses: { 200: { description: 'Success' } } },
    },
    // TEAMS
    '/teams': {
      get: { tags: ['Teams'], summary: 'Get current user team', responses: { 200: { description: 'Success' } } },
      post: { tags: ['Teams'], summary: 'Create a new team', requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { name: { type: 'string' } } } } } }, responses: { 201: { description: 'Success' } } },
    },
    '/teams/invites': {
      get: { tags: ['Teams'], summary: 'List team invites', responses: { 200: { description: 'Success' } } },
      post: { tags: ['Teams'], summary: 'Invite user to team', requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { email: { type: 'string' } } } } } }, responses: { 200: { description: 'Success' } } },
    },
    '/teams/invites/{inviteId}/accept': {
      post: { tags: ['Teams'], summary: 'Accept invite', parameters: [{ name: 'inviteId', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Success' } } },
    },
    '/teams/invites/{inviteId}/reject': {
      post: { tags: ['Teams'], summary: 'Reject invite', parameters: [{ name: 'inviteId', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Success' } } },
    },
    '/teams/leave': {
      post: { tags: ['Teams'], summary: 'Leave team', responses: { 200: { description: 'Success' } } },
    },
    '/teams/remove': {
      post: { tags: ['Teams'], summary: 'Remove user from team', requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { userId: { type: 'string' } } } } } }, responses: { 200: { description: 'Success' } } },
    },
    '/teams/submit': {
      post: { tags: ['Teams'], summary: 'Submit project', requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { stage: { type: 'number' }, videoLink: { type: 'string' } } } } } }, responses: { 200: { description: 'Success' } } },
    },
    // SUBMISSIONS
    '/submissions': {
      get: { tags: ['Submissions'], summary: 'List submissions', responses: { 200: { description: 'Success' } } },
      post: { tags: ['Submissions'], summary: 'Create submission', responses: { 201: { description: 'Success' } } },
    },
    // NOTIFICATIONS
    '/notifications': {
      get: { tags: ['Notifications'], summary: 'List notifications', responses: { 200: { description: 'Success' } } },
    },
    '/notifications/read': {
      post: { tags: ['Notifications'], summary: 'Mark notification as read', requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { notificationId: { type: 'string' } } } } } }, responses: { 200: { description: 'Success' } } },
    },
    '/notifications/read-all': {
      post: { tags: ['Notifications'], summary: 'Mark all as read', responses: { 200: { description: 'Success' } } },
    },
    // FEEDBACK
    '/feedback': {
      get: { tags: ['Feedback'], summary: 'Get feedback for team submissions', responses: { 200: { description: 'Success' } } },
    },
    // JUDGE
    '/judge/me': {
      get: { tags: ['Judge'], summary: 'Get judge profile', responses: { 200: { description: 'Success' } } },
    },
    '/judge/submissions': {
      get: { tags: ['Judge'], summary: 'List assigned submissions', responses: { 200: { description: 'Success' } } },
    },
    '/judge/stage-1/representative': {
      post: { tags: ['Judge'], summary: 'Pick stage 1 representative', responses: { 200: { description: 'Success' } } },
    },
    '/judge/stage-2/score': {
      post: { tags: ['Judge'], summary: 'Submit stage 2 score', requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { submissionId: { type: 'string' }, innovation: { type: 'number' }, feasibility: { type: 'number' }, impact: { type: 'number' }, presentation: { type: 'number' } } } } } }, responses: { 200: { description: 'Success' } } },
    },
    // ADMIN (CORE)
    '/admin/overview': {
      get: { tags: ['Admin'], summary: 'Get overview metrics', responses: { 200: { description: 'Success' } } },
    },
    '/admin/edition': {
      patch: { tags: ['Admin'], summary: 'Update edition details', responses: { 200: { description: 'Success' } } },
    },
    '/admin/stage': {
      post: { tags: ['Admin'], summary: 'Set active stage', responses: { 200: { description: 'Success' } } },
    },
    '/admin/signup': {
      post: { tags: ['Admin'], summary: 'Toggle signup', responses: { 200: { description: 'Success' } } },
    },
    '/admin/submission-window': {
      post: { tags: ['Admin'], summary: 'Toggle submission window', responses: { 200: { description: 'Success' } } },
    },
    '/admin/team-lock': {
      post: { tags: ['Admin'], summary: 'Toggle team lock', responses: { 200: { description: 'Success' } } },
    },
    '/admin/users': {
      get: { tags: ['Admin'], summary: 'List users', responses: { 200: { description: 'Success' } } },
    },
    '/admin/verification-queue': {
      get: { tags: ['Admin'], summary: 'List verification queue', responses: { 200: { description: 'Success' } } },
    },
    '/admin/checkpoints': {
      get: { tags: ['Admin'], summary: 'List checkpoints', responses: { 200: { description: 'Success' } } },
      post: { tags: ['Admin'], summary: 'Create checkpoint', responses: { 201: { description: 'Success' } } },
    },
    '/admin/checkpoints/{checkpointId}': {
      patch: { tags: ['Admin'], summary: 'Update checkpoint', parameters: [{ name: 'checkpointId', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Success' } } },
      delete: { tags: ['Admin'], summary: 'Delete checkpoint', parameters: [{ name: 'checkpointId', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Success' } } },
    },
    '/admin/teams': {
      get: { tags: ['Admin'], summary: 'List teams', responses: { 200: { description: 'Success' } } },
    },
    '/admin/submissions': {
      get: { tags: ['Admin'], summary: 'List submissions', responses: { 200: { description: 'Success' } } },
    },
    '/admin/judges': {
      get: { tags: ['Admin'], summary: 'List judges', responses: { 200: { description: 'Success' } } },
      post: { tags: ['Admin'], summary: 'Create judge', responses: { 201: { description: 'Success' } } },
    },
    '/admin/judges/{judgeId}/deactivate': {
      post: { tags: ['Admin'], summary: 'Deactivate judge', parameters: [{ name: 'judgeId', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Success' } } },
    },
    '/admin/users/{userId}/verification': {
      post: { tags: ['Admin'], summary: 'Verify user', parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Success' } } },
    },
    '/admin/users/{userId}/suspend': {
      post: { tags: ['Admin'], summary: 'Suspend user', parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Success' } } },
    },
    '/admin/users/{userId}/unsuspend': {
      post: { tags: ['Admin'], summary: 'Unsuspend user', parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Success' } } },
    },
    '/admin/teams/{teamId}/action': {
      post: { tags: ['Admin'], summary: 'Apply team action', parameters: [{ name: 'teamId', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Success' } } },
    },
    '/admin/tokens': {
      get: { tags: ['Admin'], summary: 'List tokens', responses: { 200: { description: 'Success' } } },
    },
    '/admin/tokens/generate': {
      post: { tags: ['Admin'], summary: 'Generate department token', responses: { 201: { description: 'Success' } } },
    },
    '/admin/tokens/regenerate': {
      post: { tags: ['Admin'], summary: 'Regenerate token', responses: { 200: { description: 'Success' } } },
    },
    '/admin/export/students': {
      get: { tags: ['Admin'], summary: 'Export students', responses: { 200: { description: 'CSV file' } } },
    },
    '/admin/export/teams': {
      get: { tags: ['Admin'], summary: 'Export teams', responses: { 200: { description: 'CSV file' } } },
    },
    '/admin/export/submissions': {
      get: { tags: ['Admin'], summary: 'Export submissions', responses: { 200: { description: 'CSV file' } } },
    },
    '/admin/export/scores': {
      get: { tags: ['Admin'], summary: 'Export scores', responses: { 200: { description: 'CSV file' } } },
    },
    '/admin/content/sponsors': {
      get: { tags: ['Admin'], summary: 'List sponsors', responses: { 200: { description: 'Success' } } },
      post: { tags: ['Admin'], summary: 'Create sponsor', responses: { 201: { description: 'Success' } } },
    },
    '/admin/content/sponsors/{sponsorId}': {
      patch: { tags: ['Admin'], summary: 'Update sponsor', parameters: [{ name: 'sponsorId', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Success' } } },
      delete: { tags: ['Admin'], summary: 'Delete sponsor', parameters: [{ name: 'sponsorId', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Success' } } },
    },
    '/admin/content/partners': {
      get: { tags: ['Admin'], summary: 'List partners', responses: { 200: { description: 'Success' } } },
      post: { tags: ['Admin'], summary: 'Create partner', responses: { 201: { description: 'Success' } } },
    },
    '/admin/content/partners/{partnerId}': {
      patch: { tags: ['Admin'], summary: 'Update partner', parameters: [{ name: 'partnerId', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Success' } } },
      delete: { tags: ['Admin'], summary: 'Delete partner', parameters: [{ name: 'partnerId', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Success' } } },
    },
    '/admin/content/faqs': {
      get: { tags: ['Admin'], summary: 'List FAQs', responses: { 200: { description: 'Success' } } },
      post: { tags: ['Admin'], summary: 'Create FAQ', responses: { 201: { description: 'Success' } } },
    },
    '/admin/content/faqs/{faqId}': {
      patch: { tags: ['Admin'], summary: 'Update FAQ', parameters: [{ name: 'faqId', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Success' } } },
      delete: { tags: ['Admin'], summary: 'Delete FAQ', parameters: [{ name: 'faqId', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Success' } } },
    },
    '/admin/feedback/{submissionId}': {
      post: { tags: ['Admin'], summary: 'Enter feedback for submission', parameters: [{ name: 'submissionId', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Success' } } },
    },
    '/admin/feedback/publish': {
      post: { tags: ['Admin'], summary: 'Publish feedback', responses: { 200: { description: 'Success' } } },
    },
  },
};
