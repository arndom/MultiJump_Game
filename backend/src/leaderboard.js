import Database from '@withkoji/database';
import uuid from 'uuid';
import md5 from 'md5';

export default function(app) {
  app.get('/leaderboard', async (req, res) => {
    const database = new Database();
    const rawScores = await database.get('leaderboard');

    // We don't want to return private attributes to consumers of this
    // endpoint, so strip them out, sort the records so the top scores
    // appear first, and then only return the top 100 scores
    const scores = rawScores
      .map(({ name, score, dateCreated }) => ({
        name,
        score,
        dateCreated
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 100);

    res.status(200).json({
      success: true,
      scores
    });
  });

  app.post('/leaderboard/save', async (req, res) => {
    const hash = md5(JSON.stringify(req.body));
    if (hash !== req.headers.authorization) {
      res.status(200).json({
        success: true
      });
      return;
    }

    const { privateAttributes = {} } = req.body;
    const recordBody = {
        name: req.body.name,
        score: req.body.score,
        dateCreated: Math.round(Date.now() / 1000),
        email: req.body.email,
        emailOptIn: req.body.emailOptIn,
        phone: req.body.phone,
    };

    const recordId = uuid.v4();
    const database = new Database();
    await database.set('leaderboard', recordId, recordBody);

    res.status(200).json({
      success: true
    });
  });
}
