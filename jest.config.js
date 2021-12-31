module.exports = {
    testEnvironment: 'node',
    testEnvironmentOptions: {
        NODE_ENV: 'test',
    },
    restoreMocks: true,
    coveragePathIgnorePatterns: ['node_modules', 'src/config', 'tests'],
    coverageReporters: ['text', 'lcov', 'clover', 'html'],
};
