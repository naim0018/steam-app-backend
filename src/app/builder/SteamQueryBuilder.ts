import { Game } from "../types/steam.types";

class SteamQueryBuilder {
  private games: Game[];
  private filteredGames: Game[];
  private query: Record<string, unknown>;

  constructor(games: Game[], query: Record<string, unknown>) {
    this.games = games;
    this.filteredGames = [...games];
    this.query = query;
  }

  search() {
    const searchTerm = this.query.search as string;
    if (searchTerm && searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      
      this.filteredGames = this.filteredGames.filter((game) => {
        const gameName = game.name.toLowerCase();
        const gameId = game.appid.toString();
        
        // Check if search term is in name
        if (gameName.includes(searchLower)) {
          return true;
        }
        
        // Check if search term is an exact app ID
        if (gameId === searchLower) {
          return true;
        }
        
        // Check if search term might be a category
        // This is a simplified approach since we don't have category data in the basic game list
        // In a real app, you'd check against actual category data
        const possibleCategories = [
          'action', 'adventure', 'strategy', 'rpg', 'simulation', 
          'sports', 'racing', 'indie', 'casual', 'puzzle'
        ];
        
        if (possibleCategories.includes(searchLower) && 
            (gameName.includes(searchLower) || this.gameMatchesCategory(game, searchLower))) {
          return true;
        }
        
        return false;
      });
    }
    return this;
  }
  
  // Helper method to simulate category matching
  // In a real app, this would check against actual category data from the Steam API
  private gameMatchesCategory(game: Game, category: string): boolean {
    // This is a simplified simulation of category matching
    // In a real app, you would check against actual category data
    
    // For demo purposes, we'll use some heuristics based on the game name
    const name = game.name.toLowerCase();
    
    switch(category) {
      case 'action':
        return /\b(action|shooter|fight|combat|battle)\b/.test(name);
      case 'adventure':
        return /\b(adventure|quest|journey|explore)\b/.test(name);
      case 'strategy':
        return /\b(strategy|tactics|command|defense|tower|war)\b/.test(name);
      case 'rpg':
        return /\b(rpg|role|fantasy|dragon|magic|wizard|sword)\b/.test(name);
      case 'simulation':
        return /\b(sim|simulation|simulator|tycoon|build|craft|farm)\b/.test(name);
      case 'sports':
        return /\b(sports|football|soccer|basketball|baseball|hockey|tennis)\b/.test(name);
      case 'racing':
        return /\b(racing|race|car|drive|speed|track)\b/.test(name);
      case 'indie':
        return /\b(indie|pixel|retro|classic|arcade)\b/.test(name);
      case 'casual':
        return /\b(casual|puzzle|match|card|board|party)\b/.test(name);
      case 'puzzle':
        return /\b(puzzle|solve|logic|brain|match)\b/.test(name);
      default:
        return false;
    }
  }

  filter() {
    const minAppId = this.query.minAppId ? Number(this.query.minAppId) : undefined;
    const maxAppId = this.query.maxAppId ? Number(this.query.maxAppId) : undefined;
    const excludeTerms = this.query.excludeTerms as string;
    
    // Apply App ID range filtering
    if (minAppId !== undefined) {
      this.filteredGames = this.filteredGames.filter(game => game.appid >= minAppId);
    }

    if (maxAppId !== undefined) {
      this.filteredGames = this.filteredGames.filter(game => game.appid <= maxAppId);
    }

    // Apply exclude terms filtering
    if (excludeTerms) {
      const termsToExclude = excludeTerms.toLowerCase().split(',').map(term => term.trim());
      this.filteredGames = this.filteredGames.filter(game => {
        const gameName = game.name.toLowerCase();
        return !termsToExclude.some(term => gameName.includes(term));
      });
    }
    
    return this;
  }

  sort() {
    const sortBy = this.query.sortBy as string || 'name';
    const sortOrder = this.query.sortOrder as string || 'asc';
    
    this.filteredGames.sort((a, b) => {
      if (sortBy === 'appid') {
        return sortOrder === 'asc' ? a.appid - b.appid : b.appid - a.appid;
      } else {
        // Default sort by name
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        return sortOrder === 'asc' 
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      }
    });
    
    return this;
  }

  paginate() {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 24;
    const startIndex = (page - 1) * limit;
    const endIndex = Math.min(page * limit, this.filteredGames.length);
    
    const paginatedGames = this.filteredGames.slice(startIndex, endIndex);
    
    return {
      data: paginatedGames,
      meta: this.getMeta(page, limit)
    };
  }

  getMeta(page: number, limit: number) {
    const totalGames = this.filteredGames.length;
    const totalPages = Math.ceil(totalGames / limit);
    
    return {
      page,
      limit,
      totalGames,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      sortBy: this.query.sortBy || 'name',
      sortOrder: this.query.sortOrder || 'asc'
    };
  }
}

export default SteamQueryBuilder; 