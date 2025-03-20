from scraper import CricketScraper

def main():
    try:
        print("Starting CSK squad scraper...")
        scraper = CricketScraper('https://www.espncricinfo.com/series/indian-premier-league-2023-1345038/chennai-super-kings-squad-1458628/series-squads')
        
        # Scrape CSK squad
        squad_data = scraper.scrape_squad()
        
        if not squad_data.empty:
            scraper.save_to_csv(squad_data, 'csk_squad_2024.csv')
            print("\nSquad Statistics:")
            print(squad_data)
            
            # Print summary
            print("\nPlayers by category:")
            print(squad_data.groupby('Role').size())
        else:
            print("No squad data was found!")
            
    except Exception as e:
        print(f"An error occurred: {str(e)}")

if __name__ == "__main__":
    main() 