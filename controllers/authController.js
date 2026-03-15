const authService = require('../services/authService');

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await authService.authenticateUser(username, password);
        
        if (user) {
            // Save user to session
            req.session.user = { id: user.id, username: user.username, role: user.role };
            res.json({ message: "Login successful", user: req.session.user });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: "Could not log out" });
        }
        res.json({ message: "Logout successful" });
    });
};
