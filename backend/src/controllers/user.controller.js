
class UserController {

    async getMe(req, res) {
        try {
            const user = req.user;
            console.log(user);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            return res.status(200).json({ user });
        } catch (error) {
            console.error("Error fetching user:", error);
            return res.status(500).json({ message: "Failed to fetch user", error });
        }
    }

}

export default new UserController();
