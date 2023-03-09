import reddit_scrapper
import article_scrapper
import article_sentiment_classifier
import pickle
import json

output_pickle_file = 'example_output.pickle'
output_json_file = 'example_output.json'

subs = reddit_scrapper.get_submissions('apple', (2022, 12, 1), (2023, 1, 1))
cleaned = reddit_scrapper.clean_submissions(subs, 'apple')
ordered = reddit_scrapper.sort_submissions(cleaned)
scraped = article_scrapper.scrape_top_25_articles(ordered)
analysed = article_sentiment_classifier.get_sentiments(scraped)

with open(output_pickle_file, 'wb') as file:
    pickle.dump({'ordered_dict': ordered, 'analysed_dict': analysed}, file)

json_dict = {}
for index, article in enumerate(analysed):
    json_dict[f'article_{index}'] = {'title': article['pushshift']['title'],
                                     'body': article['newsplease'].maintext,
                                     'sentiment': article['flair']}

with open(output_json_file, 'w') as file:
    json.dump(json_dict, file, indent=4)
