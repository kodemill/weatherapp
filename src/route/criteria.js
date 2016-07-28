import WeatherCriteriaController from '../controller/weather-criteria';

export default router => {
  router.put('/criteria/city/:cityId/temperature/:temperature/predicate/:predicate', async ctx => {
    try {
      ctx.body = await WeatherCriteriaController.saveCriteria({
        ...ctx.params,
        user: ctx.user,
      });
    } catch (err) {
      if (err.existingCriteria) {
        ctx.body = { existingCriteria: err.existingCriteria };
      } else {
        throw err;
      }
    }
  });
  router.post('/criteria/city/:cityId/temperature/:temperature/predicate/:predicate', async ctx => {
    ctx.body = await WeatherCriteriaController.saveCriteria({
      ...ctx.params,
      user: ctx.user,
    }, true);
  });
  router.get('/criteria', async ctx => {
    ctx.body = await WeatherCriteriaController.getAllForUser(ctx.user);
  });
  router.del('/criteria/:criteriaId', async ctx => {
    await WeatherCriteriaController.deleteForUser(ctx.user, ctx.params.criteriaId);
    ctx.body = { message: 'criteria delete success' };
  });
  router.get('/criteria/updatedafter/:date', async ctx => {
    ctx.body = await WeatherCriteriaController
      .getAllUpdatedAfterForUser(ctx.user, ctx.params.date);
  });
  router.get('/criteria/fulfilled', async ctx => {
    ctx.body = await WeatherCriteriaController.getAllFulfilledForUser(ctx.user);
  });
  router.get('/criteria/pending', async ctx => {
    ctx.body = await WeatherCriteriaController.getAllPendingForUser(ctx.user);
  });
  router.get('/criteria/fulfilled/notacknoweledged', async ctx => {
    ctx.body = await WeatherCriteriaController
      .getAllFulfilledNotAcknoweledgedForUser(ctx.user);
  });
  const acknoweledgeCriteria = async ctx => {
    ctx.body = await WeatherCriteriaController
      .acknoweledgeAllForUser(ctx.user, ctx.params.criteriaIds.split(','));
  };
  router.post('/criteria/acknoweledge/:criteriaIds', acknoweledgeCriteria);
  router.get('/criteria/acknoweledge/:criteriaIds', acknoweledgeCriteria);
};
