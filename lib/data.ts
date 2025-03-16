import { createSupabaseClient } from "./db";
import { Title } from "./definitions";

const db = await createSupabaseClient();

/**
 * Query all titles
 */
export async function fetchTitles(
  page: number,
  minYear: number,
  maxYear: number,
  query: string,
  genres: string[],
  userEmail: string
) {
  try {
    // Capitalize the first letter of each genre
    const capitalizedGenres = genres.map(genre => genre.charAt(0).toUpperCase() + genre.slice(1).toLowerCase());

    // Get favorites title ids
    const { data: favoritesData, error: favoritesError } = await db
      .from('favorites')
      .select('title_id')
      .eq('user_id', userEmail);

    if (favoritesError) throw favoritesError;

    const favorites = favoritesData.map((row) => row.title_id);

    // Get watch later title ids
    const { data: watchLaterData, error: watchLaterError } = await db
      .from('watchlater')
      .select('title_id')
      .eq('user_id', userEmail);

    if (watchLaterError) throw watchLaterError;

    const watchLater = watchLaterData.map((row) => row.title_id);

    // Fetch titles
    const { data: titlesData, error: titlesError } = await db
      .from('titles')
      .select('*')
      .gte('released', minYear)
      .lte('released', maxYear)
      .ilike('title', `%${query}%`)
      .in('genre', capitalizedGenres)
      .order('title', { ascending: true })
      .range((page - 1) * 6, page * 6 - 1);

    if (titlesError) throw titlesError;
    return titlesData.map((row) => ({
      ...row,
      favorited: favorites.includes(row.id),
      watchLater: watchLater.includes(row.id),
      image: `/images/${row.id}.webp`,
    }));
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch titles.");
  }
}

/**
 * Get a user's favorites list.
 */
export async function fetchFavorites(page: number, userEmail: string) {
  try {
    const { data: watchLaterData, error: watchLaterError } = await db
      .from('watchlater')
      .select('title_id')
      .eq('user_id', userEmail);

    if (watchLaterError) throw watchLaterError;

    const watchLater = watchLaterData.map((row) => row.title_id);

    const { data: titlesData, error: titlesError } = await db
      .from('titles')
      .select('titles.*')
      .innerJoin('favorites', 'titles.id', 'favorites.title_id')
      .eq('favorites.user_id', userEmail)
      .order('titles.released', { ascending: true })
      .range((page - 1) * 6, page * 6 - 1);

    if (titlesError) throw titlesError;

    return titlesData.map((row: Title) => ({
      ...row,
      favorited: true,
      watchLater: watchLater.includes(row.id),
      image: `/images/${row.id}.webp`,
    }));
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch favorites.");
  }
}

/**
 * Add a title to a user's favorites list.
 */
export async function insertFavorite(title_id: string, userEmail: string) {
  try {
    const { data, error } = await db
      .from('favorites')
      .insert({ title_id, user_id: userEmail });

    if (error) throw error;

    await insertActivity(title_id, userEmail, "FAVORITED");
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to add favorite.");
  }
}

/**
 * Remove a title from a user's favorites list.
 */
export async function deleteFavorite(title_id: string, userEmail: string) {
  try {
    const { data, error } = await db
      .from('favorites')
      .delete()
      .eq('title_id', title_id)
      .eq('user_id', userEmail);

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to delete favorite.");
  }
}

/**
 * Check if a title is in a user's favorites list.
 */
export async function favoriteExists(title_id: string, userEmail: string) {
  try {
    const { data, error } = await db
      .from('favorites')
      .select('*')
      .eq('title_id', title_id)
      .eq('user_id', userEmail);

    if (error) throw error;

    return data.length > 0;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch favorite.");
  }
}

/**
 * Get a user's watch later list.
 */
export async function fetchWatchLaters(page: number, userEmail: string) {
  try {
    const { data: favoritesData, error: favoritesError } = await db
      .from('favorites')
      .select('title_id')
      .eq('user_id', userEmail);

    if (favoritesError) throw favoritesError;

    const favorites = favoritesData.map((row) => row.title_id);

    const { data: titlesData, error: titlesError } = await db
      .from('titles')
      .select('titles.*')
      .innerJoin('watchlater', 'titles.id', 'watchlater.title_id')
      .eq('watchlater.user_id', userEmail)
      .order('titles.released', { ascending: true })
      .range((page - 1) * 6, page * 6 - 1);

    if (titlesError) throw titlesError;

    return titlesData.map((row: Title) => ({
      ...row,
      favorited: favorites.includes(row.id),
      watchLater: true,
      image: `/images/${row.id}.webp`,
    }));
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch watch later.");
  }
}

/**
 * Add a title to a user's watch later list.
 */
export async function insertWatchLater(title_id: string, userEmail: string) {
  try {
    const { data, error } = await db
      .from('watchlater')
      .insert({ title_id, user_id: userEmail });

    if (error) throw error;

    await insertActivity(title_id, userEmail, "WATCH_LATER");
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to add watch later.");
  }
}

/**
 * Remove a title from a user's watch later list.
 */
export async function deleteWatchLater(title_id: string, userEmail: string) {
  try {
    const { data, error } = await db
      .from('watchlater')
      .delete()
      .eq('title_id', title_id)
      .eq('user_id', userEmail);

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to delete watch later.");
  }
}

/**
 * Check if a movie title exists in a user's watch later list.
 */
export async function watchLaterExists(title_id: string, userEmail: string): Promise<boolean> {
  try {
    const { data, error } = await db
      .from('watchlater')
      .select('*')
      .eq('title_id', title_id)
      .eq('user_id', userEmail);

    if (error) throw error;

    return data.length > 0;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch watch later.");
  }
}

/**
 * Get all genres for titles.
 */
export async function fetchGenres(): Promise<string[]> {
  const { data, error } = await db
    .from('titles')
    .select('genre');

  if (error) {
    console.error('Error fetching genres:', error);
    throw new Error("Failed to fetch genres.");
  }
  //supabase has no distinct property, so im going to grossly just remove dups manually by using set()
  const uniqueGenres = Array.from(new Set(data.map(row => row.genre)));

  return uniqueGenres;
}


/**
 * Get a user's activities list.
 */
export async function fetchActivities(page: number, userEmail: string) {
  try {
    const { data, error } = await db
      .from('activities')
      .select(`
        id,
        timestamp,
        activity,
        titles ( title )
      `)
      .eq('user_id', userEmail)
      .order('timestamp', { ascending: false })
      .range((page - 1) * 10, page * 10 - 1);

    if (error) throw error;

    const flattenedData = data.map(activity => ({
      id: activity.id,
      timestamp: activity.timestamp,
      activity: activity.activity,
      title: activity.titles[0]?.title ?? 'Unknown'
    }));

    return flattenedData;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch activities.");
  }
}



async function insertActivity(
  title_id: string,
  userEmail: string,
  activity: "FAVORITED" | "WATCH_LATER"
) {
  try {
    const { data, error } = await db
      .from('activities')
      .insert({ title_id, user_id: userEmail, activity });

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to add activity.");
  }
}

export async function checkDbConnection(): Promise<boolean> {
  try {
    // Perform a simple query to check the connection
    const { data, error } = await db.from('titles').select('*');
    if (error) {
      console.error('Error fetching data:', error);
    } else {
      console.log("DB is connected")
    }
    return true
  } catch (error) {
    console.error("Database connection failed:", error);
    return false;
  }
}
