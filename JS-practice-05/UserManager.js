import { createUserObject } from './User.js';

export const createUserManager = () => {
    let users = [];
    let currentId = 1;

    return {
        /**
         * @param {Object} userData 
         */
        createUser(userData) {
            const newUser = createUserObject({
                ...userData,
                id: (currentId++).toString()
            });
            users = [...users, newUser];
            return newUser;
        },

        getUser(id) {
            const user = users.find(u => u.id === id.toString());
            return user ? { ...user } : null;
        },

        updateUser(id, data) {
            users = users.map(u => 
                u.id === id.toString() ? u.updateProfile(data) : u
            );
            return this.getUser(id);
        },

        deleteUser(id) {
            users = users.filter(u => u.id !== id.toString());
            return true;
        },

        getAllUsers() {
            return [...users];
        },

        getUsersByRole(role) {
            return users.filter(u => u.role.toLowerCase() === role.toLowerCase());
        }
    };
};