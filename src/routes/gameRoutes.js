const {
    createGame,
    getAllGames,
    updateGame,
    deleteGame,
    getGameById
}=require('../controllers/gameController');
const express=require('express');
const router=express.Router();
const authenticate=require('../middleware/authMiddleware').authMiddleware;
router.use(authenticate);
const adminMiddleware=require('../middleware/adminMiddleware').adminMiddleware;



router.post('/',adminMiddleware,createGame);
router.get('/',getAllGames);
router.put('/:gameId',adminMiddleware,updateGame);
router.delete('/:gameId',adminMiddleware,deleteGame);
router.get('/:gameId',getGameById);

module.exports=router;