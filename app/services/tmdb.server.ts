import { api } from "~/utils/api.server";

const baseURL = "https://api.themoviedb.org/3";

export const discoverTVShows = async (
  page: number = 1,
  token: string,
  sortBy: string,
  withGenres: string
) => {
  let isDefault = false;
  if (!token) throw new Error("No token provided");

  if (!withGenres) {
    withGenres = "18|10759|80|9648|10768";
    isDefault = true;
  }

  //if withGenres contains comma, replace it with a pipe
  withGenres = withGenres.replace(/,/g, "|");

  const dateNextMonthFromNow = new Date();
  dateNextMonthFromNow.setMonth(dateNextMonthFromNow.getMonth() + 1);
  //set the date to the last day of the first week of the next month
  dateNextMonthFromNow.setDate(7);
  const dateNextMonthFromNowString = dateNextMonthFromNow
    .toISOString()
    .split("T")[0];

  let APIUrl = `${baseURL}/discover/tv?air_date.lte=${dateNextMonthFromNowString}&with_genres=${withGenres}&include_adult=false&include_null_first_air_dates=false&language=en-US&page=${page}&sort_by=${sortBy}&with_original_language=en`;

  if (sortBy === "vote_count.asc") {
    //less popular
    //make sure the shows already aired
    const today = new Date().toISOString().split("T")[0];
    APIUrl = `${baseURL}/discover/tv?vote_average.lte=6&&first_air_date.lte=${today}&with_genres=${withGenres}&include_adult=false&include_null_first_air_dates=false&language=en-US&page=${page}&sort_by=${sortBy}&with_original_language=en`;
  }

  if (sortBy === "vote_count.desc") {
    // APIUrl = `${baseURL}/discover/tv?vote_count.gte=50&with_genres=${withGenres}&include_adult=false&include_null_first_air_dates=false&language=en-US&page=${page}&sort_by=${sortBy}&with_original_language=en`;
    //highest rated
    //make sure the shows has vote average of 7 or more
    APIUrl = `${baseURL}/discover/tv?vote_average.gte=7&with_genres=${withGenres}&include_adult=false&include_null_first_air_dates=false&language=en-US&page=${page}&sort_by=${sortBy}&with_original_language=en`;
  }

  if (sortBy === "popularity.desc" || sortBy === "popularity.asc") {
    //get minimum date 5 years ago
    const date = new Date();
    date.setFullYear(date.getFullYear() - 5);
    const date7YearsAgo = date.toISOString().split("T")[0];
    if (sortBy === "popularity.desc") {
      //make sure it has vote average of 7 or more
      //we are using vote average because we want to show popular shows with good ratings
      APIUrl = `${baseURL}/discover/tv?vote_average.gte=7&air_date.gte=${date7YearsAgo}&with_genres=${withGenres}&include_adult=false&include_null_first_air_dates=false&language=en-US&page=${page}&sort_by=${sortBy}&with_original_language=en`;
    } else {
      APIUrl = `${baseURL}/discover/tv?air_date.gte=${date7YearsAgo}&with_genres=${withGenres}&include_adult=false&include_null_first_air_dates=false&language=en-US&page=${page}&sort_by=${sortBy}&with_original_language=en`;
    }

    if (isDefault) {
      //don't show talk shows, reality, news, and documentary by default
      const genresToExclude = "10764|10763|99|10767";
      APIUrl += `&without_genres=${genresToExclude}`;
    }
  }

  const response = await api(APIUrl, "GET", token);

  return response;
};

export const getTVShowDetails = async (id: string, token: string) => {
  if (!token) throw new Error("No token provided");

  const response = await api(`${baseURL}/tv/${id}`, "GET", token);

  return response;
};

export const getTVShowCredits = async (id: string, token: string) => {
  if (!token) throw new Error("No token provided");

  const response = await api(`${baseURL}/tv/${id}/credits`, "GET", token);

  return response;
};

export const getTVShowTrailer = async (id: string, token: string) => {
  if (!token) throw new Error("No token provided");

  const response = await api(`${baseURL}/tv/${id}/videos`, "GET", token);

  return response;
};

export const getTVShowGenres = async (token: string) => {
  if (!token) throw new Error("No token provided");

  const response = await api(
    `${baseURL}/genre/tv/list?language=en`,
    "GET",
    token
  );

  return response;
};

export const searchTVShows = async (
  page: number = 1, //for now, we are only showing 1 page. TEMPORARY
  token: string,
  query: string
) => {
  if (!token) throw new Error("No token provided");

  const response = await api(
    `${baseURL}/search/tv?query=${query}&include_adult=false&language=en-US&page=${page}`,
    "GET",
    token
  );

  return response;
};
