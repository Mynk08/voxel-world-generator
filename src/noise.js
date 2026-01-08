// Perlin noise implementation
class PerlinNoise {
    constructor(seed = 0) {
        this.seed = seed;
        this.permutation = this.generatePermutation();
    }

    generatePermutation() {
        const p = [];
        for (let i = 0; i < 256; i++) p[i] = i;

        // Fisher-Yates shuffle
        for (let i = 255; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [p[i], p[j]] = [p[j], p[i]];
        }

        return p.concat(p); // Duplicate for overflow
    }

    fade(t) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }

    lerp(t, a, b) {
        return a + t * (b - a);
    }

    grad(hash, x, y) {
        const h = hash & 3;
        const u = h < 2 ? x : y;
        const v = h < 2 ? y : x;
        return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
    }

    noise(x, y) {
        const X = Math.floor(x) & 255;
        const Y = Math.floor(y) & 255;

        x -= Math.floor(x);
        y -= Math.floor(y);

        const u = this.fade(x);
        const v = this.fade(y);

        const p = this.permutation;
        const aa = p[p[X] + Y];
        const ab = p[p[X] + Y + 1];
        const ba = p[p[X + 1] + Y];
        const bb = p[p[X + 1] + Y + 1];

        return this.lerp(v,
            this.lerp(u, this.grad(aa, x, y), this.grad(ba, x - 1, y)),
            this.lerp(u, this.grad(ab, x, y - 1), this.grad(bb, x - 1, y - 1))
        );
    }
}

module.exports = PerlinNoise;
