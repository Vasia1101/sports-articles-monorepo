import next from "eslint-config-next";

export default [
  ...next,
  {
    rules: {
      "react-hooks/exhaustive-deps": "warn"
    }
  }
];
