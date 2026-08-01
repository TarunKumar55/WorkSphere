export const protect = async (req, res, next) => {
  try {
    const auth = req.auth({ treatPendingAsSignedOut: false });

    if (!auth.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    return next();
  } catch (error) {
    res.status(401).json({ message: error.code || error.message });
  }
};
