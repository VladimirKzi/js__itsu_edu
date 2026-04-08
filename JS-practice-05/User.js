import { isValidEmail } from './validators.js';

/**
 * @param {Object} data
 * @param {string} data.id
 * @param {string} data.name
 * @param {string} data.email
 * @param {string} data.role
 */
export function createUserObject({ id, name, email, role }) {
    if (!isValidEmail(email)) {
        throw new Error(`Invalid email: ${email}`);
    }

    return {
        id,
        name,
        email,
        role,
        createdAt: new Date().toISOString(),

        /**
         * @returns {string}
         */
        getInfo() {
            return `[${this.role}] ${this.name} (${this.email})`;
        },

        /**
         * @returns {boolean}
         */
        isAdmin() {
            return this.role.toLowerCase() === 'admin';
        },

        /**
         * @param {Object} newData 
         * @returns {Object} Новий об'єкт користувача
         */
        updateProfile(newData) {
            return { ...this, ...newData, id: this.id };
        }
    };
}