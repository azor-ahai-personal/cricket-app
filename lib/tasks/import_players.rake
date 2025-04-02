namespace :import do
  desc "Import players from CSV files"
  task players: :environment do
    require 'csv'
    
    # First clear existing players
    puts "Clearing existing players..."
    Player.delete_all
    
    # Get all CSV files from data directory
    csv_files = Dir[Rails.root.join('data', '*_squad_2025.csv')]

    puts csv_files
    
    csv_files.each do |file|
      team_code = File.basename(file, '_squad_2025.csv').upcase
      team = IplTeam.find_by(short_name: team_code)
      
      if team.nil?
        puts "Error: Team #{team_code} not found in database"
        next
      end
      
      puts "\nImporting players for #{team.name}..."
      
      CSV.foreach(file, headers: true) do |row|
        player = Player.create!(
          name: row['Name'],
          team: team,
          role: row['Role']&.upcase,
          indian: row['Indian'].downcase == 'true',
          credits: row['Credits']
        )
        puts "Created player: #{player.name} (#{player.role})"
      rescue => e
        puts "Error creating player #{row['Name']}: #{e.message}"
      end
    end
    
    # Print summary
    puts "\nImport completed!"
    puts "Total players created: #{Player.count}"
    puts "\nPlayers by team:"
    IplTeam.all.each do |team|
      puts "#{team.short_name}: #{team.players.count} players"
    end
    
    puts "\nPlayers by role:"
    roles = Player.all.group_by(&:role)
    roles.each do |role, players|
      if players.count == 1
        puts "Error: Only one player found for role #{role}, #{players}"
      end 
      puts "#{role}: #{players.count} players"
    end
  end
end 