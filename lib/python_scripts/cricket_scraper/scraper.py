import requests
from bs4 import BeautifulSoup
import pandas as pd
import os
import time

class CricketScraper:
    def __init__(self, url):
        self.url = url
        
    def scrape_batting_scorecard(self):
        # Add more sophisticated headers
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Connection': 'keep-alive',
        }
        
        try:
            # Add delay to avoid rate limiting
            time.sleep(2)
            
            print(f"Fetching URL: {self.url}")
            response = requests.get(self.url, headers=headers)
            print(f"Response status code: {response.status_code}")
            
            # Save HTML for debugging
            debug_dir = 'lib/python_scripts/cricket_scraper/debug'
            os.makedirs(debug_dir, exist_ok=True)
            with open(f"{debug_dir}/response.html", "w") as f:
                f.write(response.text)
            print(f"Saved response HTML to {debug_dir}/response.html")
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Debug print
            print("\nSearching for tables...")
            all_tables = soup.find_all('table')
            print(f"Total tables found: {len(all_tables)}")
            
            all_batting_data = []
            
            # Try different table classes that ESPN might use
            table_classes = [
                'ci-scorecard-table',
                'table batsman',
                'ds-w-full ds-table ds-table-xs ds-table-fixed',
                'ds-w-full ds-table ds-table-md ds-table-fixed'
            ]
            
            for class_name in table_classes:
                print(f"\nLooking for tables with class: {class_name}")
                batting_tables = soup.find_all('table', class_=class_name)
                print(f"Found {len(batting_tables)} tables with this class")
                
                for table in batting_tables:
                    rows = table.find_all('tr')
                    print(f"Found {len(rows)} rows in table")
                    
                    for row in rows:
                        # Try different cell classes
                        player_cell = (
                            row.find('td', class_='ds-w-0') or 
                            row.find('td', class_='batsman-cell') or
                            row.find('a', class_='ds-inline-flex ds-items-start ds-leading-none')
                        )
                        
                        if player_cell:
                            cells = row.find_all('td')
                            if len(cells) >= 8:
                                player = player_cell.text.strip()
                                runs = cells[2].text.strip()
                                balls = cells[3].text.strip()
                                fours = cells[5].text.strip()
                                sixes = cells[6].text.strip()
                                sr = cells[7].text.strip()
                                
                                print(f"Found player: {player}")
                                
                                all_batting_data.append({
                                    'Player': player,
                                    'Runs': runs,
                                    'Balls': balls,
                                    '4s': fours,
                                    '6s': sixes,
                                    'SR': sr
                                })
            
            print(f"\nTotal entries found: {len(all_batting_data)}")
            
            if not all_batting_data:
                print("No batting data found. Check the HTML structure in the debug directory.")
                return pd.DataFrame()
            
            return pd.DataFrame(all_batting_data)
            
        except Exception as e:
            print(f"Error during scraping: {str(e)}")
            return pd.DataFrame()

    def save_to_csv(self, df, filename='scorecard.csv'):
        data_dir = 'lib/python_scripts/cricket_scraper/data'
        os.makedirs(data_dir, exist_ok=True)
        
        if not df.empty:
            output_path = os.path.join(data_dir, filename)
            df.to_csv(output_path, index=False)
            print(f"Data saved to {output_path}")
        else:
            print("No data to save!") 