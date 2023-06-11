const { exec } = require('node:child_process');

// const migrate = (arg) => {
//     const filename = arg[2];

//     exec("npx typeorm-ts-node-esm migration:generate -d ./src/data-source.ts ./src/database/migration/" + filename, (err, output) => {
//         console.log(err, output)
//     })
// }
const migrate = (arg) => {
  const filename = arg[2];
  console.log(arg);
  console.log(filename);
  const command = `npx typeorm-ts-node-esm migration:generate ./src/infrastructure/persistence/typeorm/migration/${filename} -d ./src/data-source.ts`;
  exec(
    // `npx typeorm-ts-node-esm migration:generate  ./src/database/migration/${filename}  -d ./src/data-source.ts`,
    command,
    (err, output) => {
      console.log(err, output);
    },
  );
};

migrate(process.argv);
