import Database from '@withkoji/database';
import uuid from 'uuid';
import md5 from 'md5';
import Koji from '@withkoji/vcc';

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
    console.log('h', hash);
    console.log('r', req.headers.authorization);
    if (hash !== req.headers.authorization) {
      res.status(200).json({
        success: true
      });
      return;
    }

    const recordBody = {
        name: req.body.name,
        score: req.body.score,
        dateCreated: Math.round(Date.now() / 1000),
        email: req.body.email,
        emailOptIn: req.body.emailOptIn,
        phone: req.body.phone,
    };

    console.log('r', recordBody);

    const recordId = uuid.v4();
    const database = new Database();
    const promises = [];

    promises.push(async () => {
        await database.set('leaderboard', recordId, recordBody);
    });

    if (Koji.config.postGameScreen.leaderboardWebhookURL) {
        promises.push(async () => {
            await fetch(Koji.config.postGameScreen.leaderboardWebhookURL, {
                method: 'POST',
                body: JSON.stringify(recordBody),
            });
        });
    }
    
    // Run in parallel
    await Promise.all(promises);
    
    res.status(200).json({
      success: true
    });
  });
}
