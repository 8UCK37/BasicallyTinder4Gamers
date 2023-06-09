import sys
import json
import requests
from bs4 import BeautifulSoup

player_data = {}


def extract_values_from_div(div):
    values = []
    inner_divs = div.find_all('div')

    if inner_divs:
        for inner_div in inner_divs:
            value = inner_div.get('set')
            if value:
                values.append(value)

    if values:
        player_data['topAgent'] = values[0]
        player_data['hours'] = values[1]
        player_data['winPer'] = values[2]
        player_data['kd'] = values[3]
        player_data['adr'] = values[4]
        player_data['acs'] = values[5]
    return values
def extract_values_from_giant_stats(div):
    values = {}
    name_spans = div.find_all('span', class_='name')
    value_spans = div.find_all('span', class_='value')
    rank_spans =  div.find_all('span', class_='rank')
    
    for name_span, value_span,rank_spans in zip(name_spans, value_spans,rank_spans):
        name = name_span.text.strip()
        value = value_span.text.strip()
        attrRank = rank_spans.text.strip()
        values[name] = {'value':value,'rank':attrRank}
    
    return values

def extract_giant_stats(giant_stats):
    
    stat_divs = giant_stats.find_all('div', class_='stat align-left giant expandable')
    for stat_div in stat_divs:
        values = extract_values_from_giant_stats(stat_div)
        player_data.update(values)
        
def extract_values_from_main_stats(div):
    values = {}
    
    numbers = div.find('div', class_='numbers')
    name_spans = numbers.find_all('span', class_='name')
    value_spans = numbers.find_all('span', class_='value')
    rank_spans = numbers.find_all('span', class_='rank')
    #print(rank_spans)
    if(len(rank_spans)==0):
        for name_span, value_span in zip(name_spans, value_spans):
            name = name_span.text.strip()
            value = value_span.text.strip()
            values[name] = {'value':value}
            
    else:
        for name_span, value_span,rank_span in zip(name_spans, value_spans,rank_spans):
            name = name_span.text.strip()
            value = value_span.text.strip()
            attRank=rank_span.text.strip()
            values[name] = {'value':value,'rank':attRank}
            
    
    return values

def extract_main_stats(div):
    stat_divs = div.find_all('div', class_='stat align-left expandable')
    for stat_div in stat_divs:
        values=extract_values_from_main_stats(stat_div)
        player_data.update(values)


name = sys.argv[1]
nId = sys.argv[2]
url = f'https://tracker.gg/valorant/profile/riot/{name}%23{nId}/overview'
response = requests.get(url)
html = response.text

soup = BeautifulSoup(html, 'html.parser')

rankDiv = soup.find('div', class_='rating-entry__rank-info')
rank = rankDiv.find('div', class_='value').text.strip()
player_data['rank'] = rank

agentDiv = soup.find('div', class_='st-content__category')
matchesPlayed = agentDiv.find('div', class_='label')
timesPlayed = matchesPlayed.text.strip()
player_data['matchesPlayed'] = timesPlayed

divs = soup.find_all('div', class_='st-content__item')

for div in divs:
    imageDiv = div.find('div', class_='image')
    img_tag = imageDiv.find('img')
    if img_tag:
        src_url = img_tag['src']
        player_data['agentUrl'] = src_url
    values = extract_values_from_div(div)
    break
giant_statsDiv = soup.find('div', class_='giant-stats')
extract_giant_stats(giant_statsDiv)

main_statsDiv = soup.find('div', class_='main')
extract_main_stats(main_statsDiv)

json_data = json.dumps(player_data)
print(json_data)
