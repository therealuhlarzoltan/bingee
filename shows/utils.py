from requests import request

from .credentials import API_KEY, API_HOST

from .models import Series, Season, Episode


def make_request(method, url, parameters):
    headers = {
	"X-RapidAPI-Key": API_KEY,
	"X-RapidAPI-Host": API_HOST
    }

    response = request(method=method, url=url, headers=headers, params=parameters)

    return response

def add_series_to_database(title, title_id, image):
    response = make_request("GET", url="https://imdb8.p.rapidapi.com/title/get-seasons", parameters={"tconst": title_id})

    if response.status_code == 200:
        response_json = response.json()
        series = Series.objects.create(title=title, title_id=title_id, image=image)
        series.save()
        for season in response_json:
            season_obj = Season.objects.create(series=series, season=season.get("season"))
            season_obj.save()
            episodes = season.get("episodes")
            for episode in episodes:
                episode_obj = Episode.objects.create(episode_id=episode.get("id")[7:-1], episode_title=episode.get("title"), 
                                episode=episode.get("episode"), year=episode.get("year"), season=season_obj, series=series)
                episode_obj.save()




