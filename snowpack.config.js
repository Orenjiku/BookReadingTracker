module.exports = {
  mount: {
    public: {url: '/', static: true},
    src: {url: '/dist'} // builds everything from src directory and emits to `${buildOptions.out}/${url}` directory
  },
  devOptions: {
    tailwindConfig: './tailwind.config.js',
    port: 8080 //port dev server runs on, default: 8080
  },
  buildOptions: {
    out: 'build' //specifies directory for emitted files, default is 'build'
  },
  plugins: [
    '@snowpack/plugin-react-refresh', // enables HMR (hot module replacement), allow updates to the browser without page refresh
    '@snowpack/plugin-dotenv', // enables loading of environmental variables from .env files
    // '@snowpack/plugin-webpack', // creates js directory in snowpack output build directory, use webpack to bundle for production
    ['@snowpack/plugin-webpack',
      {
        sourceMap: true, // creates sourceMap instead of typescript compiler
      },
    ],
    '@snowpack/plugin-typescript', // TS support
    '@snowpack/plugin-postcss', // postcss support
    'snowpack-plugin-svgr', // import SVG as React component
    'snowpack-plugin-relative-css-urls',
  ],
  /* for local SPA fallback routing support, more below */
  routes: [
    {"match": "routes", "src": ".*", "dest": "/index.html"},
  ],
  testOptions: {
    files: ['src/**/*.test.*']
  },
  /* optional, if you want to use alias when importing */
  alias: {
    "@app": "./src/",
  },
  packageOptions: {
    polyfillNode: true, // allows modules dependent on nodejs built-in modules to work in the browser such as 'fs', 'path', 'url, etc
  },
}