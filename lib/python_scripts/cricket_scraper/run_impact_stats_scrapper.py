from scraper import CricketScraper
import re
from datetime import datetime

def extract_teams_and_date(url):
    # Extract team names and date from the URL
    match = re.search(r'/([a-z-]+)-vs-([a-z-]+)-(\d+)', url)
    if match:
        team1 = match.group(1).replace('-', '_')
        team2 = match.group(2).replace('-', '_')
        match_number = match.group(3)
        return f"{team1}_vs_{team2}_{match_number}_mvp_stats.csv"
    return "mvp_stats.csv"  # Fallback filename

def main():
    # Use the Impact Player URL instead of scorecard
    impact_url = "https://www.espncricinfo.com/series/ipl-2025-1449924/chennai-super-kings-vs-mumbai-indians-3rd-match-1473440/match-impact-player"
    
    try:
        print("Starting MVP stats scraper...")
        scraper = CricketScraper(impact_url)
        mvp_data = scraper.scrape_mvp_data()
        
        if not mvp_data.empty:
            # Generate the filename dynamically
            filename = extract_teams_and_date(impact_url)
            scraper.save_to_csv(mvp_data, filename)
            print(f"\nMVP Statistics saved to {filename}:")
            print(mvp_data)
        else:
            print("No MVP data was found!")
            
    except Exception as e:
        print(f"An error occurred: {str(e)}")

if __name__ == "__main__":
    main() 