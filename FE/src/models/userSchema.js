/**
 * User class
 * @class User
 */
class User {

    /**
     * @param {string} user_id - The user_id
     * @param {string} username - The username
     * @param {string} password - The password
     * @param {string} email - The email
     */
    constructor(user_id, username, password, email, profile_picture) {
        this.user_id = user_id;
        this.username = username;
        this.password = password;
        this.email = email;
        this.profile_picture = profile_picture;
    }
}

module.exports = User;