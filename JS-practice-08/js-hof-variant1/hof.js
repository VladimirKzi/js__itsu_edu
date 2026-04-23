/**
 * Варіант 1
 */

export const myMap = (array, callback) => {
    const result = [];
    for (let i = 0; i < array.length; i++) {
        result.push(callback(array[i], i, array));
    }
    return result;
};

export const myFilter = (array, callback) => {
    const result = [];
    for (let i = 0; i < array.length; i++) {
        if (callback(array[i], i, array)) {
            result.push(array[i]);
        }
    }
    return result;
};

export const myReduce = (array, callback, initialValue) => {
    let accumulator = initialValue !== undefined ? initialValue : array[0];
    let startIndex = initialValue !== undefined ? 0 : 1;
    
    for (let i = startIndex; i < array.length; i++) {
        accumulator = callback(accumulator, array[i], i, array);
    }
    return accumulator;
};

export const compose = (...fns) => (x) => fns.reduceRight((acc, fn) => fn(acc), x);

export const pipe = (...fns) => (x) => fns.reduce((acc, fn) => fn(acc), x);

export const curry = (fn) => {
    return function curried(...args) {
        if (args.length >= fn.length) {
            return fn.apply(this, args);
        } else {
            return (...nextArgs) => curried.apply(this, args.concat(nextArgs));
        }
    };
};

export const partial = (fn, ...presetArgs) => {
    return (...laterArgs) => fn(...presetArgs, ...laterArgs);
};

export const memoize = (fn) => {
    const cache = new Map();
    return (...args) => {
        const key = JSON.stringify(args);
        if (cache.has(key)) return cache.get(key);
        
        const result = fn(...args);
        cache.set(key, result);
        return result;
    };
};

export const chain = (data) => {
    return {
        value: () => data,
        map: (callback) => chain(myMap(data, callback)),
        filter: (callback) => chain(myFilter(data, callback)),
        reduce: (callback, initial) => myReduce(data, callback, initial)
    };
};