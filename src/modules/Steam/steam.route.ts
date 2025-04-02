import { Router } from "express";
import { SteamController } from "./steam.controller";

const router = Router();

// Get all games with pagination and search
router.get('/', SteamController.getSteamGames);

// Get details for a specific game
router.get('/:appId', SteamController.getSteamGameDetails);

export const SteamRoute = router;
