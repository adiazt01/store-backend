import {app} from './app.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server ready at: http://localhost:${PORT}`);
  console.log(`💻 The database url is: ${process.env.DATABASE_URL}`);
});
