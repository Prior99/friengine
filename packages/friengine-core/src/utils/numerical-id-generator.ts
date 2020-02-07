export function* numericalIdGenerator(): Generator<number> {
    while (true) {
        yield Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
    }
}
