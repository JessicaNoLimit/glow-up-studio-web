const asyncHandler = require('../utils/asyncHandler');
const ServicesService = require('../services/servicesService');
const ClientsService = require('../services/clientsService');
const AppointmentsService = require('../services/appointmentsService');

const getDashboard = asyncHandler(async (req, res) => {
  // Fetch all dashboard stats in parallel
  const [servicesCount, clientsCount, appointmentsCount, todayCount, upcomingAppointments] = await Promise.all([
    ServicesService.getCategories().then(categories => categories.length),
    ClientsService.getTotalCount(),
    AppointmentsService.getTotalCount(),
    AppointmentsService.getTodayCount(),
    AppointmentsService.getUpcomingAppointments(5)
  ]);

  res.status(200).json({
    message: 'Admin dashboard access granted',
    adminUser: req.adminUser,
    stats: {
      servicesCount,
      clientsCount,
      appointmentsCount,
      todayCount,
      upcomingAppointments: upcomingAppointments.length
    },
    upcomingAppointments
  });
});

module.exports = {
  getDashboard,
};
