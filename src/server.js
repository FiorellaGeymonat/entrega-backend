import 'dotenv/config';
import app from './app.js';
import { connectDB } from './db/index.js';

const PORT = process.env.PORT || 8080;

(async () => {
  try {
    await connectDB();
    app.listen(PORT, () =>
      console.log(`✅ Server ready on http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error('❌ Startup error:', err);
    process.exit(1);
  }
})();
