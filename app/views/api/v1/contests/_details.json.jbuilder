json.id contest.id
json.name contest.name
json.passkey contest.passkey
json.active contest.active
json.total_teams contest.total_teams
json.owner do
  json.id contest.owner&.id
  json.email contest.owner&.email
  json.name contest.owner&.name
end