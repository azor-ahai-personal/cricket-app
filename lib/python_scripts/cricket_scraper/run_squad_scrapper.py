from scraper import CricketScraper
import time

def main():
    scraper = CricketScraper('bb')
    
    # List of IPL team codes
    teams = [
        'CSK',
        'MI',
        'RCB',
        'KKR',
        'RR',
        'PBKS',
        'DC',
        'SRH',
        'GT',
        'LSG'
    ]
    
    # Scrape single team
    # scraper.scrape_squad('CSK')
    
    # Scrape all teams
    for team in teams:
        time.sleep(2)
        print(f"\nScraping {team} squad...")
        scraper.scrape_squad(team)
        print(f"Completed {team} squad scraping")
        print("-" * 50)

if __name__ == "__main__":
    main() 