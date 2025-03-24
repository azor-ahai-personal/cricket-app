json.fantasy_team do
    json.id @fantasy_team.id.to_s
    json.name @fantasy_team.name
    json.credits_spent @fantasy_team.credits_spent
    json.captain_id @fantasy_team.captain_id
    json.vice_captain_id @fantasy_team.vice_captain_id
    json.players @fantasy_team.players do |player|
        json.id player.id.to_s
    end
    json.published @fantasy_team.published
    json.contests @fantasy_team.contests do |contest|
        json.id contest.id.to_s
    end
end
