import { createSupabaseClient } from "./db";
import { Title } from "./definitions";

interface Activity {
  id: string;
  timestamp: string;
  activity: string;
  title: string;
}

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
    const capitalizedGenres = genres.map(genre =>
      genre
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join('-')
    );
    
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
export async function fetchFavorites(userEmail: string) {
  try {
    // Fetch favorite movie IDs
    const { data: favoriteIdsData, error: favoriteIdsError } = await db
      .from('favorites')
      .select('title_id')
      .eq('user_id', userEmail);

    if (favoriteIdsError) throw favoriteIdsError;

    const favoriteIds = favoriteIdsData.map((row) => row.title_id);

    // Fetch watch later movie IDs
    const { data: watchLaterIdsData, error: watchLaterIdsError } = await db
      .from('watchlater')
      .select('title_id')
      .eq('user_id', userEmail);

    if (watchLaterIdsError) throw watchLaterIdsError;

    const watchLaterIds = watchLaterIdsData.map((row) => row.title_id);

    // Fetch movie details for favorite movie IDs
    const { data: titlesData, error: titlesError } = await db
      .from('titles')
      .select('*')
      .in('id', favoriteIds);

    if (titlesError) throw titlesError;

    return titlesData.map((row: Title) => ({
      ...row,
      favorited: true,
      watchLater: watchLaterIds.includes(row.id),
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
export async function fetchWatchLaters(userEmail: string) {
  try {
    // Fetch favorite movie IDs
    const { data: favoriteIdsData, error: favoriteIdsError } = await db
      .from('favorites')
      .select('title_id')
      .eq('user_id', userEmail);

    if (favoriteIdsError) throw favoriteIdsError;

    const favoriteIds = favoriteIdsData.map((row) => row.title_id);

    // Fetch watch later movie IDs
    const { data: watchLaterIdsData, error: watchLaterIdsError } = await db
      .from('watchlater')
      .select('title_id')
      .eq('user_id', userEmail);

    if (watchLaterIdsError) throw watchLaterIdsError;

    const watchLaterIds = watchLaterIdsData.map((row) => row.title_id);

    // Fetch movie details for watch later movie IDs
    const { data: titlesData, error: titlesError } = await db
      .from('titles')
      .select('*')
      .in('id', watchLaterIds);

    if (titlesError) throw titlesError;

    return titlesData.map((row: Title) => ({
      ...row,
      favorited: favoriteIds.includes(row.id),
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
export async function fetchActivities(page: number, userEmail: string): Promise<Activity[]> {
  try {
    // Fetch activity data including title_id
    const { data: activitiesData, error: activitiesError } = await db
      .from('activities')
      .select('id, timestamp, activity, title_id')
      .eq('user_id', userEmail)
      .order('timestamp', { ascending: false })
      .range((page - 1) * 10, page * 10 - 1);

    if (activitiesError) throw activitiesError;

    const titleIds = activitiesData.map(activity => activity.title_id);

    // Fetch title details for each title_id
    const { data: titlesData, error: titlesError } = await db
      .from('titles')
      .select('id, title')
      .in('id', titleIds);

    if (titlesError) throw titlesError;

    // Create a map of title_id to title
    const titleMap: { [key: string]: string } = titlesData.reduce((acc: { [key: string]: string }, title: { id: string, title: string }) => {
      acc[title.id] = title.title;
      return acc;
    }, {});

    // Combine activity data with title details
    const flattenedData: Activity[] = activitiesData.map(activity => ({
      id: activity.id,
      timestamp: activity.timestamp,
      activity: activity.activity,
      title: titleMap[activity.title_id] || 'Unknown'
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
