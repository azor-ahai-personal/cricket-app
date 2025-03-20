def safe_get_text(element):
    try:
        return element.text.strip() if element else "N/A"
    except Exception as e:
        print(f"Error getting text: {str(e)}")
        return "N/A"

def get_match_info(soup):
    match_header = soup.find('div', class_='match-header')
    return match_header.text.strip() if match_header else "Unknown Match"

def get_team_name(table):
    team_header = table.find_previous('div', class_='team-header')
    return team_header.text.strip() if team_header else "Unknown Team"

def print_html_structure(soup):
    """Debug function to print HTML structure"""
    print("\nHTML Structure:")
    print("Tables found:", len(soup.find_all('table')))
    print("Batting tables found:", len(soup.find_all('table', class_='ci-scorecard-table'))) 