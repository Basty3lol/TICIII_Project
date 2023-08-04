import {Router} from 'express';
import * as statsCtrl from '../controllers/stats.controller';

const statsRoutes = Router();

statsRoutes.get('/getTypes', statsCtrl.getTypes);
statsRoutes.get('/getCitasFreq', statsCtrl.getCitasFreq);
statsRoutes.get('/getYears', statsCtrl.getYears);
statsRoutes.get('/getCitasCounter', statsCtrl.getCitasCounter);

export default statsRoutes;