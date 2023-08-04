import {Router} from 'express';
import * as calendarCtrl from '../controllers/calendar.controller';
import {verifyToken} from '../middlewares'

const router = Router();

router.post('/', calendarCtrl.getCalendar)
router.post('/createCita', calendarCtrl.createCita)
router.get('/getCitas', calendarCtrl.getCitas)
router.post('/getCitasByRutClient', verifyToken, calendarCtrl.getCitasByRutClient)
router.get('/getCitasByCode', calendarCtrl.getCitasByCode)
router.post('/getCitasByDay', verifyToken,calendarCtrl.getCitasByDay)
router.post('/getCitasByWeek', verifyToken,calendarCtrl.getCitasByWeek)
router.post('/getProfesional', calendarCtrl.getProfesional)
router.post('/getHours', calendarCtrl.getHours)
router.post('/updateCitaState', verifyToken, calendarCtrl.updateCitaState)
router.post('/getPaciente', calendarCtrl.getPaciente)

export default router;