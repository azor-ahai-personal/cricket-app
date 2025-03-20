import requests
from bs4 import BeautifulSoup
import pandas as pd
import os

class CricketScraper:
    def __init__(self, url):
        self.url = url
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        }
        
    def scrape_match_data(self):
        print(f"Fetching URL: {self.url}")
        response = requests.get(self.url, headers=self.headers)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Scrape batting data
        print("\nScraping batting data...")
        batting_data = self._scrape_batting(soup)
        
        # Scrape bowling data
        print("\nScraping bowling data...")
        bowling_data = self._scrape_bowling(soup)
        
        # Save both to CSV
        if not batting_data.empty:
            self.save_to_csv(batting_data, 'batting_scorecard.csv')
        if not bowling_data.empty:
            self.save_to_csv(bowling_data, 'bowling_scorecard.csv')
            
        return batting_data, bowling_data
    
    def _scrape_batting(self, soup):
        all_batting_data = []
        batting_tables = soup.find_all('table', class_='ds-w-full ds-table ds-table-md ds-table-fixed')
        
        for table in batting_tables:
            rows = table.find_all('tr')
            for row in rows:
                player_cell = row.find('td', class_='ds-w-0')
                if player_cell and player_cell.find('a'):
                    cells = row.find_all('td')
                    if len(cells) >= 8:
                        player = player_cell.text.strip()
                        runs = cells[2].text.strip()
                        balls = cells[3].text.strip()
                        fours = cells[5].text.strip()
                        sixes = cells[6].text.strip()
                        sr = cells[7].text.strip()
                        
                        if runs.isdigit():  # Only add if runs is a number
                            all_batting_data.append({
                                'Player': player,
                                'Runs': runs,
                                'Balls': balls,
                                '4s': fours,
                                '6s': sixes,
                                'SR': sr
                            })
        
        return pd.DataFrame(all_batting_data)
    
    def _scrape_bowling(self, soup):
        all_bowling_data = []
        bowling_tables = soup.find_all('table', class_='ds-w-full ds-table ds-table-md ds-table-fixed')
        
        for table in bowling_tables:
            rows = table.find_all('tr')
            for row in rows:
                bowler_cell = row.find('td', class_='ds-min-w-max')
                if bowler_cell and bowler_cell.find('a'):
                    cells = row.find_all('td')
                    if len(cells) >= 11:
                        bowler = bowler_cell.text.strip()
                        overs = cells[1].text.strip()
                        maidens = cells[2].text.strip()
                        runs = cells[3].text.strip()
                        wickets = cells[4].text.strip()
                        economy = cells[5].text.strip()
                        
                        if overs and runs:  # Only add if basic stats exist
                            all_bowling_data.append({
                                'Bowler': bowler,
                                'O': overs,
                                'M': maidens,
                                'R': runs,
                                'W': wickets,
                                'Econ': economy
                            })
        
        return pd.DataFrame(all_bowling_data)

    def scrape_mvp_data(self):
        print(f"Fetching URL: {self.url}")
        response = requests.get(self.url, headers=self.headers)
        
        # Save HTML for debugging
        with open('debug.html', 'w') as f:
            f.write(response.text)
        print("Saved HTML to debug.html for inspection")
        
        soup = BeautifulSoup(response.text, 'html.parser')
        mvp_data = []
        
        # Look for table with specific class
        mvp_table = soup.find('table', class_='ds-w-full ds-table ds-table-md ds-table-auto')
        
        if mvp_table:
            print("Found MVP table")
            rows = mvp_table.find_all('tr')
            print(f"Found {len(rows)} rows")
            
            for row in rows[1:]:  # Skip header row
                cells = row.find_all('td')
                if len(cells) >= 3:
                    player = cells[0].text.strip()
                    team = cells[1].text.strip()
                    ti = cells[2].text.strip()
                    
                    if ti and ti != '-':
                        mvp_data.append({
                            'Player': player,
                            'Team': team,
                            'Total Impact': float(ti) if ti.replace('.', '').replace('-', '').isdigit() else ti
                        })
                        print(f"Found player: {player} - Team: {team} - TI: {ti}")

        if not mvp_data:
            print("No data found in table. Available tables:")
            all_tables = soup.find_all('table')
            for i, table in enumerate(all_tables):
                print(f"Table {i+1} classes: {table.get('class', 'No class')}")
        
        return pd.DataFrame(mvp_data)

    def save_to_csv(self, df, filename):
        data_dir = 'lib/python_scripts/cricket_scraper/data'
        os.makedirs(data_dir, exist_ok=True)
        
        if not df.empty:
            output_path = os.path.join(data_dir, filename)
            df.to_csv(output_path, index=False)
            print(f"Data saved to {output_path}")
        else:
            print("No MVP data found!") 