class Participation
    include Mongoid::Document
    include Mongoid::Timestamps

    belongs_to :user
    belongs_to :contest
    belongs_to :fantasy_team

    field :points, type: Integer, default: 0
    field :rank, type: Integer, default: 0
    field :orange_cap_player_id, type: String, default: nil
    field :purple_cap_player_id, type: String, default: nil
    field :player_of_the_tournament_id, type: String, default: nil
    
    field :top_teams, type: Array, default: []

    validates :user_id, uniqueness: { scope: :contest_id }
end