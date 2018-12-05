exports.getEndpoints = (req, res, next) => {
  const URLS = {
    'http://localhost:9090/api': 'Serves JSON describing all the available endpoints on the API',
    'http://localhost:9090/api/topics': 'GET  - responds with an array of topic objects - each object should have a slug and description property. POST - accepts an object containing slug and description property, the slug must be unique responds with the posted topic object',
    'http://localhost:9090/api/topics/:topic/articles{?limit,sort_by,p,sort_ascending}': 'GET - responds with an array of article objects for a given topic. POST - accepts an object containing a title , body and a user_id property responds with the posted article',
    'http://localhost:9090/api/articles{?limit,sort_by,p,sort_ascending}': 'GET - responds with an array of article objects',
    'http://localhost:9090/api/articles/:article_id': 'GET - responds with an article object. PATCH - accepts an object in the form { inc_votes: newVote } where newVote will indicate how much the votes property in the database should be updated. DELETE - should delete the given article by article_id should respond with an empty object',
    'http://localhost:9090/api/articles/:article_id/comments{?limit,sort_by,p,sort_ascending}': 'GET - responds with an array of comments for the given article_id. POST - accepts an object with a user_id and body responds with the posted comment',
    'http://localhost:9090/api/articles/:article_id/comments/:comment_id': 'PATCH - accepts an object in the form { inc_votes: newVote } where newVote will indicate how much the votes property in the database should be updated by. DELETE - should delete the given comment by comment_id should respond with an empty object',
    'http://localhost:9090/api/users': 'GET - should respond with an array of user objects',
    'http://localhost:9090/api/users/:user_id': 'GET - should respond with a user object',
  };
  res.status(200).json(URLS);
};
