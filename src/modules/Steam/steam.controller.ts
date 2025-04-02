import { Request, Response } from "express";
import axios from "axios";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../app/utils/catchAsync";
import sendResponse from "../../app/utils/sendResponse";
import { Game } from "../../app/types/steam.types";

// Cache the games list to avoid repeated API calls
let cachedGames: Game[] | null = null;
let lastCacheTime: number = 0;
const CACHE_DURATION = 3600000; // 1 hour in milliseconds

const getSteamGames = catchAsync(async (req: Request, res: Response) => {
  try {
    // Check if we have a valid cache
    const currentTime = Date.now();
    if (!cachedGames || currentTime - lastCacheTime > CACHE_DURATION) {
      const response = await axios.get("https://api.steampowered.com/ISteamApps/GetAppList/v2/");
      console.log(response.data.applist.apps)
      // Skip the first 38 games as they are test entries
      cachedGames = response.data.applist.apps.slice(38);
      lastCacheTime = currentTime;
    }
    
    // Simple pagination without search or sort
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 24;

    // Add null check before accessing cachedGames
    if (!cachedGames) {
      return sendResponse(res, {
        statusCode: StatusCodes.NOT_FOUND,
        success: false,
        message: "Games data not available",
        data: null
      });
    }

    const startIndex = (page - 1) * limit;
    const endIndex = Math.min(startIndex + limit, cachedGames.length);
    
    const paginatedGames = cachedGames.slice(startIndex, endIndex);
    const totalGames = cachedGames.length;
    const totalPages = Math.ceil(totalGames / limit);
    
    // Fetch basic details for each game in the paginated results
    const gamesWithDetails = await Promise.all(
      paginatedGames.map(async (game) => {
        try {
          // Get all details for each game
          const detailsResponse = await axios.get(
            `https://store.steampowered.com/api/appdetails?appids=${game.appid}`
          );
          
          // If details are available, add them to the game object
          if (detailsResponse.data[game.appid] && detailsResponse.data[game.appid].success) {
            const gameDetails = detailsResponse.data[game.appid].data;
            return {
              appid: game.appid,
              name: gameDetails.name,
              header_image: gameDetails.header_image,
              background: gameDetails.background,
              capsule_imagev5: gameDetails.capsule_imagev5,
              capsule_image: gameDetails.capsule_image,
              background_raw: gameDetails.background_raw,
              categories: gameDetails.categories,
              developers: gameDetails.developers,
              genres: gameDetails.genres,
              is_free: gameDetails.is_free,
              movies: gameDetails.movies,
              platforms: gameDetails.platforms,
              price_overview: gameDetails.price_overview,
              publishers: gameDetails.publishers,
              release_date: gameDetails.release_date,
              short_description: gameDetails.short_description,
              screenshots: gameDetails.screenshots
            };
          }
          return game;
        } catch (error) {
          // If there's an error fetching details, return the original game object
          return game;
        }
      })
    );
    
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Steam games retrieved successfully",
      data: gamesWithDetails,
      meta: {
        page,
        limit,
        totalGames,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      message: "Failed to retrieve Steam games",
      data: error.message || "Unknown error"
    });
  }
});

// Get details for a specific game by appid
const getSteamGameDetails = catchAsync(async (req: Request, res: Response) => {
  const { appId } = req.params;
  
  try {
    const response = await axios.get(`https://store.steampowered.com/api/appdetails?appids=${appId}`);
    
    if (!response.data[appId] || !response.data[appId].success) {
      return sendResponse(res, {
        statusCode: StatusCodes.NOT_FOUND,
        success: false,
        message: "Game details not found",
        data: null
      });
    }
    
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Game details retrieved successfully",
      data: response.data[appId].data
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      message: "Failed to retrieve game details",
      data: error.message || "Unknown error"
    });
  }
});

export const SteamController = {
  getSteamGames,
  getSteamGameDetails
};
