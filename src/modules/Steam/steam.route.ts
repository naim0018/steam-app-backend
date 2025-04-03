import { Router } from "express";
import { SteamController } from "./steam.controller";

const router = Router();

// Get all games with pagination
router.get('/', SteamController.getSteamGames);

// Add search endpoint
router.get('/search', SteamController.searchSteamGames);

// Get game details by appId
router.get('/:appId', SteamController.getSteamGameDetails);

export default router;
