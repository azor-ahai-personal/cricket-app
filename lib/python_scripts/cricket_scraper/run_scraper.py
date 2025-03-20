from scraper import CricketScraper

def main():
    # Use a recent IPL match scorecard URL
    scorecard_url = "https://www.espncricinfo.com/series/indian-premier-league-2023-1345038/gujarat-titans-vs-chennai-super-kings-final-1370353/full-scorecard"
    try:
        scraper = CricketScraper(scorecard_url)
        batting_data = scraper.scrape_batting_scorecard()
        scraper.save_to_csv(batting_data)
        print("\nScraped Data:")
        print(batting_data)
        
    except Exception as e:
        print(f"An error occurred: {str(e)}")

if __name__ == "__main__":
    main() 