import City from '../model/city';
import constants from '../constants';

export default router => {
  router.get('/city/:id', async ctx => {
    const id = Number(ctx.params.id);
    let city;
    if (Number.isInteger(id)) {
      city = await City.findById(ctx.params.id);
    }
    if (city) {
      ctx.body = city;
    } else {
      ctx.throw(constants.notFound, 404);
    }
  });
  router.get('/city/name/:name', async ctx => {
    let limit = constants.listLimit;
    const reqLimit = Number(ctx.request.query.limit);
    if (Number.isInteger(reqLimit) && reqLimit < limit) {
      limit = reqLimit;
    }
    const cityNameLC = ctx.params.name.toLowerCase();
    // hack to check if theres more
    const cities = await City.find({
      nameLC: {
        $regex: `^${cityNameLC}`,
        $options: '',
      },
    }).limit(limit + 1);
    let truncated = false;
    if (cities.length > limit) {
      cities.length = limit;
      truncated = true;
    }
    const count = cities.length;
    ctx.body = {
      truncated,
      count,
      cities,
    };
  });
  router.get('/city/location/:coordinates', async ctx => {
    const coords = ctx.params.coordinates.split(',').map(Number);
    if (coords.length !== 2) {
      ctx.throw(constants.malformedQuery, 400);
    }
    ctx.body = await City.findOne({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [coords[0], coords[1]],
          },
        },
      },
    });
  });
};
