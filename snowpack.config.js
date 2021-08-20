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
    '@snowpack/plugin-webpack', // creates js directory in snowpack output build directory, use webpack to bundle for production
    // ['@snowpack/plugin-webpack',
    //   {
    //     sourceMap: true, // creates sourceMap instead of typescript compiler
    //   },
    // ],
    '@snowpack/plugin-typescript', // TS support
    '@snowpack/plugin-postcss', // postcss support
    'snowpack-plugin-svgr', // import SVG as React component
    'snowpack-plugin-relative-css-urls', //allows @font-face url reference for new fonts
    '@snowpack/plugin-babel', //plugin used in this project specifically for twin.macro
  ],
  /* for local SPA fallback routing support, more below */
  routes: [
    {"match": "routes", "src": ".*", "dest": "/index.html"},
  ],
  testOptions: {
    files: ['src/**/*.test.*']
  },
  alias: {
    "@app": "./src/",  /* optional, if you want to use alias when importing */
  },
  packageOptions: {
    polyfillNode: true, // allows modules dependent on nodejs built-in modules to work in the browser such as 'fs', 'path', 'url, etc
    knownEntrypoints: ['styled-components'], // specific for twin.macro
  },
}