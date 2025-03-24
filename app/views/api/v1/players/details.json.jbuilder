json.teams @teams do |team|
  json.id team.id.to_s
  json.name team.name
  json.short_name team.short_name
  
  json.players team.players do |player|
    json.id player.id.to_s
    json.name player.name
    json.role player.role
    json.indian player.indian
    json.credits player.credits
    json.team_name team.name
    json.team_id team.id
    json.team_short_name team.short_name
  end
end 