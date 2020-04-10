let users;

export default class UserDAO {
  static async injectDb(client) {
    if (users) return;
    try {
      users = await client.db("miquido_task").collection("users");
    } catch (error) {
      console.error(error);
    }
  }

  static async createUser(userDetails) {
    try {
      const { email, password } = userDetails;
      await users.insertOne({
        email: email,
        password: password,
      });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  static async checkForUser(email) {
    try {
      return await users.findOne({ email: email });
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
