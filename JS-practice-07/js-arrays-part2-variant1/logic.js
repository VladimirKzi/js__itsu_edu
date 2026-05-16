class SortStats {
    constructor() {
        this.comparisons = 0;
        this.swaps = 0;
        this.startTime = 0;
        this.endTime = 0;
    }
    start() { this.startTime = performance.now(); }
    stop() { this.endTime = performance.now(); }
    get duration() { return (this.endTime - this.startTime).toFixed(3); }
}

// 1. Сортування бульбашкою
export function bubbleSort(arr) {
    const stats = new SortStats();
    let data = [...arr];
    stats.start();
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data.length - 1 - i; j++) {
            stats.comparisons++;
            if (data[j] > data[j + 1]) {
                [data[j], data[j + 1]] = [data[j + 1], data[j]];
                stats.swaps++;
            }
        }
    }
    stats.stop();
    return stats;
}

// 2. Сортування вибором
export function selectionSort(arr) {
    const stats = new SortStats();
    let data = [...arr];
    stats.start();
    for (let i = 0; i < data.length; i++) {
        let minIdx = i;
        for (let j = i + 1; j < data.length; j++) {
            stats.comparisons++;
            if (data[j] < data[minIdx]) minIdx = j;
        }
        if (minIdx !== i) {
            [data[i], data[minIdx]] = [data[minIdx], data[i]];
            stats.swaps++;
        }
    }
    stats.stop();
    return stats;
}

// 3. Сортування вставками
export function insertionSort(arr) {
    const stats = new SortStats();
    let data = [...arr];
    stats.start();
    for (let i = 1; i < data.length; i++) {
        let key = data[i];
        let j = i - 1;
        while (j >= 0 && data[j] > key) {
            stats.comparisons++;
            data[j + 1] = data[j];
            stats.swaps++;
            j--;
        }
        if (j >= 0) stats.comparisons++; // враховуємо порівняння, яке зламало цикл
        data[j + 1] = key;
    }
    stats.stop();
    return stats;
}

// 4. Сортування злиттям (Merge Sort)
export function mergeSort(arr) {
    const stats = new SortStats();
    stats.start();

    function merge(left, right) {
        let result = [], l = 0, r = 0;
        while (l < left.length && r < right.length) {
            stats.comparisons++;
            if (left[l] < right[r]) {
                result.push(left[l++]);
            } else {
                result.push(right[r++]);
                stats.swaps++; // умовне переміщення елемента
            }
        }
        return result.concat(left.slice(l)).concat(right.slice(r));
    }

    function sort(m) {
        if (m.length <= 1) return m;
        const middle = Math.floor(m.length / 2);
        return merge(sort(m.slice(0, middle)), sort(m.slice(middle)));
    }

    sort([...arr]);
    stats.stop();
    return stats;
}

// 5. Швидке сортування (Quick Sort)
export function quickSort(arr) {
    const stats = new SortStats();
    stats.start();

    function sort(data) {
        if (data.length <= 1) return data;
        let pivot = data[0];
        let left = [], right = [];
        for (let i = 1; i < data.length; i++) {
            stats.comparisons++;
            if (data[i] < pivot) {
                left.push(data[i]);
                stats.swaps++;
            } else {
                right.push(data[i]);
            }
        }
        return [...sort(left), pivot, ...sort(right)];
    }

    sort([...arr]);
    stats.stop();
    return stats;
}