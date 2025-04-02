import { Router } from "express";
import { SteamRoute } from "../../modules/Steam/steam.route";

const router = Router();

const moduleRoute = [
    {
        path:'/steam',
        route: SteamRoute
    }
];

moduleRoute.forEach((route) => router.use(route.path, route.route));

export default router;