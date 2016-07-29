import { WeatherCriteria } from '../model';
import { sendNotificationEmail } from '../lib/send-email';


const notificateUsers = async (fulfilledCriteria, reports) => {
  if (!fulfilledCriteria || fulfilledCriteria.length === 0) {
    return;
  }
  const criteria = await WeatherCriteria.populate(fulfilledCriteria, 'city user');
  const criteriaReportPairs = criteria.filter(criterion => criterion.user.getNotificationEmails())
    .map(criterion =>
      [criterion, reports.find(report => criterion.city.id === report.city.toString())]);
  await Promise.all(criteriaReportPairs
    .map(pair => sendNotificationEmail(pair[0], pair[1])));
};


export default { notificateUsers };
