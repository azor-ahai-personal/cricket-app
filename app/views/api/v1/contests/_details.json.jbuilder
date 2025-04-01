json.id contest.id
json.name contest.name
json.passkey contest.passkey
json.active contest.active
json.total_teams contest.participations.count
json.contest_owner do
  json.id contest.owner&.id
  json.email contest.owner&.email
  json.name contest.owner&.name
end
json.all_teams contest.participations do |participation|
  json.id participation.fantasy_team.id
  json.name participation.fantasy_team.name
  json.points participation.points
  json.owner do
    json.id participation.fantasy_team.user&.id
    json.email participation.fantasy_team.user&.email
    json.name participation.fantasy_team.user&.name
  end
  if current_user&.id == participation.fantasy_team.user&.id
    json.credits participation.fantasy_team.credits_spent
    json.players participation.fantasy_team.players do |player|
      json.id player.id.to_s
      json.name player.name
      json.role player.role
      json.indian player.indian
      json.credits player.credits
    end
  end
end