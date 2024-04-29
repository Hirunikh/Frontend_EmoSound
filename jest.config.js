module.exports = {
  // Set the test environment to use JSDOM
  testEnvironment: 'jsdom',
  
  // Use Babel for transforming JavaScript and JSX files
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  
  // Map CSS, LESS, SCSS, and SASS files to identity-obj-proxy
  // This allows Jest to handle CSS imports in your tests
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy"
  },
  
  // Ignore transformation for files in node_modules, except for react-loading-skeleton
  // This prevents Jest from attempting to transform certain third-party modules
  transformIgnorePatterns: [
    "/node_modules/(?!react-loading-skeleton)"
  ],

};
