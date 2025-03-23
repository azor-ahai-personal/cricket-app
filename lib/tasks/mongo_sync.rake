namespace :mongo do
  desc "Dump local players database and restore to production, while backing up production data"
  task sync_players: :environment do
    require 'fileutils'

    # Define your local and production database names
    local_db_name = 'cricket_app_development'  # Replace with your local database name
    production_db_name = 'cricket_app_production'  # Replace with your production database name
    backup_dir = './mongo_backup'
    production_backup_dir = './mongo_production_backup'
    PRODUCTION_MONGODB_URL = 'mongodb+srv://cation-alpha:cation-alpha-password@cluster0.iggkx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

    # Create backup directories if they don't exist
    FileUtils.mkdir_p(backup_dir)
    FileUtils.mkdir_p(production_backup_dir)

    # Backup the production players database
    puts "Backing up production players database..."
    production_uri = ENV['PRODUCTION_MONGODB_URL']  # Ensure this is set in your environment variables
    system("mongodump --uri='#{production_uri}' --db #{production_db_name} --collection players --out #{production_backup_dir}")

    # Dump the local players database
    puts "Dumping local players database..."
    system("mongodump --db #{local_db_name} --collection players --out #{backup_dir}")

    # Restore to production
    puts "Restoring players database to production..."
    system("mongorestore --uri='#{production_uri}' --db #{production_db_name} #{backup_dir}/#{local_db_name}/players.bson")

    puts "Sync completed!"
  end
end 

# Command to restore production database from local backup
# mongorestore --uri="mongodb+srv://cation-alpha:cation-alpha-password@cluster0.iggkx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0" --db cricket_app_production ./mongo_backup/cricket_app_development