
import { Application, Context } from 'https://deno.land/x/abc@v1.3.3/mod.ts';
import { cors, DefaultCORSConfig } from 'https://deno.land/x/abc@v1.3.3/middleware/cors.ts';
import { dataGroup } from './routes/data.routes.ts';
import { databaseOpen} from './services/db.services.ts';

const port = 3000;
const app = new Application();

databaseOpen();

app.use(cors(DefaultCORSConfig));

dataGroup(app.group('data'));

app.start({ port: port });
console.log(`server started on port ${port}`);

