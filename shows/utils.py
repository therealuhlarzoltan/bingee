from requests import request

from .credentials import API_KEY, API_HOST


def make_request(method, url, parameters):
    headers = {
	"X-RapidAPI-Key": API_KEY,
	"X-RapidAPI-Host": API_HOST
    }

    response = request(method=method, url=url, headers=headers, params=parameters)

    return response

