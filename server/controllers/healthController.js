const getHealthStatus = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Academic Intelligence Platform API is healthy",
  });
};

module.exports = { getHealthStatus };