// Voxel world generation
const PerlinNoise = require('./noise');

class VoxelWorld {
    constructor(seed = 0) {
        this.noise = new PerlinNoise(seed);
        this.chunks = new Map();
    }

    generateChunk(chunkX, chunkY) {
        const CHUNK_SIZE = 16;
        const chunk = [];

        for (let x = 0; x < CHUNK_SIZE; x++) {
            chunk[x] = [];
            for (let z = 0; z < CHUNK_SIZE; z++) {
                const worldX = chunkX * CHUNK_SIZE + x;
                const worldZ = chunkY * CHUNK_SIZE + z;

                const height = this.getHeight(worldX, worldZ);
                chunk[x][z] = {
                    height: height,
                    biome: this.getBiome(worldX, worldZ),
                    blocks: this.generateColumn(height)
                };
            }
        }

        return chunk;
    }

    getHeight(x, z) {
        const scale = 0.01;
        const octaves = 4;
        let height = 0;
        let amplitude = 1;
        let frequency = 1;

        for (let i = 0; i < octaves; i++) {
            height += this.noise.noise(x * scale * frequency, z * scale * frequency) * amplitude;
            amplitude *= 0.5;
            frequency *= 2;
        }

        return Math.floor(height * 32 + 64);
    }

    getBiome(x, z) {
        const temp = this.noise.noise(x * 0.005, z * 0.005);
        const moisture = this.noise.noise(x * 0.005 + 1000, z * 0.005 + 1000);

        if (temp > 0.5) return 'desert';
        if (moisture > 0.5) return 'forest';
        return 'plains';
    }

    generateColumn(height) {
        const blocks = [];
        for (let y = 0; y < height; y++) {
            if (y < height - 4) blocks.push('stone');
            else if (y < height - 1) blocks.push('dirt');
            else blocks.push('grass');
        }
        return blocks;
    }
}

module.exports = VoxelWorld;
