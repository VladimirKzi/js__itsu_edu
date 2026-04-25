export class Vehicle {
    #mileage; // Приватне поле
	#fuelLevel;
    constructor(brand, model, year, mileage = 0, fuelLevel = 100) {
        this.brand = brand;
        this.model = model;
        this.year = Number(year);
        this.#mileage = Number(mileage);
        this.#fuelLevel = Number(fuelLevel);
    }

    get mileage() { return this.#mileage; }
	get fuelLevel() { return this.#fuelLevel; }
	
	drive(distance) {
        const consumption = distance * 0.1;
        if (this.#fuelLevel >= consumption) {
            this.#mileage += distance;
            this.#fuelLevel -= consumption;
            return true;
        }
        return false;
    }

    refuel(amount) {
        this.#fuelLevel = Math.min(100, this.#fuelLevel + amount);
    }

    getMaintenance() {
        const age = new Date().getFullYear() - this.year;
        return (age * 100 + this.#mileage * 0.5);
    }
}

export class Car extends Vehicle {
    constructor(brand, model, year, mileage, doors) {
        super(brand, model, year, mileage);
        this.doors = doors;
        this.type = 'Car';
    }
}

export class Truck extends Vehicle {
    constructor(brand, model, year, mileage, capacity) {
        super(brand, model, year, mileage);
        this.capacity = capacity;
        this.type = 'Truck';
    }
    getMaintenance() { return super.getMaintenance() * 1.5; }
}

export class Motorcycle extends Vehicle {
    constructor(brand, model, year, mileage, style) {
        super(brand, model, year, mileage);
        this.style = style;
        this.type = 'Motorcycle';
    }
    getMaintenance() { return super.getMaintenance() * 0.6; }
}

export class Fleet {
    #vehicles = [];
    add(v) { this.#vehicles.push(v); }
    get all() { return this.#vehicles; }
	getStats() {
        if (this.#vehicles.length === 0) return { total: 0, avgMileage: 0, totalCost: 0 };
		const total = this.#vehicles.length;
        const totalMileage = this.#vehicles.reduce((sum, v) => sum + v.mileage, 0);
        const totalCost = this.#vehicles.reduce((sum, v) => sum + v.getMaintenance(), 0);
        return {
			total: total,
            avgMileage: (totalMileage / this.#vehicles.length).toFixed(1),
            totalCost: totalCost.toFixed(2)
        };
	}
}