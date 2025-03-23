namespace :scraper do
  desc "Scrape cricket scorecard data"
  task :impact_stats do
    puts "Starting cricket scorecard scraper..."
    # system "python3 lib/python_scripts/cricket_scraper/run_impact_stats_scrapper.py"
    commands = [
      "cd #{Rails.root}",
      "source lib/python_scripts/cricket_scraper/venv/bin/activate",
      "python lib/python_scripts/cricket_scraper/run_impact_stats_scrapper.py"
    ]
    system commands.join(" && ")
  end

  desc "Scrape squad data"
  task :squad do
    puts "Starting squad scraper..."
    
    # Ensure the Python virtual environment is activated and run the script
    commands = [
      "cd #{Rails.root}",
      "source lib/python_scripts/cricket_scraper/venv/bin/activate",
      "python lib/python_scripts/cricket_scraper/run_squad_scrapper.py"
    ]
    system commands.join(" && ")
  end
end 