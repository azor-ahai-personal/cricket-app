from scraper import CricketScraper

def main():
    # Use the Impact Player URL instead of scorecard
    impact_url = "https://www.espncricinfo.com/series/indian-premier-league-2023-1345038/gujarat-titans-vs-chennai-super-kings-final-1370353/match-impact-player"
    
    try:
        print("Starting MVP stats scraper...")
        scraper = CricketScraper(impact_url)
        mvp_data = scraper.scrape_mvp_data()
        
        if not mvp_data.empty:
            scraper.save_to_csv(mvp_data, 'mvp_stats.csv')
            print("\nMVP Statistics:")
            print(mvp_data)
        else:
            print("No MVP data was found!")
            
    except Exception as e:
        print(f"An error occurred: {str(e)}")

if __name__ == "__main__":
    main() 