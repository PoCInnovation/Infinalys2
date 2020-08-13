module.exports = {
  "extends": "airbnb",
  "env": {
    "node": true,
    "es6": true,
    "browser": true
  },
  "parser": "babel-eslint",
  "rules": {
    "no-console": process.env.NODE_ENV === "production" ? "dev" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "dev" : "off",
    "react/prop-types": 0,
    "react/destructuring-assignment": 0,
    "react/jsx-filename-extension": [
      1,
      {
        "extensions": [
          ".js",
          ".jsx"
        ]
      }
    ]
  }
}

