export class DataFactory {

    static createNewUser() {
        const timestamp = Date.now();

        const userData = {
            firstName: "Test",
            lastName: "User",
            email: `testuser_${timestamp}@example.com`,
            password: "Password123!"
        };

        return userData;
    }
}